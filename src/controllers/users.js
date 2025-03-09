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
} from '../services/users.js';
import { saveFileToCloudinary } from '../utils/cloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import createHttpError from 'http-errors';

export const signupUserController = async (req, res) => {
  const user = await signupUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
};

export const signinUserController = async (req, res) => {
  const session = await signinUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
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
  const { id } = req.params;

  const updatedUser = await updateUser(id, req.body, { new: true });

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
  const { id } = req.params;
  const photo = req.file;

  if (!photo) {
    return next(createHttpError(400, 'No file uploaded'));
  }

  let avatarUrl;
  if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
    avatarUrl = await saveFileToCloudinary(photo);
  } else {
    avatarUrl = await saveFileToUploadDir(photo);
  }

  const updatedUser = await updateUser(id, { avatarUrl }, { new: true });

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
      usersCounter: usersCounter,
      lastUsersAvatars: lastUsersAvatars,
    },
  };

  res.status(200).json(responseData);
};
