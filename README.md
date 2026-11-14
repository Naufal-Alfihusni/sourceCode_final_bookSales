# BookSales

Dokumentasi aplikasi penjualan buku, mencakup frontend React dan ruang dokumentasi backend.

## Frontend

Frontend BookSales menyediakan katalog buku, transaksi, keranjang belanja, profil pengguna, dan halaman administrasi.

### Teknologi

- React dan Vite
- React Router untuk navigasi halaman
- Axios untuk komunikasi dengan API
- React JWT untuk membaca dan memeriksa masa berlaku token
- Tailwind CSS dan Flowbite yang dimuat melalui CDN di `index.html`

### Fitur

- Melihat katalog buku dan penulis.
- Mencari buku berdasarkan judul dan genre.
- Melihat detail buku, membeli langsung, atau menambahkan buku ke keranjang.
- Menyimpan isi keranjang di `localStorage` browser dengan key `bookCart`.
- Mengirim transaksi ke backend saat pengguna melakukan pembelian.
- Melihat profil pengguna dan detail transaksi.
- Mengelola buku, penulis, genre, pengguna, dan transaksi melalui halaman admin.
- Mencari data pada halaman daftar admin selain Overview.

> Keranjang tersimpan di browser. Data keranjang tidak tersinkronisasi antarperangkat; transaksi dan validasi pembelian tetap dilakukan oleh backend.

### Struktur kode

```text
src/
├── _api/                 # Konfigurasi Axios dan URL penyimpanan gambar
├── _services/            # Pemanggilan API dan layanan keranjang
├── assets/               # Logo dan gambar frontend
├── components/           # Komponen bersama, seperti navbar dan footer
├── layouts/              # Layout publik dan admin
├── pages/
│   ├── admin/            # Overview dan halaman pengelolaan data
│   ├── auth/             # Login dan registrasi
│   └── public/           # Katalog, profil, keranjang, dan transaksi
├── App.jsx               # Konfigurasi route aplikasi
└── main.jsx              # Entry point React
```

### Menjalankan frontend

Prasyarat: Node.js dan npm sudah terpasang, serta backend API tersedia.

```bash
npm install
npm run dev
```

Perintah lain:

```bash
npm run build    # Membuat build produksi
npm run preview  # Menjalankan preview build
npm run lint     # Memeriksa kode dengan ESLint
```

### Konfigurasi API

URL API dan URL penyimpanan gambar dikonfigurasi di `src/_api/index.js`. Secara default frontend menggunakan:

```text
http://127.0.0.1:8000/api
```

Jika backend berjalan di alamat lain, sesuaikan nilai `url` pada file tersebut.

## Backend

Backend BookSales menyediakan REST API untuk katalog buku, pengguna, dan transaksi.

### Teknologi backend

- PHP 8.2
- Laravel 12
- Eloquent ORM
- SQLite sebagai database bawaan pada `.env.example` (dapat diganti melalui konfigurasi Laravel).
- JWT Authentication menggunakan `tymon/jwt-auth`.

### Instalasi dan menjalankan backend

Prasyarat: PHP 8.2, Composer, dan ekstensi PHP yang dibutuhkan Laravel. Dari direktori proyek backend, jalankan:

```powershell
composer install
Copy-Item .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed
php artisan storage:link
php artisan serve --host=127.0.0.1 --port=8000
```

Jika file `.env` sudah tersedia, jangan menimpanya dengan `.env.example`. Untuk memakai database selain SQLite, sesuaikan `DB_CONNECTION` dan kredensial database di `.env` sebelum menjalankan migrasi. `php artisan migrate --seed` membuat tabel dan mengisi data contoh. Seeder menyediakan akun lokal berikut:

| Peran | Email | Kata sandi |
|---|---|---|
| Admin | `admin@example.com` | `admin123` |
| Customer | `customer@example.com` | `customer123` |

Akun tersebut hanya untuk pengembangan lokal. Ganti atau hapus sebelum aplikasi digunakan di lingkungan lain.

API tersedia di `http://127.0.0.1:8000/api`. Untuk permintaan yang mengirim JSON, gunakan header `Accept: application/json` dan `Content-Type: application/json`. Gambar buku dan penulis diunggah sebagai `multipart/form-data`; file disimpan pada disk `public` di folder `books/` atau `author/`.

### API dan database

#### Autentikasi dan akses

