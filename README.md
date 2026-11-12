# KKA Adventure Multiplayer — 3D Roblox Adventure Edition (V3)

Media pembelajaran Koding dan Kecerdasan Artifisial (KKA) untuk Kelas X Fase E. Aplikasi mencakup dunia 3D, enam misi materi, enam mini game, ruang multiplayer, chat kelas, dan dashboard guru.

## Fitur V3
- Tampilan antarmuka baru dengan layout responsif untuk desktop dan ponsel.
- Enam mini game dengan arena 3D block-world bergaya Roblox, avatar petualang, dan lingkungan tematik berbeda.
- Setiap game membuka arena 3D tersendiri; siswa menjawab soal melalui panel pilihan interaktif.
- Posisi pilihan jawaban diacak pada setiap soal, termasuk soal misi dan mini game.
- Dashboard guru menampilkan siswa online, ruang aktif, skor, progres enam misi, progres enam mini game, aktivitas, dan akurasi jawaban.
- Ekspor rekap sesi online ke CSV.
- Pembatasan percobaan login dashboard: setelah lima PIN salah, koneksi tersebut dikunci selama 30 detik.

## Menjalankan di komputer
1. Instal Node.js 18 atau lebih baru.
2. Ekstrak ZIP ini.
3. Buka terminal pada folder `kka_multiplayer`.
4. Jalankan `npm install`.
5. Atur PIN guru sebelum digunakan bersama. Contoh PowerShell: `$env:ADMIN_PIN="PIN-GURU-YANG-KUAT"`. Contoh macOS/Linux: `export ADMIN_PIN="PIN-GURU-YANG-KUAT"`.
6. Jalankan `npm start`.
7. Buka game: `http://localhost:3000`.
8. Buka dashboard guru: `http://localhost:3000/teacher.html`.

Jika `ADMIN_PIN` tidak diatur, server masih menggunakan PIN default pengembangan `123456`. Jangan gunakan konfigurasi default untuk server yang dapat diakses publik.

## Bermain bersama
- Satu komputer menjalankan server.
- Siswa pada Wi-Fi yang sama dapat membuka alamat IP lokal komputer server, misalnya `http://192.168.1.10:3000`. Izinkan akses melalui firewall jika diminta.
- Semua siswa memakai kode ruang yang sama, misalnya `KELAS10`.
- Untuk jaringan berbeda, deploy ke hosting Node.js yang mendukung WebSocket dan bagikan URL HTTPS. Build command `npm install`, start command `npm start`, runtime Node.js 18+.

## Catatan penting
- Dashboard hanya menampilkan siswa yang sedang online. Data sesi disimpan di memori server dan hilang ketika server dimulai ulang; database dan arsip nilai permanen belum tersedia.
- Skor dan progres masih dikirim oleh browser siswa. Pembatasan login guru bukan pengganti autentikasi penuh. Gunakan aplikasi untuk latihan dan pemantauan formatif, bukan ujian resmi atau penilaian berisiko tinggi.
- Gunakan nama panggilan/inisial, bukan data pribadi sensitif siswa.
- Three.js dimuat dari CDN, sehingga visual 3D memerlukan koneksi internet.
- Socket.IO menggunakan koneksi same-origin. Untuk penggunaan publik, aktifkan HTTPS dan konfigurasi hosting dengan benar.


## Kontrol avatar interaktif
- Keyboard: panah kiri/kanan atau A/D untuk bergerak; panah atas/Space untuk melompat; E/Enter untuk aksi.
- Layar sentuh: gunakan tombol ◀, ▶, ⬆, dan Aksi.
- Lari Kilat: avatar berlari otomatis dan menghindari rintangan.
- Jatuh Bangun: gerak dan lompat melewati platform.
- Detektif dan Pasar: jelajahi arena, periksa petunjuk, dan lakukan aksi.
- Jelajah dan Jembatan: gerakkan avatar di area petualangan.
\n## Mekanisme jawaban berbasis tema (V5)\nJawaban benar memicu animasi keberhasilan sesuai tema mini game. Jawaban salah memicu tabrakan pada Lari Kilat, jatuh pada Jembatan/Jatuh Bangun, petunjuk keliru pada Detektif, transaksi ditolak pada Pasar, atau jalur salah pada Jelajah.\n

## V6 – Gameplay berbasis pilihan
- Jembatan Juara memiliki empat pijakan terpisah untuk opsi A-D. Hanya pijakan jawaban benar yang aman; pilihan salah membuat pijakan runtuh dan avatar jatuh.
- Lari Kilat: jawaban benar memicu gerakan menghindar dan berlari melewati rintangan; jawaban salah memicu tabrakan.
- Mini game lain mempertahankan animasi tema masing-masing: platform algoritma, investigasi petunjuk, transaksi pasar, dan jalur eksplorasi.


