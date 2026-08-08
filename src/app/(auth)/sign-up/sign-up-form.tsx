'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpAction } from './actions';
import { getNigerianUniversities, NUC_ENGINEERING_COURSES } from '@/domain/value-objects/academic';

export function SignUpForm() {
  const router = useRouter();
  const [role, setRole] = useState<'STUDENT' | 'EMPLOYER'>('STUDENT');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Academic dropdown states (instant sync initialization)
  const [universities] = useState<string[]>(() => getNigerianUniversities());
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [customUniversity, setCustomUniversity] = useState<string>('');

  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('');
  const [customDiscipline, setCustomDiscipline] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    formData.append('role', role);

    if (role === 'STUDENT') {
      const finalUni = selectedUniversity === 'Other' ? customUniversity : selectedUniversity;
      const finalDisc = selectedDiscipline === 'Other / Discipline Not Listed' ? customDiscipline : selectedDiscipline;

      if (!finalUni) {
        setError('Please select or enter your University / Institution.');
        setLoading(false);
        return;
      }
      if (!finalDisc) {
        setError('Please select or enter your Engineering Discipline / Course.');
        setLoading(false);
        return;
      }

      formData.set('university', finalUni);
      formData.set('discipline', finalDisc);
    }

    try {
      const result = await signUpAction(formData);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      setSuccess('Account created successfully! Redirecting to sign in...');
      setTimeout(() => {
        router.push('/sign-in');
        router.refresh();
      }, 1000);
    } catch {
      setError('An unexpected error occurred during account creation. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-sm text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200 font-medium">
          {success}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg mb-6">
        <button
          type="button"
          onClick={() => setRole('STUDENT')}
          className={`py-2 text-sm font-medium rounded-md transition-all ${role === 'STUDENT'
              ? 'bg-white text-gray-900 shadow-sm font-semibold'
              : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          I&apos;m a Student
        </button>
        <button
          type="button"
          onClick={() => setRole('EMPLOYER')}
          className={`py-2 text-sm font-medium rounded-md transition-all ${role === 'EMPLOYER'
              ? 'bg-white text-gray-900 shadow-sm font-semibold'
              : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          I&apos;m an Employer
        </button>
      </div>

      <div className="flex gap-4 mb-4">
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

      {role === 'STUDENT' ? (
        <>

          <div>
            <label className="block text-sm font-medium text-gray-700">University / Institution</label>
            <select
              name="university"
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="">Select University / Institution</option>
              {universities.map((uni) => (
                <option key={uni} value={uni}>
                  {uni}
                </option>
              ))}
              <option value="Other">Other / Institution Not Listed</option>
            </select>

            {selectedUniversity === 'Other' && (
              <input
                name="customUniversity"
                type="text"
                placeholder="Enter institution name"
                value={customUniversity}
                onChange={(e) => setCustomUniversity(e.target.value)}
                required
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Discipline / Engineering Course</label>
            <select
              name="discipline"
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none cursor-pointer"
            >
              <option value=""> Select Engineering Course   </option>
              {NUC_ENGINEERING_COURSES.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>

            {selectedDiscipline === 'Other / Discipline Not Listed' && (
              <input
                name="customDiscipline"
                type="text"
                placeholder="Enter engineering course name"
                value={customDiscipline}
                onChange={(e) => setCustomDiscipline(e.target.value)}
                required
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
              />
            )}
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
