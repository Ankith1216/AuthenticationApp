import { Request, Response } from 'express';
import { createToken, hashPassword } from '../helpers';
import { checkPassword, getUserByEmail, insertUser, updateUserToken } from '../models/user.model';

export const registerUserHandler = async (req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body;
        const hashedPassword = await hashPassword(password);
        const token = createToken();
        const user = await insertUser(email, username, hashedPassword, token);
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

        const passwordMatch = await checkPassword(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = createToken();
        const updatedUser = await updateUserToken(user.id, token);
        res.json({ message: 'Logged in', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const logoutUserHandler = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const updatedUser = await updateUserToken(user.id, null);
        res.json({ message: 'Logged out', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}