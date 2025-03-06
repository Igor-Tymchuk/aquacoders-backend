import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/index.js";
import { Session } from "../db/models/session.js";
import { User } from "../db/models/user.js";

export const registerUser = async (payload) => {
  const { email, password } = payload;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword });

  return user;
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(payload.password, user.password);
  if (!isMatch) {
    throw createHttpError(401, "Unauthorized");
  }

  await Session.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  return await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const logoutUser = async (userId) => {
  await Session.deleteOne({ userId });
};
