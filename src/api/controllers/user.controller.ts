import { Request, Response } from 'express';

export const getUserHandler = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        delete (user.password);
        res.json({ message: 'User Info', user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};