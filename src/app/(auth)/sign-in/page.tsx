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
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to Placely</h1>
        <p className="text-sm text-gray-500 mb-6">
          Nigeria&apos;s verified SIWES placement marketplace
        </p>
        <SignInForm />
        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <a href="/sign-up" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
