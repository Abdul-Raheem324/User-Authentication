'use client';
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Spinner } from '@nextui-org/react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const ProfilePage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      setLoading(true);
      await axios.get('/api/users/logout');
      toast.success('Logout successful');
      router.push('/login');
    } catch (error: unknown) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-zinc-800 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="w-1/2 rounded-md border-gray-200 text-center bg-gray-900 p-6 sm:p-8 md:p-10 lg:p-12">
        <button
          onClick={logout}
          className="float-right m-2 inline-block rounded-lg bg-red-500 px-2 py-3 text-gray-200 hover:bg-red-700 hover:text-black"
        >
          {loading ? <Spinner size="sm" /> : 'Logout'}
        </button>
        <h1 className="inline-block text-2xl font-bold text-gray-200 sm:text-3xl md:text-4xl">Profile Page</h1>
        <h3 className="mt-5 text-lg font-semibold text-gray-200 sm:text-xl md:text-2xl">
          Welcome {decodeURIComponent(id as string)} !!
        </h3>
        <p className="text-lg italic text-gray-400 sm:text-xl md:text-2xl">
          <span className="font-roboto font-semibold text-blue-500">
            {decodeURIComponent(id as string)}
          </span>
          You are heartily welcomed to this page 💙❤️
        </p>
      </div>
      <Toaster />
    </div>
  );
};

export default ProfilePage;
