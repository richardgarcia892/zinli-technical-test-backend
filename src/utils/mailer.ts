import nodemailer from 'nodemailer';
import { FE_ACCOUNT_VERIFICATION_ROUTE, FE_PASSWORD_RECOVERY_ROUTE, FE_URL } from '../config/frontend.config';
import { EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_HOST, EMAIL_PORT } from '../config/mail.config';

export interface MailOptions {
  message: string;
  email: string;
  subject: string;
}

interface TransportOptions {
  host?: string;
  port?: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

const sendEmail = async (options: MailOptions) => {
  try {
    // 1) Create a transporter
    const transporterOptions: TransportOptions = {
      host: EMAIL_HOST,
      port: parseInt(EMAIL_PORT),
      secure: false,
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
      },
    };
    const transporter = nodemailer.createTransport(transporterOptions);
    // 2) Define the email options
    const mailOptions = {
      from: 'Richard Garcia <richardgarcia892@hotmail.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      // html:
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

export const sendVerificationEmail = async (token: string, name: string, email: string) => {
  const message = `Wellcome ${name}, this is your Verification URL, please open in a new tab to continue: ${FE_URL}/${FE_ACCOUNT_VERIFICATION_ROUTE}/${token}`;
  const options: MailOptions = {
    email,
    subject: 'User account Verification',
    message,
  };
  await sendEmail(options);
};

export const sendPasswordRecoveryEmail = async (token: string, name: string, email: string) => {
  const message = `Hello ${name}, this is your Password Recovery link, please open in a new tab to continue: ${FE_URL}/${FE_PASSWORD_RECOVERY_ROUTE}/${token}`;
  const options: MailOptions = {
    email,
    subject: 'User account Verification',
    message,
  };
  await sendEmail(options);
};

export default sendEmail;
