

# 📌 SNAP Raya Signature Generators

Project ini berisi helper script untuk membuat **X-SIGNATURE** sesuai standar **Bank Raya SNAP API**.
Ada **2 jenis signature** yang dibutuhkan:

1. **RSA Signature** → untuk **request access token** (`token-signature-generator.js`)
2. **HMAC Signature** → untuk **panggilan API SNAP** setelah token didapat (`app-signature-generator.js`)

---

## ⚙️ Requirements

* **Node.js v18+** (disarankan v22 LTS)
* Private key RSA dari Bank Raya
* Client ID & Client Secret dari Bank Raya

---

## 📂 Struktur File

```
/signature-tools
  ├── app-signature-generator.js      # untuk API call (GET/POST/PUT)
  ├── token-signature-generator.js    # untuk generate token
  └── README.md                       # panduan penggunaan
```

---

## 🔑 1. Generate RSA Signature (Token Request)

File: `token-signature-generator.js`
Dipakai untuk request token ke Bank Raya (grantType `client_credentials`).

### Cara Pakai

```bash
node token-signature-generator.js
```

### Contoh Output

```json
Headers: {
  "X-SIGNATURE": "base64-signature",
  "X-TIMESTAMP": "2025-08-26T09:15:30.000Z",
  "X-CLIENT-KEY": "UcG57JZs88qGGtC2aD7JDuaf5lbR8MKk7zy1LAfPyPzvfAc9",
  "Content-Type": "application/json"
}
Body: {
  "grantType": "client_credentials"
}
```

Header + body ini langsung bisa dipakai untuk request access token ke endpoint token Bank Raya.

---

## 🔒 2. Generate HMAC Signature (SNAP API Request)

File: `app-signature-generator.js`
Dipakai untuk semua API call SNAP (contoh: Balance Inquiry).

### Cara Pakai

```bash
node app-signature-generator.js
```

### Contoh Output

```bash
POST X-SIGNATURE: 2c9b1af4a5a7c0b0...
GET X-SIGNATURE:  e4dbedab12f3f9e1...
```

### StringToSign Format

```
METHOD:PATH:ACCESS_TOKEN:BODY_HASH:TIMESTAMP
```

* **METHOD** = HTTP method (`GET`, `POST`, `PUT`, dll)
* **PATH** = path API (contoh: `/snap/v1.0/balance-inquiry`)
* **ACCESS\_TOKEN** = Bearer token hasil request token
* **BODY\_HASH** = SHA-256 hash dari body JSON (atau kosong kalau GET)
* **TIMESTAMP** = format ISO8601 (`2025-08-26T09:15:30+07:00`)

Signature dibuat dengan `HMAC-SHA512` menggunakan `clientSecret`.

---

## 🚀 Alur Lengkap Integrasi SNAP

1. **Request Token**

   * Panggil `token-signature-generator.js` untuk membuat **X-SIGNATURE** (RSA)
   * Kirim request token dengan header + body tersebut
   * Simpan `accessToken` dari response

2. **Panggil API SNAP**

   * Gunakan `app-signature-generator.js` untuk buat **X-SIGNATURE** (HMAC)
   * Tambahkan ke header setiap API call SNAP:

     ```json
     {
       "Authorization": "Bearer <ACCESS_TOKEN>",
       "X-SIGNATURE": "<hasil_generate>",
       "X-TIMESTAMP": "<timestamp>",
       "Content-Type": "application/json"
     }
     ```

---

## 🛠 Tips & Troubleshooting

* Jika error `ERR_OSSL_UNSUPPORTED`:

  * Konversi private key ke **PKCS#8**:

    ```bash
    openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt \
      -in private_pkcs1.pem -out private_pkcs8.pem
    ```
* Pastikan timezone timestamp sesuai (`+07:00` untuk WIB).
* `body` harus **minified JSON** (tanpa spasi / newline).
