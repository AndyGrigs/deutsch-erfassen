const sendEmail = require('./sendEmail').sendEmail;

// Specific email templates
const sendVerificationEmail = async (to, verificationToken, name) => {
  const html = `
    <h2>Email Verification</h2>
    <p>Hello ${name},</p>
    <p>Please click the link below to verify your email address:</p>
    <a href="${process.env.BASE_URL}/api/auth/verify/${verificationToken}">Verify Email</a>
    <p>This link will expire in 24 hours.</p>
    <p>If you didn't create an account, please ignore this email.</p>
  `;

  return await sendEmail({
    to,
    subject: 'Email Verification',
    html
  });
};

const sendPasswordResetEmail = async (to, resetToken, name) => {
  const html = `
    <h2>Password Reset Request</h2>
    <p>Hello ${name},</p>
    <p>You have requested to reset your password. Click the link below to reset it:</p>
    <a href="${process.env.BASE_URL}/reset-password/${resetToken}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  return await sendEmail({
    to,
    subject: 'Password Reset Request',
    html
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};