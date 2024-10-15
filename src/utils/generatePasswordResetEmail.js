import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import Handlebars from 'handlebars';
import { TEMPLATES_PATH } from '../constants/path.js';

const emailTemplate = await fs.readFile(
  path.join(TEMPLATES_PATH, 'password-reset-email.html'),
  'utf-8',
);

export const generatePasswordResetEmail = ({
  userName,
  resetLink,
  currentYear,
}) => {
  const handlebarsTemplate = Handlebars.compile(emailTemplate);
  return handlebarsTemplate({ userName, resetLink, currentYear });
};
