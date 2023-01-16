import { Console } from 'console';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/constants';
import { comparePasswords, createToken, hashPassword } from '../helpers';
import { checkRefreshToken } from '../middleware/auth.middleware';
import { deleteRefreshToken, getUserByEmail, insertUser, insertRefreshToken } from '../models/user.model';

export const registerUserHandler = async (req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body;
        const hashedPassword = await hashPassword(password);
        const user = await insertUser(email, username, hashedPassword);

        // Issue an access token
        const accessToken = createToken(email, '30s');

        // Issue a refresh token
        const refreshToken = createToken(email, '5m');

        // Store the refresh token in the database or in-memory cache
        await insertRefreshToken(refreshToken);

        res.status(201).json({
            message: 'User created',
            user: user, accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const loginUserHandler = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Email not registered' });
        }

        const passwordMatch = await comparePasswords(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Wrong Password' });
        }
        // Issue an access token
        const accessToken = createToken(email, '30s');

        // Issue a refresh token
        const refreshToken = createToken(email, '5m');

        // Store the refresh token in the database or in-memory cache
        await insertRefreshToken(refreshToken);

        res.status(201).json({
            message: 'Logged in',
            user: user, accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const logoutUserHandler = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.body.refreshToken;
        await deleteRefreshToken(refreshToken);
        res.json({ message: 'Logged out', user: (req as any).user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        const payload = jwt.verify(refreshToken, JWT_SECRET);
        if (!payload) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const isValidRefreshToken = await checkRefreshToken(refreshToken);
        if (!isValidRefreshToken) {
            return res.status(401).json({ message: 'Expired refresh token' });
        }

        // Issue a new access token
        const accessToken = createToken((payload as any).email, '30s');

        res.json({ accessToken: accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};