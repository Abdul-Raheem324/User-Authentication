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
      subject: emailType === 'VERIFY' ? 'Verify Your Email Address' : 'Reset Your Password',
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                color: #333;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              h1 {
                color: #007bff;
                font-size: 24px;
              }
              p {
                font-size: 16px;
                color: #555555;
              }
              a {
                color: #007bff;
                text-decoration: none;
                font-weight: bold;
              }
              .cta-button {
                display: inline-block;
                padding: 12px 25px;
                background-color: #007bff;
                color: #ffffff;
                font-size: 16px;
                text-decoration: none;
                border-radius: 4px;
                text-align: center;
                margin-top: 20px;
              }
              .footer {
                font-size: 14px;
                color: #777;
                text-align: center;
                margin-top: 30px;
              }
              .footer a {
                color: #007bff;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Email ${emailType === 'VERIFY' ? 'Verification' : 'Password Reset'}</h1>
              <p>Hello,</p>
              <p>
                ${emailType === 'VERIFY' ? 
                  `Please click the link below to verify your email address and activate your account.` : 
                  `We received a request to reset your password. Please click the link below to reset it.`}
              </p>
              <p>
                <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}" class="cta-button">
                  ${emailType === 'VERIFY' ? 'Verify Your Email' : 'Reset Your Password'}
                </a>
              </p>
              <p>Alternatively, you can copy and paste the following link into your browser:</p>
              <p style="word-wrap: break-word;">
                ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
              </p>
              <p>If you did not request this action, please ignore this email.</p>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
                <p>If you have any questions, feel free to <a href="mailto:support@yourcompany.com">contact support</a>.</p>
              </div>
            </div>
          </body>
        </html>
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
