import crypto from 'node:crypto';

import * as bcrypt from 'bcryptjs';

export function generateAccessToken(): string {
  return crypto.randomBytes(32).toString('base64');
}

export function generateDeviceToken(): string {
  return crypto.randomBytes(64).toString('base64');
}

const allowedLetters = 'BCDFGHJKLMNPQRSTVWXZ';

export function generateUserCode() {
  let code = '';

  for (let i = 0; i < 6; i++) {
    code += allowedLetters[Math.floor(Math.random() * allowedLetters.length)];
  }

  return code;
}

/**
 * Hashes a password using bcrypt
 * @param password the password to hash
 */
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * Compares a password against a hashed password
 * @param password The password to compare
 * @param hashedPassword The hashed password
 */
export function comparePasswords(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword);
}
