import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import {
  validateCode,
  getFullNameFromGoogleTokenPayload,
} from '../utils/googleOAuth2.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { SessionsCollection } from '../db/models/session.js';
import { THIRTY_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

export const authenticateGoogleOAuth = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return next(createHttpError(400, 'Code is required'));
    }

    const loginTicket = await validateCode(code);
    const payload = loginTicket.getPayload();

    if (!payload) {
      return next(createHttpError(401, 'Invalid Google OAuth code'));
    }

    // Find or create user in the database
    let user = await UsersCollection.findOne({ email: payload.email });

    if (!user) {
      // If user doesn't exist, create a new one
      const password = await bcrypt.hash(randomBytes(10), 10); // Hash a random password
      user = await UsersCollection.create({
        email: payload.email,
        name: getFullNameFromGoogleTokenPayload(payload),
        password,
      });
    }

    // Generate accessToken and refreshToken
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Create a new session
    const newSession = new SessionsCollection({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + THIRTY_MINUTES),
      refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    });

    // Save session to the database
    await newSession.save();

    // Add user data AND the session to req
    req.user = user;
    req.session = newSession;
    next();
  } catch (error) {
    console.error('Google OAuth authentication error:', error);
    return next(createHttpError(500, 'Google OAuth authentication failed'));
  }
};
