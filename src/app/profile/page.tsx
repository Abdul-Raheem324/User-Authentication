'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const logout = async () => {
    try {
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
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-zinc-800 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="w-full max-w-md rounded-md border-gray-200 bg-gray-900 p-6 text-center sm:p-8 md:p-10 lg:p-12">
        <button
          onClick={logout}
          className="float-right m-2 inline-block rounded-lg bg-red-500 px-2 py-3 text-gray-200 hover:bg-red-700 hover:text-black"
        >
          Logout
        </button>
        <h1 className="inline-block text-2xl font-bold text-gray-200 sm:text-3xl md:text-4xl">
          Profile Page
        </h1>
        <h3 className="mt-5 text-lg font-semibold text-gray-200 sm:text-xl md:text-2xl">
          Welcome Name !!
        </h3>
        <p className="text-lg italic text-gray-400 sm:text-xl md:text-2xl">
          <span className="font-roboto font-semibold text-blue-500">Name</span>{' '}
          You are heartily welcomed to this page 💙❤️
        </p>
      </div>
      <Toaster />
    </div>
  );
}
