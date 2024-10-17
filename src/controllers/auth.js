import createHttpError from 'http-errors';
import {
  findSession,
  findUser,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  resetPassword,
  sendPasswordResetToken,
} from '../services/auth.js';
import bcrypt from 'bcrypt';
import { refreshTokenValidityTime } from '../constants/users-constants.js';
import { verifyToken } from '../utils/jwt.js';

const setSessionCookies = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + refreshTokenValidityTime),
  });
};

export const registerController = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const newUser = await registerUser(req.body);
  const data = {
    name: newUser.name,
    email: newUser.email,
  };

  res.status(201).json({
    status: 201,
    message: 'User successfully registered',
    data,
  });
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (!user) throw createHttpError(401, 'Wrong credentials');

  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) throw createHttpError(401, 'Wrong credentials');

  const session = await loginUser(user._id);
  setSessionCookies(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: { accessToken: session.accessToken },
  });
};

export const refreshController = async (req, res) => {
  const { refreshToken } = req.cookies;
  const activeSession = await findSession({ refreshToken });
  if (!activeSession) throw createHttpError(401, 'Session is not found');

  if (new Date() > activeSession.refreshTokenValidUntil)
    throw createHttpError(401, 'Session token is invalid');

  const newSession = await refreshSession({ _id: activeSession._id });
  setSessionCookies(res, newSession);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: newSession.accessToken },
  });
};

export const logoutController = async (req, res) => {
  const { refreshToken } = req.cookies;
  const activeSession = await findSession({ refreshToken });
  if (!activeSession) throw createHttpError(401, 'Session is not found');
  await logoutUser({ _id: activeSession._id });
  res.clearCookie('refreshToken').sendStatus(204);
};

export const passwordResetRequestController = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (!user) throw createHttpError(404, 'User not found!');

  try {
    await sendPasswordResetToken(user);
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
      error,
    );
  }

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const passwordResetController = async (req, res) => {
  const { token, password } = req.body;
  const { data, error } = verifyToken(token);
  if (error) throw createHttpError(401, 'Token is expired or invalid.');

  const userId = data.sub;

  const user = await findUser({ _id: userId });
  if (!user) throw createHttpError(404, 'User not found!');

  await resetPassword(userId, password);
  const activeSession = await findSession({ userId });
  await logoutUser({ _id: activeSession._id });

  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
