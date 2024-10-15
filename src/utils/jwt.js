import jwt from 'jsonwebtoken';
import env from './env.js';
import { jwtTokenExpirationTime } from '../constants/users-constants.js';

const jwtSecret = env('JWT_SECRET');

export const createJwtToken = (data) =>
  jwt.sign(data, jwtSecret, { expiresIn: jwtTokenExpirationTime });

export const verifyToken = (token) => {
  try {
    const payload = jwt.verify(token, jwtSecret);
    return { data: payload };
  } catch (error) {
    return { error };
  }
};
