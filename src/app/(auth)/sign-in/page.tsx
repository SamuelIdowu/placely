// app/(auth)/sign-in/page.tsx
// Public sign-in page. Credentials handled by NextAuth v5 signIn() action.

import type { Metadata } from 'next';
import { SignInForm } from './sign-in-form';

export const metadata: Metadata = {
  title: 'Sign In — Placely',
  description: "Sign in to Placely, Nigeria's SIWES placement marketplace.",
};

export default function SignInPage() {
  return (
    <div>
      <h1 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-slate-900 mb-1">Sign in to Placely</h1>
      <p className="text-xs text-slate-500 mb-5">
        Nigeria&apos;s verified SIWES placement marketplace
      </p>
      <SignInForm />
      <p className="mt-5 text-center text-xs text-slate-500">
        Don&apos;t have an account?{' '}
        <a href="/sign-up" className="text-[#4f46e5] font-bold hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
