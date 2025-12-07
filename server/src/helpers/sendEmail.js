const transporter = require('../config/email');

// Function to send emails using nodemailer
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // Define the email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // sender address
      to, // list of receivers
      subject, // subject line
      text, // plain text body
      html, // html body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = {
  sendEmail
};