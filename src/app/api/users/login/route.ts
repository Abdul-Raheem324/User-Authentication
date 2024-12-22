import { connect } from '../../../../db/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { email, password } = reqBody;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User with this email does'nt exist.Please Login!" },
        { status: 400 }
      );
    }
    if (!user.isVerified) {
      return NextResponse.json(
        { error: 'Please verify your email!' },
        { status: 400 }
      );
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    //create token data
    const tokenData = {
      username: user.username,
      id: user._id,
      email: user.email,
    };
    //creating token
    const token = await jwt.sign(tokenData, process.env.SECRET_TOKEN_KEY!, {
      expiresIn: '1d',
    });

    const response = NextResponse.json({
      message: 'User logged in successfully',
      status: 200,
      data: user,
    });
    response.cookies.set('token', token, {
      httpOnly: true,
    });
    return response;
  } catch (error: unknown) { 
    let errorMessage = 'An unknown error occurred'; 
    if (error instanceof Error) { 
      errorMessage = error.message; 
    } 
    return NextResponse.json({ error: errorMessage }, { status: 500 }); 
  }
}
