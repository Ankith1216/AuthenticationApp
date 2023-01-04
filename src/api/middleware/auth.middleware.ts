import { Request, Response, NextFunction } from 'express';
import { getUserByToken } from '../models/user.model';

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await authenticateUser(req.headers.authorization);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        (req as any).user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const authenticateUser = async (authHeader: string | undefined) => {
    if (!authHeader) {
        return null;
    }
    const [, token] = authHeader.split(' ');
    const user = getUserByToken(token);
    return user;
}