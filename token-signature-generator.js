import crypto from 'crypto';

/**
 * Generate RSA signature untuk request token SNAP Raya
 * @param {string} clientId - Client ID dari Bank Raya
 * @param {string} timestamp - ISO8601 timestamp
 * @param {string} privateKeyPem - Private Key RSA (PKCS#1 PEM format)
 * @returns {string} X-SIGNATURE (base64)
 */
function generateRsaSignature(clientId, timestamp, privateKeyPem) {
  const stringToSign = `${clientId}|${timestamp}`;

  // langsung sign pakai RSA-SHA256
  return crypto
    .sign('RSA-SHA256', Buffer.from(stringToSign), {
      key: privateKeyPem,
    })
    .toString('base64');
}

// ==== contoh pemakaian ====

// client ID dari Bank Raya
const clientId = 'UcG57JZs88qGGtC2aD7JDuaf5lbR8MKk7zy1LAfPyPzvfAc9';

// timestamp ISO8601
const timestamp = new Date().toISOString();

// private key RSA (hasil convert, format PKCS#1)
const privateKey = `
-----BEGIN RSA PRIVATE KEY-----\nMIICXgIBAAKBgQC8wK+YEadttQWNceTQjeqMk74K5iqmu25OQhr3rAsIaFJtZ5uPGKSpa9x03U6P7plXOPW0i/Th/mTMeV4ApH5BBE4lz1E2D10bJG3AaWxCfUp+ZT6bD59z4h9Ph/RCbC9BC5RI2bD8G/DsXsJ/6s1GDd53jwS5VPkd4juJ1bWcLwIDAQABAoGBAJlhHo888UfFzLBGt7/9QnZfbBOhO1Fnh1gSgaV26TQ4yZpbkd3zEYMWwfs5BqkRIwvsnkTLYf/u3+wER63P/ULkwrAzK1l1r/yDYelWrk0uSJmSaDbsZoZRW2gjyDVRGFoYovg/0G3/Ybt+wDSzSv9tvOcuinQHcMjXOp63hXxBAkEA2/3wu5310AF8WZAtVXeMsUZM/yhbbzn6SUgghI3KirGbPOO9QC4rZAt1dlqL1Y9KBuzcRcyONzRmxchPggBOTwJBANulw3oo+QzJFLU2ZVrrYVutKqjERHC1TC409ReUIUylhrD7T2C6C2YnUSae19WUMNpqFN5tcTzFIdPrQW5fPCECQQDTxkylP/WvbI65ZVrOyMwup59djgsfMq/nNcDf+eM9yqXHYvD/RLLOl11XNukgB9Vaf0+4/ab2K8K3qRIo8oRvAkEAtFS9zpfBEXwtojGMuT6y6f+cHH826YoPh4g3CSq2xCTKFpfdrb5RCYeSGrEi5tkJ2uhpRcx4wbnfcgud5q4NwQJACBQcTHiN/bpUDQsAMcy0ZKo7/dcRU43K/K7uwtStEMK2LPv3APIV4pcTj+Na6PKCeQnbYqvbcbNLqKzAsYbqOg==\n-----END RSA PRIVATE KEY-----
`;

// generate signature
const signature = generateRsaSignature(clientId, timestamp, privateKey);

// header untuk request token
const headers = {
  'X-SIGNATURE': signature,
  'X-TIMESTAMP': timestamp,
  'X-CLIENT-KEY': clientId,
  'Content-Type': 'application/json',
};

// body untuk request token
const body = {
  grantType: 'client_credentials',
};

console.log('Headers:', headers);
console.log('Body:', body);
