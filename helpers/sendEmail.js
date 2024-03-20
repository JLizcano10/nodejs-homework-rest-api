const nodemailer = require("nodemailer");
require("dotenv").config();

const { GMAIL_USER, GMAIL_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.gmail.com",
  port: 465, // 25, 465, 2525
  secure: true,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: GMAIL_USER };
  await transport.sendMail(email);
  return true;
};

module.exports = sendEmail;
