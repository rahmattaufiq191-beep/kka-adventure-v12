const express = require('express');
const http = require('http');
const crypto = require('crypto');
const { Server } = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 1e5 });
const PORT = process.env.PORT || 3000;
const ADMIN_PIN = process.env.ADMIN_PIN || '123456'; // Ganti melalui environment variable saat deploy.
const rooms = new Map();
app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (_req, res) => res.json({ ok: true, service: 'KKA Adventure Multiplayer' }));
function cleanText(v, max=18) { return String(v ?? '').replace(/[<>\u0000-\u001f]/g, '').trim().slice(0,max); }
function roomPlayers(room) { return [...(rooms.get(room)?.values() || [])]; }
function adminSnapshot() { return [...rooms.entries()].flatMap(([room, players]) => [...players.values()].map(p => ({ ...p, room }))); }
function broadcastAdmins() { for (const admin of io.sockets.sockets.values()) if (admin.data.isAdmin) admin.emit('admin-snapshot', adminSnapshot()); }
io.on('connection', socket => {
  socket.on('join-room', data => {
    const room = cleanText(data?.room || 'KELAS10', 20).replace(/[^a-zA-Z0-9_-]/g, '') || 'KELAS10';
    const name = cleanText(data?.name || 'Petualang', 18) || 'Petualang';
    if (socket.data.room) return;
    socket.data.room = room; socket.data.name = name;
    socket.join(room);
    if (!rooms.has(room)) rooms.set(room, new Map());
    const player = { id: socket.id, name, room, x: 0, z: 0, rotation: 0, moving: false, score: Math.max(0, Number(data?.score)||0), done: [], miniDone: [], currentMission: '-', answered: 0, correct: 0, joinedAt: Date.now(), lastActive: Date.now() };
    rooms.get(room).set(socket.id, player);
    socket.emit('joined', { room, players: roomPlayers(room) });
    socket.to(room).emit('player-joined', player);
    socket.to(room).emit('room-players', roomPlayers(room).filter(p => p.id !== socket.id));
    broadcastAdmins();
  });
  socket.on('player-update', data => {
    const room = socket.data.room, players = rooms.get(room); if (!players?.has(socket.id)) return;
    const p = players.get(socket.id);
    p.lastActive = Date.now();
    p.x = Math.max(-55, Math.min(55, Number(data?.x) || 0));
    p.z = Math.max(-55, Math.min(55, Number(data?.z) || 0));
    p.rotation = Number(data?.rotation) || 0; p.moving = !!data?.moving;
    io.to(room).except(socket.id).emit('player-moved', p);
  });
  socket.on('score-update', score => { const p=rooms.get(socket.data.room)?.get(socket.id); if(!p)return; p.score=Math.max(0,Math.min(99999,Number(score)||0)); p.lastActive=Date.now(); socket.to(socket.data.room).emit('room-players',roomPlayers(socket.data.room).filter(x=>x.id!==socket.id)); broadcastAdmins(); });
  socket.on('student-progress', data => {
    const p = rooms.get(socket.data.room)?.get(socket.id); if (!p) return;
    p.done = Array.isArray(data?.done) ? [...new Set(data.done.map(n => Math.max(0, Math.min(5, Number(n)||0))))].slice(0,6) : p.done;
    p.miniDone = Array.isArray(data?.miniDone) ? [...new Set(data.miniDone.map(v => cleanText(v, 16)).filter(v => ['jelajah','lari','jatuh','detektif','pasar','jembatan'].includes(v)))].slice(0,6) : (p.miniDone || []);
    p.currentMission = cleanText(data?.currentMission || '-', 60) || '-';
    p.answered = Math.max(0, Math.min(1000, Number(data?.answered)||0));
    p.correct = Math.max(0, Math.min(p.answered, Number(data?.correct)||0));
    p.lastActive = Date.now();
    io.to(socket.data.room).emit('room-players', roomPlayers(socket.data.room));
    broadcastAdmins();
  });
  socket.on('chat-message', raw => { const room=socket.data.room; if(!room)return; const message=cleanText(raw,180); if(!message)return; io.to(room).emit('chat',{name:socket.data.name,message}); });
  socket.on('admin-auth', pin => {
    const now = Date.now();
    if (socket.data.authLockedUntil && now < socket.data.authLockedUntil) { socket.emit('admin-auth-result', { ok: false, message: 'Terlalu banyak percobaan. Coba lagi sebentar.' }); return; }
    const supplied = Buffer.from(String(pin || '')); const expected = Buffer.from(String(ADMIN_PIN));
    const valid = supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);
    if (!valid) { socket.data.authFailures = (socket.data.authFailures || 0) + 1; if (socket.data.authFailures >= 5) { socket.data.authLockedUntil = now + 30000; socket.data.authFailures = 0; } socket.emit('admin-auth-result', { ok: false, message: 'PIN guru salah.' }); return; }
    socket.data.authFailures = 0; socket.data.authLockedUntil = 0;
    socket.data.isAdmin = true; socket.emit('admin-auth-result', { ok: true });
    socket.emit('admin-snapshot', adminSnapshot());
  });
  socket.on('admin-refresh', () => {
    if (!socket.data.isAdmin) return;
    socket.emit('admin-snapshot', adminSnapshot());
  });
  socket.on('disconnect', () => { const room=socket.data.room; if(!room)return; const players=rooms.get(room); players?.delete(socket.id); socket.to(room).emit('player-left',{id:socket.id,name:socket.data.name}); broadcastAdmins(); if(players?.size===0)rooms.delete(room); });
});
server.listen(PORT, () => console.log(`KKA Adventure Multiplayer berjalan pada port ${PORT}`));
