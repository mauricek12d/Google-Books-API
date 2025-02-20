import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

const secretKey = process.env.JWT_SECRET_KEY || 'supersecretkey';

// ✅ Generate JWT Token
export function signToken(username: string, email: string, _id: string): string {
  const payload = { username, email, _id };
  return jwt.sign(payload, secretKey, { expiresIn: '7d' });
}

// ✅ Express Middleware for Authentication
export function authenticateToken(req: Request, _res: Response, next: NextFunction) {
  console.log('Incoming Request Headers:', req.headers);
  req.user = null; // Default to no user

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('❌ No Authorization found');
    return next();
  }

  const token = authHeader.split(' ')[1]; // Extract token
  if (!token) {
    console.warn('❌ No Token found');
    return next();
  }

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    req.user = decoded; // ✅ Attach user info to `req`
    console.log('✅ User Authenticated:', req.user);
  } catch (error) {
    console.error('Invalid Token:', error);
  }
    next();
  }
