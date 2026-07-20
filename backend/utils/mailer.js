const nodemailer = require('nodemailer');

const clean = (value) => String(value || '').trim();
const credentials = () => ({
  user: clean(process.env.MAIL_USER || process.env.SMTP_USER),
  pass: clean(process.env.MAIL_PASS || process.env.SMTP_PASS).replace(/\s/g, ''),
});

const provider = () => clean(process.env.MAIL_PROVIDER).toLowerCase()
  || (clean(process.env.BREVO_API_KEY) ? 'brevo' : 'smtp');

const smtpConfig = () => {
  const host = clean(process.env.SMTP_HOST) || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE === undefined
    ? port === 465
    : process.env.SMTP_SECURE === 'true';

  return {
    host,
    port,
    secure,
    requireTLS: !secure && port === 587,
    auth: credentials(),
    family: Number(process.env.SMTP_FAMILY || 4),
    connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT || 10000),
    greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT || 10000),
    socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT || 20000),
    dnsTimeout: Number(process.env.SMTP_DNS_TIMEOUT || 10000),
    tls: { servername: host, minVersion: 'TLSv1.2' },
    logger: process.env.MAIL_DEBUG === 'true',
    debug: process.env.MAIL_DEBUG === 'true',
  };
};

const sender = () => ({
  email: clean(process.env.MAIL_FROM_EMAIL) || credentials().user,
  name: clean(process.env.MAIL_FROM) || "Women's Styles",
});

const configured = () => {
  if (provider() === 'brevo') return Boolean(clean(process.env.BREVO_API_KEY) && sender().email);
  const { user, pass } = credentials();
  return Boolean(user && pass);
};

const status = () => {
  if (provider() === 'brevo') {
    return { provider: 'brevo-https', configured: configured(), endpointPort: 443 };
  }
  const { host, port, secure, family } = smtpConfig();
  return { provider: 'smtp', configured: configured(), host, port, secure, family };
};

let smtpTransport;
const transport = () => {
  if (!smtpTransport) smtpTransport = nodemailer.createTransport(smtpConfig());
  return smtpTransport;
};

const maskEmail = (value) => {
  const [local, domain] = clean(value).split('@');
  if (!domain) return 'invalid-recipient';
  return `${local.slice(0, 2)}***@${domain}`;
};

const errorDetails = (error) => ({
  name: error?.name,
  message: error?.message,
  code: error?.code,
  command: error?.command,
  responseCode: error?.responseCode,
  response: error?.response,
  errno: error?.errno,
  syscall: error?.syscall,
  address: error?.address,
  port: error?.port,
});

const logMailError = (operation, error, extra = {}) => {
  console.error(`[mail] ${operation}:failed`, {
    ...status(),
    ...extra,
    error: errorDetails(error),
  });
};

const recipientList = (to) => (Array.isArray(to) ? to : [to])
  .map((entry) => clean(typeof entry === 'string' ? entry : entry?.address))
  .filter(Boolean);

const sendWithBrevo = async (options) => {
  if (typeof fetch !== 'function') throw new Error('Brevo HTTPS transport requires Node.js 18 or newer');
  const recipients = recipientList(options.to).map((email) => ({ email }));
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': clean(process.env.BREVO_API_KEY),
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: sender(),
      to: recipients,
      subject: options.subject,
      htmlContent: options.html,
      textContent: options.text,
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.message || `Brevo API returned HTTP ${response.status}`);
    error.code = 'EBREVO';
    error.responseCode = response.status;
    error.response = JSON.stringify(body);
    throw error;
  }
  return { messageId: body.messageId, accepted: recipients.map(({ email }) => email), rejected: [] };
};

const sendMail = async (options) => {
  if (!configured()) {
    const error = new Error(provider() === 'brevo'
      ? 'BREVO_API_KEY and a sender email are required'
      : 'MAIL_USER and MAIL_PASS are required');
    error.code = 'EMAIL_NOT_CONFIGURED';
    logMailError('send', error);
    throw error;
  }

  const recipients = recipientList(options.to);
  const context = { to: recipients.map(maskEmail), subject: options.subject };
  console.log('[mail] send:start', { ...status(), ...context });

  try {
    const from = sender();
    const info = provider() === 'brevo'
      ? await sendWithBrevo(options)
      : await transport().sendMail({ from: { name: from.name, address: from.email }, ...options });
    console.log('[mail] send:success', {
      ...context,
      messageId: info.messageId,
      accepted: info.accepted?.length || 0,
      rejected: info.rejected?.length || 0,
      response: info.response,
    });
    return info;
  } catch (error) {
    logMailError('send', error, context);
    throw error;
  }
};

const verify = async () => {
  if (!configured()) {
    const error = new Error(provider() === 'brevo'
      ? 'BREVO_API_KEY and a sender email are missing'
      : 'MAIL_USER and MAIL_PASS are missing');
    error.code = 'EMAIL_NOT_CONFIGURED';
    return { ok: false, ...status(), error: errorDetails(error) };
  }

  try {
    if (provider() === 'brevo') {
      const response = await fetch('https://api.brevo.com/v3/account', {
        headers: { accept: 'application/json', 'api-key': clean(process.env.BREVO_API_KEY) },
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const error = new Error(body.message || `Brevo API returned HTTP ${response.status}`);
        error.code = 'EBREVO';
        error.responseCode = response.status;
        throw error;
      }
    } else {
      await transport().verify();
    }
    return { ok: true, ...status() };
  } catch (error) {
    logMailError('verify', error);
    return { ok: false, ...status(), error: errorDetails(error) };
  }
};

module.exports = { configured, errorDetails, logMailError, sendMail, status, verify };
