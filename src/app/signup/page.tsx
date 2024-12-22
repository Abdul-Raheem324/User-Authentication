'use client';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Spinner } from '@nextui-org/react';

export default function SignupPage() {
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const [user, setUser] = React.useState({
    username: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (
      user.username.length > 0 &&
      user.password.length > 0 &&
      user.email.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onSignup = async () => {
    try {
      setLoading(true);
      await axios.post('/api/users/signup', user);
      toast.success('SignUp Successful');
      router.push(`/login`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
        toast.error(error.response.data.error);
      }
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log('Signup Failed:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-indigo-400 to-cyan-400">
      <div className="absolute left-1/2 top-1/2 flex w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white shadow-xl md:h-2/3 md:w-4/6">
        <div className="flex flex-col w-full md:w-1/2 items-center justify-center gap-5 p-5 md:p-10">
          <h1 className="text-center font-roboto text-2xl md:text-4xl font-bold tracking-wider text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text">
            Create Account
          </h1>
          <div className="mt-5 flex flex-col items-center gap-5 font-roboto">
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="text-md w-full border-b-2 border-gray-400 bg-transparent font-semibold outline-none placeholder:text-gray-400 focus:border-blue-500 active:border-purple-500"
              placeholder="Username"
              required
            />
            <input
              type="text"
              name="email"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              value={user.email}
              className="text-md w-full border-b-2 border-gray-400 bg-transparent font-semibold outline-none placeholder:text-gray-400 focus:border-blue-500 active:border-purple-500"
              placeholder="Email"
              required
            />
            <input
              type="password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              value={user.password}
              name="password"
              className="text-md w-full border-b-2 border-gray-400 bg-transparent font-semibold outline-none placeholder:text-gray-400 focus:border-blue-500 active:border-purple-500"
              placeholder="Password"
              required
            />
            <button
              type="submit"
              disabled={buttonDisabled}
              onClick={onSignup}
              className={`px-2 ${buttonDisabled ? 'text-gray-600 hover:text-gray-600' : 'cursor-pointer'} w-20 md:w-28 rounded-lg bg-gradient-to-r from-indigo-400 to-cyan-400 py-3 text-white hover:text-black`}
            >
              {loading ? <Spinner size="sm" /> : 'Signup'}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-5 w-full md:w-1/2 rounded-r-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-center p-5 md:p-10">
          <h1 className="text-center font-roboto text-2xl md:text-4xl font-bold italic text-gray-200">
            Already have an account?
          </h1>
          <p className="font-roboto text-sm text-gray-400 md:text-base">
            Login with email & password
          </p>
          <Link
            href="/login"
            className="mt-5 w-28 transform rounded-full border-2 border-gray-200 px-3 py-3 text-lg text-white transition duration-300 ease-in-out hover:scale-105 hover:border-black hover:bg-gray-200 hover:text-black"
          >
            Login
          </Link>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
