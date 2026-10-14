import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

/**
 * Derives a consistent 32-byte key from ENCRYPTION_KEY env var using SHA-256
 */
function getDerivedKey(): Buffer {
  const rawKey = process.env.ENCRYPTION_KEY || 'default-fallback-insecure-key-change-in-env';
  return crypto.createHash('sha256').update(rawKey).digest();
}

/**
 * Encrypt sensitive plain text string using AES-256-GCM.
 * Output format: iv:authTag:encryptedHex
 */
export function encryptSensitiveField(text: string): string {
  if (!text || typeof text !== 'string') return '';

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getDerivedKey(), iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt sensitive field from iv:authTag:encryptedHex format
 */
export function decryptSensitiveField(encryptedPayload: string): string {
  if (!encryptedPayload || !encryptedPayload.includes(':')) {
    return '';
  }

  try {
    const parts = encryptedPayload.split(':');
    if (parts.length !== 3) return '';

    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encryptedHex = parts[2];

    const decipher = crypto.createDecipheriv(ALGORITHM, getDerivedKey(), iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption failed for sensitive field');
    return '[Decryption Failed]';
  }
}

/**
 * Mask Government ID / Aadhaar for safe display in UI.
 * e.g., '123456789012' -> 'XXXX-XXXX-9012'
 * e.g., 'A1234567' -> 'XXXX4567'
 */
export function maskGovtId(idNumber: string): string {
  if (!idNumber) return 'Not Provided';
  const clean = idNumber.replace(/\s+/g, '');
  if (clean.length <= 4) {
    return '****' + clean;
  }
  const last4 = clean.slice(-4);
  if (clean.length === 12) {
    // Typical Indian Aadhaar 12-digit format
    return `XXXX-XXXX-${last4}`;
  }
  const maskLength = clean.length - 4;
  return `${'X'.repeat(Math.min(maskLength, 8))}-${last4}`;
}
