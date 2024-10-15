import nodemailer from 'nodemailer';
import env from './env.js';

const nodemailerConfig = {
  host: env('SMTP_HOST'),
  port: env('SMTP_PORT'),
  secure: true,
  auth: {
    user: env('SMTP_USERNAME'),
    pass: env('SMTP_PASSWORD'),
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

// const emailData = {
//   to: 'receiver's email',
//   subject: 'test email',
//   html: '<strong>Test email</strong>',
// };

const sendEmail = (emailData) => {
  const email = { ...emailData, from: env('SMTP_FROM') };
  return transporter.sendMail(email);
};

export default sendEmail;
