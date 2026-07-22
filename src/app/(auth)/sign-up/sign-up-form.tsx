'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { signUpAction } from './actions';

export function SignUpForm() {
  const router = useRouter();
  const [role, setRole] = useState<'STUDENT' | 'EMPLOYER'>('STUDENT');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append('role', role);

    const result = await signUpAction(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Automatically sign in upon successful registration
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError('Registration successful, but failed to sign in.');
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="role_radio"
            checked={role === 'STUDENT'}
            onChange={() => setRole('STUDENT')}
            className="mr-2"
          />
          I'm a Student
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="role_radio"
            checked={role === 'EMPLOYER'}
            onChange={() => setRole('EMPLOYER')}
            className="mr-2"
          />
          I'm an Employer
        </label>
      </div>

      {role === 'STUDENT' ? (
        <>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                name="firstName"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                name="lastName"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">University</label>
            <input
              name="university"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Discipline / Course</label>
            <input
              name="discipline"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CGPA (optional)</label>
            <input
              name="cgpa"
              type="number"
              step="0.01"
              min="0"
              max="5"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bio (optional)</label>
            <textarea
              name="bio"
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              name="companyName"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CAC Number</label>
            <input
              name="cacNumber"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
            <textarea
              name="description"
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Website URL (optional)</label>
            <input
              name="websiteUrl"
              type="url"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          name="email"
          type="email"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none disabled:opacity-50"
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}
