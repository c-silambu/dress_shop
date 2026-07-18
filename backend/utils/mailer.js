const nodemailer = require('nodemailer');

const credentials = () => ({
  user: process.env.MAIL_USER || process.env.SMTP_USER,
  pass: process.env.MAIL_PASS || process.env.SMTP_PASS,
});

const configured = () => {
  const { user, pass } = credentials();
  return Boolean(user && pass);
};

const transport = () => {
  const auth = credentials();
  if (!process.env.SMTP_HOST) return nodemailer.createTransport({ service: 'gmail', auth });
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: port === 465, auth });
};

const sendMail = (options) => {
  if (!configured()) throw new Error('MAIL_USER and MAIL_PASS are not configured');
  const { user } = credentials();
  return transport().sendMail({
    from: process.env.MAIL_FROM ? `${process.env.MAIL_FROM} <${user}>` : user,
    ...options,
  });
};

module.exports = { configured, sendMail };
