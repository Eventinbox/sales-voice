import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-only-secret-change-in-env";
const TOKEN_EXPIRY = "30d";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface TokenPayload {
  vendorId: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}