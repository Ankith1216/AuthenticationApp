import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../../config/constants';
import jwt from 'jsonwebtoken';
import { getUserByEmail } from '../models/user.model';

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = await authenticateUser(req.headers.authorization);
        if (!email) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await getUserByEmail(email);
        (req as any).user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Token expired. Please log in again' });
    }
};

const authenticateUser = async (authHeader: string | undefined) => {
    if (!authHeader) {
        return null;
    }
    const [, token] = authHeader?.split(' ');
    if(!token) {
        return null;
    }
    const {email} = jwt.verify(token, JWT_SECRET) as {email: string};
    return email;
}