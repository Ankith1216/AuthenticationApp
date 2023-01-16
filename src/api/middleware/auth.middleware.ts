import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../../config/constants';
import jwt from 'jsonwebtoken';
import { getRefreshToken, getUserByEmail } from '../models/user.model';

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.body.accessToken;
    if (!accessToken) {
        return res.status(401).json({ message: 'Access token not provided' });
    }

    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token not provided' });
    }
    const isValidRefreshToken = await checkRefreshToken(refreshToken);
    if(!isValidRefreshToken) {
        return res.status(500).json({message: 'Refresh Token has expired. Please login again'});
    }

    try {
        const payload = jwt.verify(accessToken, JWT_SECRET);
        if(!payload) {
            return res.status(401).json({message: 'Invalid access token'});
        }
        const user = await getUserByEmail((payload as any).email);
        (req as any).user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Access token expired' });
    }
};

export const checkRefreshToken =async (refreshToken:string) => {
    const tokenPresent = await getRefreshToken(refreshToken);
    return !!tokenPresent;
}