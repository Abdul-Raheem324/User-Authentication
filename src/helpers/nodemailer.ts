import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';
import nodemailer, { SendMailOptions, SentMessageInfo } from 'nodemailer';

interface SendEmailParams {
  email: string;
  emailType: 'VERIFY' | 'RESET';
  userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: SendEmailParams): Promise<SentMessageInfo> => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === 'VERIFY') {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      debug: true,
    });

    const mailOptions: SendMailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
      html: `
        <h1>Email Verification</h1>
        <p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> 
        to ${emailType === 'VERIFY' ? 'verify your email' : 'reset your password'}
        or copy and paste the link in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
        </p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Error sending email:', errorMessage);
    throw new Error(errorMessage);
  }
};
