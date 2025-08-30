// config.ts
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

/**
 * SECRET_KEY for session
 * Stored in .env as a string, converted to Buffer for CipherKey
 */
const secret = process.env.SECRET_KEY;
if (!secret) {
  throw new Error("SECRET_KEY is not defined in .env");
}
export const SECRET_KEY: crypto.CipherKey = Buffer.from(secret);

/**
 * OPTIONAL_SECRET for crypto that can be a string or false
 * If not provided, defaults to false
 */
export const OPTIONAL_SECRET: string | false =
  process.env.OPTIONAL_SECRET ?? false;