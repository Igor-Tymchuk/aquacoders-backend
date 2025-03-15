import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import { SessionsCollection } from '../db/models/session.js';
import {
  THIRTY_DAYS,
  THIRTY_MINUTES,
  APP_DOMAIN,
  JWT_SECRET,
  SMTP,
  TEMPLATES_DIR,
} from '../constants/index.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendMail.js';
import path from 'node:path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import {
  getFullNameFromGoogleTokenPayload,
  validateCode,
} from '../utils/googleOAuth2.js';

export const signupUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + THIRTY_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const signinUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }
  await SessionsCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const updateUser = async (id, payload, options = {}) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');
  const result = await UsersCollection.findOneAndUpdate({ _id: id }, payload, {
    ...options,
    new: true,
  });
  return result;
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    JWT_SECRET,
    { expiresIn: '15m' },
  );
  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();
  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${APP_DOMAIN}/reset-password?token=${resetToken}`,
  });
  await sendEmail({
    from: SMTP.SMTP_FROM,
    to: email,
    subject: 'Reset your password',
    html: html,
  });
};

export const resetPassword = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, JWT_SECRET);
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');
    throw err;
  }
  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  await UsersCollection.updateOne(
    { _id: user._id },
    { $set: { password: encryptedPassword } },
  );
  await SessionsCollection.deleteMany({ userId: user._id });
};

export const getUsersCounter = async () => {
  try {
    const usersCounter = await UsersCollection.countDocuments({});
    const lastUsersAvatars = [];

    let skip = 0;
    const limit = 5;

    while (lastUsersAvatars.length < 3) {
      const usersBatch = await UsersCollection.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      if (usersBatch.length === 0) break;
      usersBatch.forEach((user) => {
        if (user.avatarUrl && user.avatarUrl.trim() !== '') {
          lastUsersAvatars.push(user.avatarUrl);
        }
      });
      skip += limit;
    }

    return {
      usersCounter,
      lastUsersAvatars: lastUsersAvatars.slice(0, 3),
    };
  } catch (error) {
    console.log(error);
    throw createHttpError(404, 'Error fetching users data');
  }
};

export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401);

  let user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);
    user = await UsersCollection.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password,
    });
  }

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};
