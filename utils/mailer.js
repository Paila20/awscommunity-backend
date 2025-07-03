const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD,
  },
});

const sendConfirmationEmail = async (to, name) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to,
    subject: "Thanks for Joining AWS Community!",
    html: `<p>Hi <strong>${name}</strong>,</p>
           <p>Thank you for your interest in joining our community. We’ll get in touch with you soon!</p>
           <p>Best Regards,<br/>AWS Community Team</p>`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendConfirmationEmail };
