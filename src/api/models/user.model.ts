import pool from '../../config/db';
import { comparePasswords } from '../helpers';

export interface User {
    id: number;
    email: string;
    username: string;
    password: string;
    token: string;
}

export const insertUser = async (email: string, username: string, password: string, token: string) => {
    const query = `
        INSERT INTO users (email, username, password, token)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const { rows } = await pool.query(query, [email, username, password, token]);
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

export const getUserByToken = async (token: string) => {
    const query = `
        SELECT * FROM users
        WHERE token = $1
    `
    const { rows } = await pool.query(query, [token]);
    return rows[0];
}

export const checkPassword = async (inputPassword: string, userPassword: string) => {
    return comparePasswords(inputPassword, userPassword);
}

export const updateUserToken = async (userId: number, token: string | null) => {
    const updateQuery = `
        UPDATE users
        SET token = $1
        WHERE id = $2
        RETURNING *
      `;
    const { rows } = await pool.query(updateQuery, [token, userId]);
    return rows[0];
}