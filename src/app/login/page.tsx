'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Spinner } from '@nextui-org/spinner';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [user, setUser] = React.useState({
    email: '',
    password: '',
  });
  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('/api/users/login', user);
      toast.success('Login Successful!');
      const username = response.data.data.username.trim();
      const encodedUsername = encodeURIComponent(username);
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push(`/profile/${encodedUsername}`);
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        console.log('Login failed', error.message);
        if (error.response) {
          toast.error(error.response.data.error);
        } else {
          toast.error('An unknown error occurred');
        }
      } else {
        console.log('Login failed', (error as Error).message);
        toast.error('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-indigo-400 to-cyan-400">
      <div className="absolute left-1/2 top-1/2 flex h-full w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white shadow-xl md:h-2/3 md:w-4/6">
        <div className="flex w-full flex-col items-center justify-center gap-2 rounded-t-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-center md:w-1/2 md:rounded-l-lg md:rounded-tr-none">
          <h1 className="bg- text-center font-roboto text-2xl font-bold italic text-gray-200 md:text-4xl">
            Don&apos;t have an account?{' '}
          </h1>
          <p className="font-roboto text-sm text-gray-400 md:text-base">
            Launch your journey with just one click!
          </p>
          <Link
            href="/signup"
            className="mt-5 w-28 transform rounded-full border-2 border-gray-200 px-3 py-3 text-lg text-white transition duration-300 ease-in-out hover:scale-105 hover:border-black hover:bg-gray-200 hover:text-black"
          >
            SignUp{' '}
          </Link>
        </div>

        <div className="flex w-full items-center justify-center rounded-b-lg p-5 md:w-1/2 md:rounded-r-lg md:rounded-bl-none">
          <div>
            <h1 className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-center font-roboto text-3xl font-bold tracking-wider text-transparent md:text-4xl">
              Welcome Back!
            </h1>
            <div className="mt-5 flex flex-col items-center gap-5 font-roboto">
              <input
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                type="text"
                name="email"
                className="text-md w-full border-b-2 border-gray-400 bg-transparent font-semibold outline-none placeholder:text-gray-400 focus:border-blue-500 active:border-purple-500 md:text-lg"
                placeholder="Email"
                required
              />
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="text-md w-full border-b-2 border-gray-400 bg-transparent font-semibold outline-none placeholder:text-gray-400 focus:border-blue-500 active:border-purple-500 md:text-lg"
                placeholder="Password"
                required
              />
              <button
                type="submit"
                onClick={onLogin}
                disabled={buttonDisabled}
                className={`px-2 ${buttonDisabled ? 'text-gray-600 hover:text-gray-600' : 'cursor-pointer'} w-20 rounded-lg bg-gradient-to-r from-indigo-400 to-cyan-400 py-3 text-white hover:text-black md:w-28`}
              >
                {loading ? <Spinner size="sm" /> : 'Login'}
              </button>
            </div>
            <p className="mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-center font-roboto text-lg tracking-wide text-transparent md:text-xl">
              Forgot Password?
            </p>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}


