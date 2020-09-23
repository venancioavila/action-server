import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

module.exports = transporter;
