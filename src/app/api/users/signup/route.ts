import { connect } from '../../../../db/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { sendEmail } from '../../../../helpers/nodemailer';

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { username, email, password } = reqBody;

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: 'User already exists!' },
        { status: 400 }
      );
    }
    //Hashing the password
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password, salt);

    const createdUser = await User.create({
      username,
      email,
      password: hash,
    });
    const newUser = await createdUser.save();
    //send verification email
    await sendEmail({ email, emailType: 'VERIFY', userId: createdUser._id });

    return NextResponse.json({
      message: 'User created successfully',
      success: true,
      newUser,
      verificationToken: createdUser.verifyToken,
    });
  } catch (error: unknown) { 
    let errorMessage = 'An unknown error occurred'; 
    if (error instanceof Error) { 
      errorMessage = error.message; 
    } 
    return NextResponse.json({ error: errorMessage }, { status: 500 }); 
  }
}
connect();