## V7 – Rebuild gameplay interaktif
- Setiap mini game kini memakai layout dunia yang berbeda: endless runner tiga jalur, empat jalur jembatan A-D, menara platform bertingkat, kota investigasi, pasar kios, dan pulau eksplorasi.
- Avatar dibuat dari bagian tubuh terpisah dengan animasi langkah tangan/kaki, gerak berjalan bertahap, dan kamera third-person yang mengikuti karakter.
- Jawaban menjadi pemicu aksi utama: runner menghindar atau menabrak; jembatan memilih satu dari empat jalur dan hanya jawaban benar yang aman; algoritma naik platform atau jatuh; detektif mengumpulkan bukti; pasar menyelesaikan atau menolak transaksi; eksplorasi membuka atau mengunci gerbang.
- Kontrol kiri/kanan, lompat, dan aksi tetap tersedia untuk eksplorasi.

## V8 – Logika jawaban dan progres bertahap
- Jawaban salah langsung mengakhiri permainan (game over) setelah animasi tabrakan/jatuh/gagal.
- Jawaban benar menjalankan animasi gerak, membuka tombol lanjut setelah animasi selesai, dan memajukan avatar satu tahap saja.
- Jatuh Bangun memiliki 7 platform dan 7 soal berurutan.
- Jembatan memiliki 5 segmen progres; tiap jawaban benar hanya menyeberangkan avatar ke satu segmen berikutnya.
- Lari Kilat menggeser avatar ke jalur aman lalu berlari maju; tidak ada animasi miring sebagai pengganti perpindahan jalur.
- Permainan dihentikan setelah game over; siswa dapat mengulang dari awal.

\n## V9 – Sistem satu kali main dan kunci mini game
- Setiap mini game hanya dapat dimulai satu kali pada perangkat/browser yang sama.
- Setelah berhasil, gagal karena jawaban salah, atau waktu habis, mini game otomatis ditandai sudah dimainkan.
- Mini game yang sudah dimainkan dikunci pada daftar; siswa diarahkan memilih game lain yang belum dimainkan.
- Status permainan disimpan di localStorage browser sehingga tetap terkunci setelah halaman dimuat ulang pada browser/perangkat yang sama.
- Tombol Main Lagi di layar hasil diganti dengan tombol kembali ke daftar mini game.
- Catatan: status ini tersimpan lokal pada browser/perangkat. Untuk penguncian lintas perangkat atau akun, perlu penyimpanan status pada server.


## V10 – 10 soal per mini game dan progres yang lebih jelas
- Setiap dari 6 mini game sekarang memiliki tepat 10 soal/tahap (total 60 soal).
- Lari Kilat memiliki 10 rintangan dan waktu 90 detik.
- Jembatan Juara memiliki 10 langkah menuju finish.
- Jatuh Bangun memiliki 10 platform/level yang sesuai dengan 10 soal.
- Detektif dan Pasar memiliki 10 tahap interaksi/bukti/transaksi.
- Statistik membedakan jumlah mini game yang sudah dimainkan dan yang berhasil diselesaikan.
- Status hasil (berhasil, gagal, atau waktu habis) disimpan lokal dan ditampilkan pada kartu yang terkunci.
- Aturan satu kali bermain tetap berlaku: setelah mini game berakhir, siswa harus memilih game lain yang belum dimainkan.

## V11 – Nama siswa dan akses online
- Mini game terkunci saat halaman pertama dibuka.
- Siswa wajib mengisi nama terlebih dahulu.
- Setelah nama diisi, siswa harus menekan Gabung Ruang Online.
- Mini game hanya terbuka setelah server mengonfirmasi status 🟢 Terhubung.
- Jika koneksi gagal atau terputus sebelum bermain, mini game tetap terkunci.
- Setelah berhasil bergabung, nama dan kode ruang dikunci agar identitas sesi tidak berubah.


## V12 – Perbaikan akses setelah Gabung Online
- Nama siswa wajib diisi sebelum tombol Gabung Ruang Online dapat membuka mini game.
- Saat server mengonfirmasi siswa sudah bergabung, seluruh 6 mini game yang belum dimainkan langsung dibuka.
- Status permainan yang sudah dimainkan tidak lagi tersimpan permanen di localStorage.
- Membuka kembali `localhost:3000`, memasukkan nama, dan bergabung lagi memulai sesi baru dengan semua mini game tersedia.
- Aturan satu kali bermain tetap berlaku selama sesi siswa yang sedang aktif: setelah sebuah mini game selesai/gagal, game tersebut terkunci sampai siswa memulai sesi baru dengan bergabung kembali.
