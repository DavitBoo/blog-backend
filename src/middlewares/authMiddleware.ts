import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

interface UserPayload {    
  userId: number;
  role: string;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log(token);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as UserPayload;    //payload is the usefull info inside the token
    req.user = payload; // Attach user payload to the request object
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
