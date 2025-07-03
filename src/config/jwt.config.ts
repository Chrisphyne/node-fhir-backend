import dotenv from 'dotenv';
dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'supersecret',
  expiresIn: '24h',
  issuer: 'hirf-app',
  audience: 'hirf-users',
}; 