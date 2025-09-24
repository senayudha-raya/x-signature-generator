import crypto from "crypto";

/**
 * Format timestamp ke ISO8601 dengan offset (GMT+7)
 */
function toISOStringWithOffset(date, offsetMinutes) {
  const tzOffset = offsetMinutes * 60 * 1000;
  const localTime = new Date(date.getTime() + tzOffset);

  const pad = (n) => String(n).padStart(2, "0");

  const year = localTime.getUTCFullYear();
  const month = pad(localTime.getUTCMonth() + 1);
  const day = pad(localTime.getUTCDate());
  const hours = pad(localTime.getUTCHours());
  const minutes = pad(localTime.getUTCMinutes());
  const seconds = pad(localTime.getUTCSeconds());

  const offsetHours = Math.floor(offsetMinutes / 60);
  const offsetSign = offsetMinutes >= 0 ? "+" : "-";
  const offsetStr =
    offsetSign +
    pad(Math.abs(offsetHours)) +
    ":" +
    pad(Math.abs(offsetMinutes % 60));

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetStr}`;
}

/**
 * Generate signature SNAP B2B
 */
function generateRsaSignature(clientId, timestamp, privateKeyPem) {
  const stringToSign = `${clientId}|${timestamp}`;
  return crypto
    .sign("RSA-SHA256", Buffer.from(stringToSign, "utf8"), {
      key: privateKeyPem.trim(),
      padding: crypto.constants.RSA_PKCS1_PADDING,
    })
    .toString("base64");
}

/**
 * Buat headers dan body untuk request token B2B SNAP Raya
 */
function getSnapTokenRequest(clientId, privateKeyPem) {
  const timestamp = toISOStringWithOffset(new Date(), 420); // GMT+7
  const signature = generateRsaSignature(clientId, timestamp, privateKeyPem);

  const headers = {
    "X-SIGNATURE": signature,
    "X-TIMESTAMP": timestamp,
    "X-CLIENT-KEY": clientId,
    "Content-Type": "application/json",
  };

  const body = {
    grantType: "client_credentials",
  };

  return { headers, body };
}

// ==== contoh pemakaian ====
const clientId = "UcG57JZs88qGGtC7JDuaf5lbR8MKk7zy1LAfPyPzvfAc9";
const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIICXgIBAAKBgQC8wK+YEadttQWNceTQ4K5iqmu25OQhr3rAsIaFJtZ5uPGKSpa9x03U6lz1E2D10bJG3AaWxCfUp+ZT6bD59z4h9Ph/RCbC9BC5RI2bD8G/DsXsJ/6s1GDd53jwS5VPkd4juJ1bWcLwIDAQABAoGBAJlhHo888UfFzLBGt7/9QnZfbBOhO1Fnh1gSgaV26TQ4yZpbkd3zEYMWwfs5BqkRIwvsnkTLYf/u3+wER63P/ULkwrAzK1l1r/yDYelWrk0uSJmSaDbsZoZRW2gjyDVRGFoYovg/0G3/Ybt+wDSzSv9tvOcuinQHcMjXOp63hXxBAkEA2/3wu5310AF8WZAtVXeMsUZM/yhbbzn6SUgghI3KirGbPOO9QC4rZAt1dlqL1Y9KBuzcRcyONzRmxchPggBOTwJBANulw3oo+QzJFLU2ZVrrYVutKqjERHC1TC409ReUIUylhrD7T2C6C2YnUSae19WUMNpqFN5tcTzFIdPrQW5fPCECQQDTxkylP/WvbI65ZVrOyMwup59djgsfMq/nNcDf+eM9yqXHYvD/RLLOl11XNukgB9Vaf0+4/ab2K8K3qRIo8oRvAkEAtFS9zpfBEXwtojGMuT6y6f+cHH826YoPh4g3CSq2xCTKFpfdrb5RCYeSGrEi5tkJ2uhpRcx4wbnfcgud5q4NwQJACBQcTHiN/bpUDQsAMcy0ZKo7/dcRU43K/K7uwtStEMK2LPv3APIV4pcTj+Na6PKCeQnbYqvbcbNLqKzAsYbqOg==
-----END RSA PRIVATE KEY-----
`;

const { headers, body } = getSnapTokenRequest(clientId, privateKey);

console.log("Headers:", headers);
console.log("Body:", body);