- `POST /api/register` — menerima `name`, `email`, dan `password`. **Catatan:** skema `users` mewajibkan kolom `role`, tetapi proses registrasi belum mengisinya. Perbaiki default role pada skema atau proses registrasi sebelum menggunakan endpoint ini.
- `POST /api/login` — menerima `email` dan `password`; respons sukses berisi token JWT pada properti `token`.
- `POST /api/logout` — memerlukan autentikasi; token dikirim pada header `Authorization: Bearer <token>`.
- Kirim token yang diperoleh dari login sebagai `Authorization: Bearer <token>` untuk endpoint terlindungi.
- Endpoint administrasi memerlukan token admin (role `admin`). Akun customer menggunakan role `customer`.
- Respons validasi umumnya menggunakan status `422`; permintaan tanpa autentikasi memerlukan login, sementara akses role yang tidak sesuai ditolak.

#### Endpoint

| Metode | Endpoint | Akses | Keterangan |
|---|---|---|---|
| `GET` | `/api/books` | Publik | Daftar buku |
| `GET` | `/api/books/{id}` | Publik | Detail buku |
| `POST` | `/api/books` | Admin | Tambah buku; kirim `title`, `description`, `price`, `stock`, `cover_photo`, `genre_id`, dan `author_id` |
| `PUT/PATCH` | `/api/books/{id}` | Admin | Ubah buku; field buku wajib dikirim, `cover_photo` opsional |
| `DELETE` | `/api/books/{id}` | Admin | Hapus buku |
| `GET` | `/api/authors` | Publik | Daftar penulis |
| `GET` | `/api/authors/{id}` | Publik | Detail penulis |
| `POST` | `/api/authors` | Admin | Tambah penulis; kirim `name`, `photo`, dan `bio` |
| `PUT/PATCH` | `/api/authors/{id}` | Admin | Ubah penulis; `name` dan `bio` wajib, `photo` opsional |
| `DELETE` | `/api/authors/{id}` | Admin | Hapus penulis |
| `GET` | `/api/genres` | Publik | Daftar genre |
| `GET` | `/api/genres/{id}` | Publik | Detail genre |
| `POST` | `/api/genres` | Admin | Tambah genre; kirim `name` dan `description` |
| `PUT/PATCH` | `/api/genres/{id}` | Admin | Ubah genre; kirim `name` dan `description` |
| `DELETE` | `/api/genres/{id}` | Admin | Hapus genre |
| `GET` | `/api/transactions` | Admin | Daftar seluruh transaksi |
| `GET` | `/api/transactions/{id}` | Pengguna login | Detail transaksi; customer hanya dapat melihat transaksi miliknya |
| `POST` | `/api/transactions` | Pengguna login | Buat transaksi dengan `book_id` dan `quantity` |
| `PUT/PATCH` | `/api/transactions/{id}` | Admin | Ubah buku atau jumlah transaksi dengan `book_id` dan `quantity` |
| `DELETE` | `/api/transactions/{id}` | Admin | Hapus transaksi |
| `GET` | `/api/users` | Admin | Daftar pengguna |
| `GET` | `/api/users/{id}` | Pengguna login | Lihat profil sendiri |
| `PUT/PATCH` | `/api/users/{id}` | Pemilik akun | Ubah profil sendiri (`name` wajib; `email` dan `password` opsional) |
| `DELETE` | `/api/users/{id}` | Pengguna login | Hapus akun sendiri; admin juga dapat menghapus akun lain |

Saat transaksi dibuat, backend menghitung total berdasarkan harga buku di database dan mengurangi stok. Jumlah harus minimal `1` dan tidak boleh melebihi stok tersedia. Pembaruan atau penghapusan transaksi oleh admin akan menyesuaikan stok kembali.

#### Struktur database

| Tabel | Kolom utama | Relasi |
|---|---|---|
| `users` | `name`, `email`, `password`, `role` (`customer` atau `admin`) | Memiliki transaksi melalui `transactions.customer_id` |
| `authors` | `name`, `photo`, `bio` | Satu penulis dapat terkait dengan banyak buku |
| `genres` | `name`, `description` | Satu genre dapat terkait dengan banyak buku |
| `books` | `title`, `description`, `price`, `stock`, `cover_photo`, `author_id`, `genre_id` | Setiap buku terkait ke satu penulis dan satu genre |
| `transactions` | `order_number`, `customer_id`, `book_id`, `quantity`, `total_amount` | Setiap transaksi terkait ke satu pengguna dan satu buku |

Relasi menggunakan foreign key. Penghapusan penulis atau genre menghapus buku terkait; penghapusan pengguna atau buku menghapus transaksi terkait sesuai aturan cascade pada migrasi.
