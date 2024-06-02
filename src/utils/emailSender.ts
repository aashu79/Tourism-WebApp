import nodemailer from "nodemailer";

export interface mailOptionsType {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const sendMail = async (mailOptions: mailOptionsType) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });
  try {
    const response = transporter.sendMail(mailOptions);
    return response;
  } catch (error) {
    throw error;
  }
};

export default sendMail;
