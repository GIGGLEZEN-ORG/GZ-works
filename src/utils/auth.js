const PASSWORD_HASH_ITERATIONS = 120000;

export function isValidGmailAddress(email) {
  const [username, domain, ...extraParts] = email.trim().toLowerCase().split('@');
  return extraParts.length === 0
    && domain === 'gmail.com'
    && username.length >= 6
    && username.length <= 30
    && /^[a-z0-9]+(?:\.[a-z0-9]+)*$/.test(username);
}

export function getPasswordValidationMessage(password) {
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Password must include a lowercase letter.';
  if (!/[0-9]/.test(password)) return 'Password must include a number.';
  if (!/[^A-Za-z0-9\s]/.test(password)) return 'Password must include a special character.';
  return '';
}

function bytesToHex(bytes) {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function hashPassword(password, salt = null) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure password storage is unavailable in this browser.');
  }

  const saltBytes = salt
    ? Uint8Array.from(salt.match(/.{2}/g), byte => Number.parseInt(byte, 16))
    : globalThis.crypto.getRandomValues(new Uint8Array(16));
  const passwordKey = await globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const hash = await globalThis.crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations: PASSWORD_HASH_ITERATIONS, hash: 'SHA-256' },
    passwordKey,
    256
  );

  return { salt: bytesToHex(saltBytes), hash: bytesToHex(new Uint8Array(hash)) };
}
