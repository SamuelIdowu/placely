// app/(auth)/sign-up/page.tsx

import type { Metadata } from 'next';
import { SignUpForm } from './sign-up-form';

export const metadata: Metadata = {
  title: 'Sign Up — Placely',
  description: 'Create your Placely account to find or post SIWES placements.',
};

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Join Placely</h1>
        <p className="text-sm text-gray-500 mb-6">
          Create your account to find or post SIWES placements
        </p>
        <SignUpForm />
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/sign-in" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}
