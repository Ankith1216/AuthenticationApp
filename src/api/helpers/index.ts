import bcrypt from 'bcrypt';

export const createToken = () => {
    return bcrypt.hashSync(Date.now().toString(), 10);
};

export const hashPassword = async (password: string) => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async (plaintextPassword: string, hashedPassword: string) => {
    return bcrypt.compare(plaintextPassword, hashedPassword);
};