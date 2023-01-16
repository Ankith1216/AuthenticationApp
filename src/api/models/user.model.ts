import pool from '../../config/db';
import { comparePasswords } from '../helpers';

export interface User {
    id: number;
    email: string;
    username: string;
    password: string;
    token: string;
};

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
};

export const getUserByUsername = async (username: string) => {
    const query = `
        SELECT * FROM users
        WHERE username = $1
    `;
    const { rows } = await pool.query(query, [username]);
    return rows[0];
};

export const checkPassword = async (inputPassword: string, userPassword: string) => {
    return comparePasswords(inputPassword, userPassword);
};

export const getRefreshToken = async (refreshToken:string) => {
    const query = `
        SELECT * FROM refresh_tokens
        WHERE id = $1
    `;
    const {rows} = await pool.query(query, [refreshToken]);
    return rows[0];
}

export const insertRefreshToken = async (refreshToken: string) => {
    const query = `
        INSERT INTO refresh_tokens (id)
        VALUES ($1)
    `;
    await pool.query(query, [refreshToken]);
};

export const deleteRefreshToken =async (refreshToken:string) => {
    const query = `
        DELETE FROM refresh_tokens
        WHERE id = $1
    `;
    await pool.query(query, [refreshToken]);
};