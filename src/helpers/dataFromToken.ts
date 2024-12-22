import { NextRequest } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
  username?: string;
  id?: string;
  email?: string;
}

export function dataFromToken(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || '';
    const decodeToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY!) as DecodedToken;

    return decodeToken;
  } catch (error) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
}
