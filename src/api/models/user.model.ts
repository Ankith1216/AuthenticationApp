import pool from '../../config/db';
import { comparePasswords } from '../helpers';

export interface User {
    id: number;
    email: string;
    username: string;
    password: string;
    token: string;
}

export const insertUser = async (email: string, username: string, password: string) => {
    const query = `
        INSERT INTO users (email, username, password)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const { rows } = await pool.query(query, [email, username, password]);
    return rows[0];
};

export const getUserByEmail = async (email: string) => {
    const query = `
        SELECT * FROM users
        WHERE email = $1
      `;
    const { rows } = await pool.query(query, [email]);
    return rows[0];
}

export const getUserByUsername = async (username: string) => {
    const query = `
        SELECT * FROM users
        WHERE username = $1
      `;
    const { rows } = await pool.query(query, [username]);
    return rows[0];
}

export const checkPassword = async (inputPassword: string, userPassword: string) => {
    return comparePasswords(inputPassword, userPassword);
}