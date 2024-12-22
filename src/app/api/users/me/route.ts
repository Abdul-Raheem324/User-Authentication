import { dataFromToken } from '../../../../helpers/dataFromToken';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const user = dataFromToken(request);
    const foundUser = await User.findOne({ _id: user._id }).select('-password');

    if (!foundUser) {
      return NextResponse.json(
        { error: 'User not found from token' },
        { status: 500 }
      );
    }
    return NextResponse.json({
      message: 'User found',
      data: user,
    });
  } catch (error: unknown) { 
    let errorMessage = 'An unknown error occurred'; 
    if (error instanceof Error) { 
      errorMessage = error.message; 
    } 
    return NextResponse.json({ error: errorMessage }, { status: 500 }); 
  }
}
