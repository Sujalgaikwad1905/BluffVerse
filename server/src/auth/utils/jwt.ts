import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

const secret: string = JWT_SECRET;

const JWT_EXPIRES_IN = "7d";

export function generateToken(userId: string): string {
  return jwt.sign(
    {
      userId,
    },
    secret,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, secret);
}