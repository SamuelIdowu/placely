'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, UserCheck, ExternalLink, FileText, Mail, Building2, GraduationCap, ArrowRight } from 'lucide-react';

export interface UserItem {
  id: string;
  email: string;
  role: 'STUDENT' | 'EMPLOYER' | 'ADMIN';
  createdAt: Date | string;
  student?: {
    id: string;
    university: string;
    discipline: string;
    verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
    resumeUrl?: string | null;
  } | null;
  employer?: {
    id: string;
    companyName: string;
    cacNumber: string;
    verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  } | null;
}

interface AdminUsersClientProps {
  initialUsers: UserItem[];
}

export function AdminUsersClient({ initialUsers }: AdminUsersClientProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [users, setUsers] = React.useState<UserItem[]>(initialUsers);
  const [selectedUser, setSelectedUser] = React.useState<UserItem | null>(null);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      const res = await fetch(`/api/admin/users?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to search users', err);
    }
  };

  const getVerificationStatus = (user: UserItem) => {
    if (user.role === 'ADMIN') return 'VERIFIED';
    if (user.role === 'STUDENT') return user.student?.verificationStatus || 'PENDING';
    if (user.role === 'EMPLOYER') return user.employer?.verificationStatus || 'PENDING';
    return 'PENDING';
  };

  const getUserDisplayName = (user: UserItem) => {
    if (user.role === 'EMPLOYER' && user.employer?.companyName) {
      return user.employer.companyName;
    }
    if (user.role === 'STUDENT' && user.student?.university) {
      return `${user.student.discipline} · ${user.student.university}`;
    }
    return user.email.split('@')[0];
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by email, university, or company name..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-2xs font-medium"
        />
      </div>

      {/* Users Data Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              <tr>
                <th className="py-3 px-5">User &amp; Organization</th>
                <th className="py-3 px-5">Role</th>
                <th className="py-3 px-5">Verification</th>
                <th className="py-3 px-5">Joined Date</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => {
                const status = getVerificationStatus(user);
                const displayName = getUserDisplayName(user);

                return (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900">{displayName}</div>
                      <div className="text-[11px] text-slate-500">{user.email}</div>
                    </td>

                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : user.role === 'EMPLOYER'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          status === 'VERIFIED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : status === 'REJECTED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedUser(user)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-indigo hover:text-brand-indigo-hover"
                      >
                        Inspect <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-normal">Account Details</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              User identity and verified platform history.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-700 block">Email Address:</span>
                <p className="font-mono text-slate-900">{selectedUser.email}</p>
              </div>

              {selectedUser.student && (
                <div className="space-y-2 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                    <GraduationCap className="w-4 h-4 text-brand-indigo" /> Student Credentials
                  </div>
                  <p className="text-slate-700">
                    <strong>University:</strong> {selectedUser.student.university}
                  </p>
                  <p className="text-slate-700">
                    <strong>Discipline:</strong> {selectedUser.student.discipline}
                  </p>
                  {selectedUser.student.resumeUrl && (
                    <a
                      href={selectedUser.student.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-brand-indigo hover:underline inline-block pt-1"
                    >
                      View Resume PDF ↗
                    </a>
                  )}
                </div>
              )}

              {selectedUser.employer && (
                <div className="space-y-2 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                    <Building2 className="w-4 h-4 text-emerald-600" /> Corporate Credentials
                  </div>
                  <p className="text-slate-700">
                    <strong>Company:</strong> {selectedUser.employer.companyName}
                  </p>
                  <p className="text-slate-700">
                    <strong>CAC Number:</strong> {selectedUser.employer.cacNumber || 'N/A'}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
