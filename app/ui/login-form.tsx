'use client';

import { lusitana, inter } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useActionState } from 'react';
import { appleSignin, authenticate, githubSignin, googleSignin } from '../lib/actions';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [errorMessage, loginAction, isPending] = useActionState(authenticate, undefined);
  const [googleSiginErrorMessage, googleSigninAction, isGoogleSigninPending] = useActionState(googleSignin, undefined);
  const [appleErrorMessage, appleSigninAction, isAppleSigninPending] = useActionState(appleSignin, undefined);
  const [githubErrorMessage, githubSigninAction, isGithubSigninPending] = useActionState(githubSignin, undefined);

  return (
    <div className="flex-1 px-2 pb-4 pt-8">
      <h1 className={`mb-3 text-2xl text-center`}>
        Login
      </h1>
      <p className='text-center'>Please enter your details to login</p>
      <div className='flex gap-4 pb-4 pt-4'>
        <form action={googleSigninAction} className='flex-1'>
          <button className="w-full flex gap-2 items-center justify-center text-center bg-gray-100 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-gray-300">
            <div>
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width='22' height='22' viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ display: 'block' }}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            Sign in with Google
          </button>
        </form>
        {/* <form action={appleSigninAction} className='flex-1'>
          <button className="w-full flex gap-2 items-center justify-center flex-1 text-center bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700">
            <div style={{ position: 'relative', top: '-2px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }} width='22' height='22' viewBox="20.5 16 15 19">
                <g fill="none" fillRule="evenodd">
                  <path fill="#fff" fillRule="nonzero" d="M28.2226562,20.3846154 C29.0546875,20.3846154 30.0976562,19.8048315 30.71875,19.0317864 C31.28125,18.3312142 31.6914062,17.352829 31.6914062,16.3744437 C31.6914062,16.2415766 31.6796875,16.1087095 31.65625,16 C30.7304687,16.0362365 29.6171875,16.640178 28.9492187,17.4494596 C28.421875,18.06548 27.9414062,19.0317864 27.9414062,20.0222505 C27.9414062,20.1671964 27.9648438,20.3121424 27.9765625,20.3604577 C28.0351562,20.3725366 28.1289062,20.3846154 28.2226562,20.3846154 Z M25.2929688,35 C26.4296875,35 26.9335938,34.214876 28.3515625,34.214876 C29.7929688,34.214876 30.109375,34.9758423 31.375,34.9758423 C32.6171875,34.9758423 33.4492188,33.792117 34.234375,32.6325493 C35.1132812,31.3038779 35.4765625,29.9993643 35.5,29.9389701 C35.4179688,29.9148125 33.0390625,28.9122695 33.0390625,26.0979021 C33.0390625,23.6579784 34.9140625,22.5588048 35.0195312,22.474253 C33.7773438,20.6382708 31.890625,20.5899555 31.375,20.5899555 C29.9804688,20.5899555 28.84375,21.4596313 28.1289062,21.4596313 C27.3554688,21.4596313 26.3359375,20.6382708 25.1289062,20.6382708 C22.8320312,20.6382708 20.5,22.5950413 20.5,26.2911634 C20.5,28.5861411 21.3671875,31.013986 22.4335938,32.5842339 C23.3476562,33.9129053 24.1445312,35 25.2929688,35 Z"></path>
                </g>
              </svg>
            </div>
            Sign in with Apple
          </button>
        </form> */}
        <form action={githubSigninAction} className='flex-1'>
          <button className="w-full flex gap-2 items-center justify-center flex-1 text-center bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700">
            <div>
              <svg width="22" height="22" viewBox="0 0 98 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_730_27136)">
                  <path d="M41.4395 69.3848C28.8066 67.8535 19.9062 58.7617 19.9062 46.9902C19.9062 42.2051 21.6289 37.0371 24.5 33.5918C23.2559 30.4336 23.4473 23.7344 24.8828 20.959C28.7109 20.4805 33.8789 22.4902 36.9414 25.2656C40.5781 24.1172 44.4062 23.543 49.0957 23.543C53.7852 23.543 57.6133 24.1172 61.0586 25.1699C64.0254 22.4902 69.2891 20.4805 73.1172 20.959C74.457 23.543 74.6484 30.2422 73.4043 33.4961C76.4668 37.1328 78.0937 42.0137 78.0937 46.9902C78.0937 58.7617 69.1934 67.6621 56.3691 69.2891C59.623 71.3945 61.8242 75.9883 61.8242 81.252L61.8242 91.2051C61.8242 94.0762 64.2168 95.7031 67.0879 94.5547C84.4102 87.9512 98 70.6289 98 49.1914C98 22.1074 75.9883 6.69539e-07 48.9043 4.309e-07C21.8203 1.92261e-07 -1.9479e-07 22.1074 -4.3343e-07 49.1914C-6.20631e-07 70.4375 13.4941 88.0469 31.6777 94.6504C34.2617 95.6074 36.75 93.8848 36.75 91.3008L36.75 83.6445C35.4102 84.2188 33.6875 84.6016 32.1562 84.6016C25.8398 84.6016 22.1074 81.1563 19.4277 74.7441C18.375 72.1602 17.2266 70.6289 15.0254 70.3418C13.877 70.2461 13.4941 69.7676 13.4941 69.1934C13.4941 68.0449 15.4082 67.1836 17.3223 67.1836C20.0977 67.1836 22.4902 68.9063 24.9785 72.4473C26.8926 75.2227 28.9023 76.4668 31.2949 76.4668C33.6875 76.4668 35.2187 75.6055 37.4199 73.4043C39.0469 71.7773 40.291 70.3418 41.4395 69.3848Z" fill="white" />
                </g>
                <defs>
                  <clipPath id="clip0_730_27136">
                    <rect width="98" height="96" fill="white" />
                  </clipPath>
                </defs>
              </svg>


            </div>
            Sign in with Github
          </button>
        </form>
      </div>
      <span className="flex items-center">
        <span className="h-px flex-1 bg-gray-300"></span>

        <span className="shrink-0 px-4 text-gray-900">Or</span>

        <span className="h-px flex-1 bg-gray-300"></span>
      </span>
      <form className="space-y-3" action={loginAction}>
        <div className="w-full">
          <div>
            <label htmlFor="email">
              <span className="text-sm font-medium text-gray-700"> Email </span>

              <input type="email" id="email" name="email"
                placeholder="Enter your email address"
                required className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm" />
            </label>
          </div>
          <div className="mt-4">
            <label htmlFor="password">
              <span className="text-sm font-medium text-gray-700"> Password </span>

              <input type="password" id="password" name="password"
                placeholder="Enter password"
                required
                minLength={6} className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm" />
            </label>
          </div>
        </div>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <Button className="mt-4 w-full" aria-disabled={isPending}>
          Log in
        </Button>
        <div className="flex h-8 items-end space-x-1" aria-live="polite"
          aria-atomic="true">
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
