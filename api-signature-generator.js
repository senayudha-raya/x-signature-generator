import crypto from 'crypto';

/**
 * Generate X-SIGNATURE untuk Raya SNAP API
 * Bisa untuk GET (tanpa body) atau POST/PUT (dengan body)
 *
 * @param {string} method - HTTP Method (GET, POST, PUT, DELETE, etc.)
 * @param {string} path - API path (contoh: /snap/v1.0/balance-inquiry)
 * @param {string} accessToken - Bearer token dari API token
 * @param {object|string|null} body - Request body (object, string JSON, atau null)
 * @param {string} timestamp - ISO8601 timestamp (yyyy-MM-ddTHH:mm:ss+07:00)
 * @param {string} clientSecret - Secret dari Bank Raya
 * @returns {string} X-SIGNATURE
 */
function generateSignature(
  method,
  path,
  accessToken,
  body,
  timestamp,
  clientSecret
) {
  let bodyString = '';

  // kalau ada body → convert ke string JSON minified
  if (body) {
    bodyString = typeof body === 'string' ? body : JSON.stringify(body);
  }

  // Hash SHA-256 body (atau "" kalau kosong)
  const bodyHash = crypto
    .createHash('sha256')
    .update(bodyString)
    .digest('hex')
    .toLowerCase();

  // Buat stringToSign
  const stringToSign = `${method.toUpperCase()}:${path}:${accessToken}:${bodyHash}:${timestamp}`;

  // HMAC-SHA512 dengan clientSecret
  const signature = crypto
    .createHmac('sha512', clientSecret)
    .update(stringToSign)
    .digest('hex');

  return signature;
}

const method = 'POST';
const path = '/snap/v1.0/balance-inquiry';
const accessToken = 'HA3fE7efDMWSUyRohNZxdYDig9ph';
const body = { accountNo: '001001000060300' };
const timestamp = new Date().toISOString();
const clientSecret = 'YOUR_CLIENT_SECRET';

const sigPost = generateSignature(
  method,
  path,
  accessToken,
  body,
  timestamp,
  clientSecret
);
console.log('POST X-SIGNATURE:', sigPost);

const method2 = 'GET';
const path2 = '/snap/v1.0/some-endpoint';
const accessToken2 = 'HA3fE7efDMWSUyRohNZxdYDig9ph';
const body2 = null; // GET tidak ada body
const timestamp2 = new Date().toISOString();
const clientSecret2 = 'YOUR_CLIENT_SECRET';

const sigGet2 = generateSignature(
  method2,
  path2,
  accessToken2,
  body2,
  timestamp2,
  clientSecret2
);
console.log('GET X-SIGNATURE:', sigGet2);
