'use client';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import React from 'react';

export default function Page() {
  const [token, setToken] = useState('');

  const verifyUserEmail = useCallback(async () => {
    try {
      await axios.post('/api/users/verifyemail', { token });
    } catch (error: unknown) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log(errorMessage);
    }
  }, [token]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    setToken(urlToken || '');
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token, verifyUserEmail]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-700 px-4 sm:px-6 md:px-8">
      <h1 className="font-roboto text-3xl sm:text-4xl md:text-5xl font-extrabold text-black mb-4">
        Email Verification
      </h1>
      <p className="font-roboto text-lg sm:text-xl md:text-2xl font-semibold text-gray-200 mb-6 text-center">
        {token ? `Token: ${token}` : 'No token'}
      </p>
      <Link
        className="rounded-md bg-blue-500 px-4 py-2 sm:px-6 sm:py-3 text-white text-lg hover:bg-blue-700 hover:text-white transition duration-300"
        href="/login"
      >
        Login
      </Link>
    </div>
  );
}
