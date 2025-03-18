import jwt from 'jsonwebtoken';
import { getEnvVar } from './getEnvVar.js';

const JWT_SECRET = getEnvVar('JWT_SECRET');

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: '30m',
  });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: '30d',
  });
};
