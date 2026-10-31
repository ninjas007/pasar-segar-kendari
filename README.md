# Pasar Segar Kendari

Website marketplace kebutuhan pokok dengan katalog produk, pilihan satuan, keranjang belanja, panel informasi/kontak, dan checkout langsung melalui WhatsApp.

## Menjalankan project

1. Pastikan Node.js 20.9 sampai 22.x sudah terpasang.
2. Jalankan `npm install`.
3. Jalankan `npm run dev`.
4. Buka alamat yang muncul di terminal.

Untuk build production, jalankan `npm run build`.

## Deployment Vercel

Repository ini menggunakan Next.js standar dan dapat langsung dihubungkan ke
Vercel. Setiap push ke branch `main` akan memicu deployment production secara
otomatis melalui Git Integration Vercel.

Semua gambar produk dan hero tersimpan lokal di folder `public/assets`.

### Penyimpanan admin dan produk

Produk serta kata sandi admin disimpan di Upstash Redis, yang merupakan
pengganti Vercel KV. Sebelum login admin digunakan di Vercel:

1. Buka proyek di Vercel, lalu masuk ke **Storage** → **Create Database**.
2. Pilih **Upstash Redis**, buat database, lalu hubungkan ke proyek ini.
3. Pastikan environment variable koneksi yang dibuat integrasi tersedia untuk
   Production (biasanya `KV_REST_API_URL` dan `KV_REST_API_TOKEN`), kemudian
   lakukan redeploy.
4. Tambahkan `ADMIN_SESSION_SECRET` di **Settings** → **Environment Variables**
   dengan nilai acak panjang, lalu redeploy sekali lagi.

Pada akses pertama, katalog dari `data/products.json` dan akun awal dengan
kata sandi `admin123!@#` akan dibuat otomatis di Redis. Setelah itu, produk
dan password dapat dikelola dari `/admin`.
