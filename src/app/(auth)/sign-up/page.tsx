// app/(auth)/sign-up/page.tsx

import type { Metadata } from 'next';
import { SignUpForm } from './sign-up-form';

export const metadata: Metadata = {
  title: 'Sign Up — Placely',
  description: 'Create your Placely account to find or post SIWES placements.',
};

export default function SignUpPage() {
  return (
    <div>
      <h1 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-slate-900 mb-1">Join Placely</h1>
      <p className="text-xs text-slate-500 mb-5">
        Create your account to find or post SIWES placements
      </p>
      <SignUpForm />
      <p className="mt-5 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <a href="/sign-in" className="text-brand-indigo font-bold hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
