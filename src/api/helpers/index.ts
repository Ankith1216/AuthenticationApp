import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/constants';

export const createToken = (email: string, expiresIn: string) => {
    return sign({ email }, JWT_SECRET, { expiresIn: expiresIn });
};

export const hashPassword = async (password: string) => {
    return bcrypt.hash(password, 10);
};

export const comparePasswords = async (plaintextPassword: string, hashedPassword: string) => {
    return bcrypt.compare(plaintextPassword, hashedPassword);
};
