import { Request, Response } from 'express';
import { comparePasswords, createToken, hashPassword } from '../helpers';
import { getUserByEmail, insertUser } from '../models/user.model';

export const registerUserHandler = async (req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body;
        const hashedPassword = await hashPassword(password);
        const user = await insertUser(email, username, hashedPassword);
        user.token = createToken(email);
        res.status(201).json({ message: 'User created', user });
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
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const passwordMatch = await comparePasswords(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        user.token = createToken(email);
        res.json({ message: 'Logged in', user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const logoutUserHandler = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        res.json({ message: 'Logged out', user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}