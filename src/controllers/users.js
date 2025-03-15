import { THIRTY_DAYS } from '../constants/index.js';
import {
  signinUser,
  logoutUser,
  refreshUsersSession,
  signupUser,
  requestResetToken,
  resetPassword,
  updateUser,
  getUsersCounter,
  loginOrSignupWithGoogle,
} from '../services/users.js';
import { saveFileToCloudinary } from '../utils/cloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import createHttpError from 'http-errors';
import { updateUserSchema } from '../validation/users.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';

export const signupUserController = async (req, res) => {
  const user = await signupUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

const setupSession = (res, session) => {
  const isProduction = getEnvVar('NODE_ENV', 'development') === 'production';

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    expires: new Date(Date.now() + THIRTY_DAYS),
    path: '/',
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    expires: new Date(Date.now() + THIRTY_DAYS),
    path: '/',
  });
};

export const signinUserController = async (req, res) => {
  const session = await signinUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      sessionId: session._id,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    },
  });
};

export const refreshUserSessionController = async (req, res) => {
  const sessionId = req.body.sessionId || req.cookies?.sessionId || null;
  const refreshToken =
    req.body.refreshToken || req.cookies?.refreshToken || null;

  if (!sessionId || !refreshToken) {
    return res.status(400).json({
      status: 400,
      message: 'Session ID and refresh token are required',
    });
  }

  const session = await refreshUsersSession({ sessionId, refreshToken });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      sessionId: session._id,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const getCurrentUserController = async (req, res) => {
  const {
    _id,
    name,
    email,
    gender,
    weight,
    dailySportTime,
    dailyNorm,
    avatarUrl,
  } = req.user;

  res.json({
    status: 200,
    message: 'Current user retrieved successfully!',
    data: {
      _id,
      name,
      email,
      gender,
      weight,
      dailySportTime,
      dailyNorm,
      avatarUrl,
    },
  });
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};

export const updateUserController = async (req, res, next) => {
  const userId = req.user.id;

  const { error, value } = updateUserSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    return next(
      createHttpError(
        400,
        `Validation error: ${error.details.map((d) => d.message).join(', ')}`,
      ),
    );
  }

  const updatedUser = await updateUser(userId, value);

  if (!updatedUser) {
    return next(createHttpError(404, 'User not found or not updated'));
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated user information!',
    data: updatedUser,
  });
};

export const updateUserAvatarController = async (req, res, next) => {
  const userId = req.user.id;
  const photo = req.file;

  if (!userId) {
    return next(createHttpError(400, 'User ID is required'));
  }

  if (!photo) {
    return next(createHttpError(400, 'No file uploaded'));
  }

  const avatarUrl =
    getEnvVar('ENABLE_CLOUDINARY') === 'true'
      ? await saveFileToCloudinary(photo)
      : await saveFileToUploadDir(photo);

  const updatedUser = await updateUser(userId, { avatarUrl });

  if (!updatedUser) {
    return next(createHttpError(404, 'User not found or not updated'));
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated user avatar!',
    data: updatedUser,
  });
};

export const getUsersCounterController = async (req, res) => {
  const userData = await getUsersCounter();
  const { usersCounter, lastUsersAvatars } = userData;

  const responseData = {
    status: 200,
    message: 'Successfully got full info about registered users!',
    data: {
      usersCounter,
      lastUsersAvatars,
    },
  };

  res.status(200).json(responseData);
};

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {
      url,
    },
  });
};

export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrSignupWithGoogle(req.body.code);
  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
