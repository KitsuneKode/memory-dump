import { Request, NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(401).send('Authorization header missing');
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({
      message: 'Invalid token',
    });
    return;
  }
};
