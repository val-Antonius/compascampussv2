# CompassCampus - Sistem Registrasi Mata Kuliah

Aplikasi web untuk pengelolaan registrasi mata kuliah kampus role mhs dan admin.

## 🌐 Preview

### 🖥️ mhs
![Dashboard mhs](https://raw.githubusercontent.com/val-Antonius/compascampussv2/main/public/preview1.png)

### 🖥️ mhs
![Katalog](https://raw.githubusercontent.com/val-Antonius/compascampussv2/main/public/preview2.png)

### 🖥️ mhs
![Detail](https://raw.githubusercontent.com/val-Antonius/compascampussv2/main/public/preview3.png)

### 🖥️ admin
![Dashboard mhs](https://raw.githubusercontent.com/val-Antonius/compascampussv2/main/public/preview4.png)

### 🖥️ admin
![Katalog](https://raw.githubusercontent.com/val-Antonius/compascampussv2/main/public/preview5.png)

### 🖥️ admin
![Detail](https://raw.githubusercontent.com/val-Antonius/compascampussv2/main/public/preview6.png)

### 🖥️ login/regiter
![Detail](https://raw.githubusercontent.com/val-Antonius/compascampussv2/main/public/preview7.png)


## Fitur Utama

- Dashboard mahasiswa dan admin
- Katalog mata kuliah
- Pendaftaran mata kuliah (enrollment)
- Persetujuan pendaftaran oleh admin
- Riwayat pendaftaran
- Profil pengguna
- Sistem notifikasi

## Teknologi

- **Frontend**: Next.js, React, Tailwind CSS, React Icons
- **Backend**: Next.js API Routes
- **Database**: MySQL

## Setup Awal

### Prasyarat

- Node.js (versi 18+ direkomendasikan)
- MySQL Server

### Instalasi

1. Clone repositori
   ```bash
   git clone https://github.com/username/compasscampus.git
   cd compasscampus
   ```

2. Install dependensi
   ```bash
   npm install
   ```

3. Konfigurasi database

   Buat file `.env.local` di root proyek dengan isi sebagai berikut:
   ```
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=password
   DB_NAME=compasscampus

   # JWT Secret for Authentication
   JWT_SECRET=compasscampus_secret_key_123456

   # App Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. Buat database MySQL
   ```sql
   CREATE DATABASE compasscampus;
   ```

5. Setup tabel database dan data awal
   ```bash
   npm run setup-db
   ```

6. Jalankan aplikasi dalam mode development
   ```bash
   npm run dev
   ```

## Struktur API

### Autentikasi

- `POST /api/auth/login` - Login pengguna
- `POST /api/auth/register` - Registrasi pengguna baru (mahasiswa)

### Mata Kuliah

- `GET /api/courses` - Daftar semua mata kuliah
- `POST /api/courses` - Tambah mata kuliah baru (admin)
- `GET /api/courses/:id` - Detail mata kuliah
- `PUT /api/courses/:id` - Update mata kuliah (admin)
- `DELETE /api/courses/:id` - Hapus mata kuliah (admin)

### Enrollment

- `GET /api/enroll` - Daftar enrollment pengguna yang login
- `POST /api/enroll` - Tambah enrollment baru
- `GET /api/enroll/:id` - Detail enrollment
- `PUT /api/enroll/:id` - Update status enrollment (admin)
- `DELETE /api/enroll/:id` - Batalkan enrollment

### Profil User

- `GET /api/user/profile` - Profil user yang login
- `PUT /api/user/profile` - Update profil user

### Notifikasi

- `GET /api/notifications` - Daftar notifikasi untuk user yang login
- `PATCH /api/notifications` - Tandai notifikasi sebagai telah dibaca
- `DELETE /api/notifications` - Hapus notifikasi

## Akun Default

Setelah menjalankan setup database, akan dibuat akun admin default:

- **Username**: admin
- **Password**: admin123

## Pengembangan

### Direktori Utama

- `src/app` - Halaman frontend dan API routes
- `src/components` - Komponen React
- `src/lib` - Utility dan konfigurasi
- `src/data` - Data statis (mock data)

## Lisensi

MIT
