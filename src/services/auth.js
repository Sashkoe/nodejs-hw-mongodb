import { Session } from '../db/models/Session.js';
import { User } from '../db/models/User.js';
import { randomBytes } from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import bcrypt from 'bcrypt';
import currentYear from '../utils/getCurrentYear.js';
import jwt from 'jsonwebtoken';
import {
  accessTokenValidityTime,
  refreshTokenValidityTime,
} from '../constants/users-constants.js';
import { generatePasswordResetEmail } from '../utils/generatePasswordResetEmail.js';
import env from '../utils/env.js';
import { createJwtToken } from '../utils/jwt.js';

export const findUser = (filter) => User.findOne(filter);
export const findSession = (filter) => Session.findOne(filter);
export const logoutUser = (sessionId) => Session.findOneAndDelete(sessionId);

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = Date.now() + accessTokenValidityTime;
  const refreshTokenValidUntil = Date.now() + refreshTokenValidityTime;

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const registerUser = async (userRegistrationData) => {
  const { password } = userRegistrationData;
  const hashedPassword = await bcrypt.hash(password, 10);
  return User.create({ ...userRegistrationData, password: hashedPassword });
};

export const loginUser = async (userId) => {
  await Session.deleteOne({ userId });
  const newSession = createSession();
  return Session.create({
    userId,
    ...newSession,
  });
};

export const refreshSession = async (refreshToken) => {
  const oldSession = await Session.findOneAndDelete(refreshToken);
  const newSession = createSession();
  return Session.create({
    userId: oldSession.userId,
    ...newSession,
  });
};

export const sendPasswordResetToken = async (user) => {
  const { _id: userId, name: userName, email } = user;
  const passwordResetToken = createJwtToken({
    sub: userId,
    email,
  });

  const resetLink = `${env(
    'FRONTEND_DOMAIN',
  )}/reset-password?token=${passwordResetToken}`;

  const emailData = {
    to: email,
    subject: 'Reset password',
    html: generatePasswordResetEmail({
      userName,
      resetLink,
      currentYear,
    }),
  };

  return sendEmail(emailData);
};

export const resetPassword = async (userId, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return User.findByIdAndUpdate(userId, { password: hashedPassword });
};
