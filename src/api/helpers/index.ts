import bcrypt from 'bcrypt';
import {sign} from 'jsonwebtoken';
import {JWT_SECRET} from '../../config/constants';

export const createToken = (email:string) => {
    return sign({email}, JWT_SECRET, {expiresIn: '30s'});
};

export const hashPassword = async (password: string) => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async (plaintextPassword: string, hashedPassword: string) => {
    return bcrypt.compare(plaintextPassword, hashedPassword);
};