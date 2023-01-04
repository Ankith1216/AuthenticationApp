import { Request, Response, NextFunction } from 'express';
import { getUserByEmail, getUserByUsername } from '../models/user.model';

export const checkEmailExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const user = await getUserByEmail(email);
        if(user) {
            return res.status(400).json({message:'Email already in use'});
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const checkUsernameExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.body;
        const user = await getUserByUsername(username);
        if(user) {
            return res.status(400).json({message:'Username already in use'});
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
