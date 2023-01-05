import { Request, Response } from 'express';
import { comparePasswords, createToken, hashPassword } from '../helpers';
import { getUserByEmail, insertUser } from '../models/user.model';

export const registerUserHandler = async (req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body;
        const hashedPassword = await hashPassword(password);
        const user = await insertUser(email, username, hashedPassword);
        res.status(201).json({ message: 'User created', user: user, token: createToken(email) });
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
        res.json({ message: 'Logged in', user: user, token: createToken(email) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const logoutUserHandler = async (req: Request, res: Response) => {
    res.json({ message: 'Logged out', user: (req as any).user });
};
