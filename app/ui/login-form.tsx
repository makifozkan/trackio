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
import { authenticate } from '../lib/actions';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [errorMessage, loginAction, isPending] = useActionState(authenticate, undefined);

  return (
    <form className="space-y-3" action={loginAction}>
      <div className="flex-1 px-2 pb-4 pt-8">
        <h1 className={`mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
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
      </div>
    </form>
  );
}
