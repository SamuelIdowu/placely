'use client';

import { useState, useEffect, useTransition } from 'react';
import { switchAccount, toggleVerification, getDevState } from './actions';

type DevState = {
  role: 'STUDENT' | 'EMPLOYER' | 'ADMIN';
  email: string;
  verificationStatus: string | null;
} | null;

const ROLES = ['STUDENT', 'EMPLOYER', 'ADMIN'] as const;
const VERIFICATION_STATUSES = ['PENDING', 'VERIFIED', 'REJECTED'] as const;

export function DevStateToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<DevState>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    getDevState().then((data) => {
      if (data) setState(data);
    });
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;
  if (!state) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {isOpen && (
        <div className="mb-3 w-72 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl p-4 text-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
              Dev State Toggle
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">
              {state.email}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-2">
                Role
              </label>
              <div className="flex gap-1">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      startTransition(() => switchAccount(role));
                    }}
                    disabled={isPending}
                    className={`
                      flex-1 px-2 py-1.5 rounded text-xs font-mono transition-all
                      ${state.role === role
                        ? 'bg-indigo-600 text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300'
                      }
                      ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {role === 'STUDENT' ? 'Student' : role === 'EMPLOYER' ? 'Employer' : 'Admin'}
                  </button>
                ))}
              </div>
            </div>

            {state.verificationStatus && (
              <div>
                <label className="block text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-2">
                  Verification
                </label>
                <div className="flex gap-1">
                  {VERIFICATION_STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        startTransition(() => toggleVerification(status));
                      }}
                      disabled={isPending}
                      className={`
                        flex-1 px-2 py-1.5 rounded text-xs font-mono transition-all
                        ${state.verificationStatus === status
                          ? status === 'VERIFIED'
                            ? 'bg-emerald-600 text-white'
                            : status === 'REJECTED'
                            ? 'bg-red-600 text-white'
                            : 'bg-amber-600 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300'
                        }
                        ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      {status === 'PENDING' ? 'Pending' : status === 'VERIFIED' ? 'Verified' : 'Rejected'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-zinc-800">
              <p className="text-[10px] text-zinc-600 font-mono">
                Switching roles re-authenticates as seed user
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 shadow-lg flex items-center justify-center hover:bg-zinc-800 transition-colors"
        title="Dev State Toggle"
      >
        <span className="text-xs font-mono text-zinc-400">
          {state.role === 'STUDENT' ? 'S' : state.role === 'EMPLOYER' ? 'E' : 'A'}
        </span>
      </button>
    </div>
  );
}
