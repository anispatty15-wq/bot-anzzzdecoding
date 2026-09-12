# 🤖 ANZZZ Bot - WhatsApp Multi-Device

Bot WhatsApp dengan sistem plugin modular yang dapat dijalankan di Pterodactyl Panel.

---

## 📋 Persyaratan

- **Node.js**: v20.0.0 atau lebih tinggi
- **npm**: v10.0.0 atau lebih tinggi
- **RAM**: Minimal 1GB
- **Disk Space**: Minimal 2GB
- **CPU**: 50% atau lebih

---

## 🚀 Instalasi di Pterodactyl Panel

### **Langkah 1: Upload File Proyek**

1. Masuk ke **Pterodactyl Panel**
2. Klik **Files** → **Upload**
3. Upload seluruh folder bot (atau gunakan Git Clone jika available)
4. Pastikan file-file berikut ada:
   - ✅ `package.json`
   - ✅ `config.js`
   - ✅ `index.js`
   - ✅ Folder `plugins/`, `src/`, `database/`, `assets/`

---

### **Langkah 2: Konfigurasi di Settings**

1. Buka **Settings** → **Startup**

#### **A. Install Command**
**Untuk Node v24 (PENTING):**
```bash
npm install --legacy-peer-deps --no-audit --no-fund --force
```

Atau gunakan ini jika error persist:
```bash
npm cache clean --force && npm install --legacy-peer-deps --force --prefer-offline
```

#### **B. Startup Command**
Copy-paste di field **Startup Command**:
```bash
npm run start
```

#### **C. Environment Variables**
Tambahkan di **Environment Variables**:
```
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=1024 --openssl-legacy-provider
```

**⚠️ Flag `--openssl-legacy-provider` penting untuk Node v24!**

---

### **Langkah 3: Resource Allocation**

Masuk ke **Settings** → **Resource Limits**, atur:
- **Memory Allocation**: 1024 MB (minimum)
- **CPU Limit**: 50% atau lebih
- **Disk Space**: 2GB atau lebih

---

### **Langkah 4: Konfigurasi Bot**

1. Masuk ke **Files**
2. Edit `config.js`:
   - Ubah **owner number**: `"6281338838631"` → nomor Anda (format: 628xxx)
   - Ubah **bot name** jika ingin
   - Konfigurasi **payment methods** (opsional)

3. Edit `database/main/settings.json` jika ada konfigurasi khusus

---

### **Langkah 5: Start Bot**

1. Kembali ke **Console**
2. Klik tombol **Start** (warna biru)
3. Tunggu proses instalasi selesai (±2-5 menit)
4. Bot akan menampilkan **QR Code** atau **Pairing Code**

---

## 📲 Pairing Bot (Setup WhatsApp)

Setelah bot start, ada 2 metode:

### **Metode 1: QR Code (Recommended)**
1. Buka WhatsApp di HP Anda
2. Masuk ke **Settings** → **Linked Devices**
3. Scan **QR Code** yang muncul di console panel
4. Bot akan terhubung otomatis

### **Metode 2: Pairing Code**
1. Di console, akan muncul nomor pairing (6 digit)
2. Kirim ke bot: `.pairing <nomor_pairing>`
3. Bot akan ter-link ke akun Anda

---

## ✅ Verifikasi Bot Berjalan

Pesan yang muncul di console:
```
✅ Bot berhasil dimulai.
[ INFO ] bot anzzzdecoding (628136134836) · WA v2.3000.xxxxx
[   OK ] whatsapp siap menerima pesan
```

Jika melihat pesan di atas, bot sudah **siap digunakan** ✓

---

## 🔧 Troubleshooting

### **Error: Spawn ENOENT**
**Solusi:**
- Pastikan Node.js versi sudah ≥ v20.0.0
- Cek di panel: **Servers** → **Console** → lihat Node version

### **Error: Out of Memory**
**Solusi:**
- Tingkatkan RAM allocation ke 1.5GB atau 2GB
- Edit `NODE_OPTIONS` di Environment Variables: `--max-old-space-size=1536`

### **Bot Stop/Crash**
**Solusi:**
- Buka **Console** → lihat error message
- Restart bot via **Restart** button
- Jika terus error, cek `config.js` dan pastikan owner number benar

### **Tidak Ada QR Code**
**Solusi:**
- Session mungkin sudah ada, cek folder `storage/session/`
- Jika ingin reset, hapus folder tersebut dan restart bot

---

## 📝 Perintah Dasar Bot

| Perintah | Fungsi |
|----------|--------|
| `*menu` | Tampilkan menu utama |
| `*owner` | Info owner bot |
| `*help` | Bantuan lengkap |
| `*ping` | Test koneksi bot |
| `*stats` | Statistik bot |

---

## 🔐 Tips Keamanan

1. **Ganti owner number** di `config.js`
2. **Jangan share** folder `database/` yang berisi data user
3. **Backup session** secara berkala (folder `storage/`)
4. **Monitor console** untuk deteksi error atau anomali

---

## 📞 Support

Jika ada masalah:
1. Baca console error message dengan teliti
2. Cek file `config.js` - pastikan sudah dikonfigurasi
3. Restart bot via panel
4. Hubungi owner: **anzzz** (Nomor di config.js)

---

## 📜 Lisensi

ISC - Dibuat oleh **anzzzdecoding**

---

**Version**: 3.2.0  
**Last Updated**: 14 Juli 2026
