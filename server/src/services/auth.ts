import { Request } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

const secretKey = process.env.JWT_SECRET_KEY || '';

export function signToken(username: string, email: string, _id: string): string {
  const payload = { username, email, _id };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

// Middleware for GraphQL Context Authentication
export function authMiddleware({ req }: { req: Request }) {
  let token = req.headers.authorization || '';

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length); 
  }

  if (!token) {
    return {}; // No user, return empty context
  }

  try {
    const user = jwt.verify(token, secretKey) as JwtPayload;
    return { user };
  } catch (error) {
    console.warn('Invalid Token:', error);
    return {}; // Invalid token, return empty context
  }
}
