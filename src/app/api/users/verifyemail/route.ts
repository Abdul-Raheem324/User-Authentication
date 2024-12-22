import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;

    const user = await User.findOneAndUpdate(
      {
        verifyToken: token,
        verifyTokenExpiry: { $gt: new Date() }, // Ensure token is not expired
      },
      {
        $set: {
          isVerified: true,
          verifyToken: undefined,
          verifyTokenExpiry: undefined,
        },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Email verified successfully',
      success: true,
    });
  } catch (error: unknown) { 
    let errorMessage = 'An unknown error occurred'; 
    if (error instanceof Error) { 
      errorMessage = error.message; 
    } 
    return NextResponse.json({ error: errorMessage }, { status: 500 }); 
  }
}
