import { config } from 'dotenv';
config();

export const NODE_ENV = process.env.NODE_ENV || 'dev';
export const JWT_SECRET = process.env.JWT_SECRET;
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
export const PORT = process.env.PORT || 8080;
