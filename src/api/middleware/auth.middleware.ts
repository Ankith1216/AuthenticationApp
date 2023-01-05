import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../../config/constants';
import jwt from 'jsonwebtoken';
import { getUserByEmail } from '../models/user.model';

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const [, token] = authHeader.split(' ');
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // TODO: Check whether the token is still valid or not. That is after logout the user should not access data with the token since it could have been compromised.

    try {
        const { email } = jwt.verify(token, JWT_SECRET) as { email: string };
        const user = await getUserByEmail(email);
        (req as any).user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Token expired. Please log in again' });
    }
};