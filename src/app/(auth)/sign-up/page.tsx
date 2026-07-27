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
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Join Placely</h1>
      <p className="text-sm text-gray-500 mb-6">
        Create your account to find or post SIWES placements
      </p>
      <SignUpForm />
      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <a href="/sign-in" className="text-blue-600 font-medium hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
