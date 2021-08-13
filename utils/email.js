const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '83ff1a518d955d',
      pass: 'e225f1635addab',
    },
  });

  // Define email options
  const mailOptions = {
    from: 'Abdul Momin <momin@findmomin.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
