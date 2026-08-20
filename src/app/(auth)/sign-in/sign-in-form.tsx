'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, ArrowRight, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { signInAction, type SignInActionResult } from './actions';

function SignInFormComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const callbackUrl = searchParams.get('callbackUrl') || '';

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorState, setErrorState] = useState<SignInActionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorState(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    if (callbackUrl) formData.append('callbackUrl', callbackUrl);

    try {
      const result = await signInAction(formData);

      if (result.error) {
        setErrorState(result);
        setLoading(false);
        return;
      }

      if (result.success) {
        const dest = result.redirectUrl || '/dashboard';
        window.location.href = dest;
      }
    } catch {
      setErrorState({
        error: 'An unexpected error occurred. Please try again.',
        code: 'UNKNOWN',
      });
      setLoading(false);
    }
  };

  const isAccountNotFound = errorState?.code === 'ACCOUNT_NOT_FOUND';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorState?.error && (
        <div
          className={`p-3.5 rounded-xl border text-xs sm:text-sm ${
            isAccountNotFound
              ? 'bg-amber-50/90 border-amber-200 text-amber-900'
              : 'bg-rose-50/90 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle
              className={`w-4 h-4 mt-0.5 shrink-0 ${
                isAccountNotFound ? 'text-amber-600' : 'text-rose-600'
              }`}
            />
            <div className="space-y-2 flex-1">
              <p className="font-medium leading-snug">{errorState.error}</p>
              {isAccountNotFound && (
                <div className="pt-1">
                  <Link
                    href={`/sign-up?email=${encodeURIComponent(email.trim())}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-2xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Create an account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errorState) setErrorState(null);
          }}
          placeholder="name@university.edu.ng"
          className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Password
          </label>
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errorState) setErrorState(null);
            }}
            placeholder="••••••••"
            className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 pr-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 min-w-[44px] text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-3 px-4 text-sm font-semibold text-white shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        {loading ? (
          'Signing in...'
        ) : (
          <>
            Sign in <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}

export function SignInForm() {
  return (
    <Suspense fallback={<div className="h-48 flex items-center justify-center text-xs text-slate-400">Loading form...</div>}>
      <SignInFormComponent />
    </Suspense>
  );
}
