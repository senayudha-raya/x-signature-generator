

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

