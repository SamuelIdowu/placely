'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, UserCheck, ExternalLink, FileText, Mail, Building2, GraduationCap } from 'lucide-react';

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
      return `${user.student.discipline} Student (${user.student.university})`;
    }
    return user.email.split('@')[0];
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by email, university, or company..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9 bg-white border-app-border rounded-[4px]"
        />
      </div>

      {/* Users Data Table */}
      <div className="bg-white border border-app-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-app-border text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="py-3.5 px-4">User & Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {users.map((user) => {
                const status = getVerificationStatus(user);
                const displayName = getUserDisplayName(user);
                const initials = user.email.substring(0, 2).toUpperCase();

                return (
                  <tr
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-slate-200 text-slate-700 text-xs font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-slate-900">{displayName}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={
                          user.role === 'ADMIN'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : user.role === 'EMPLOYER'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge
                        className={
                          status === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }
                      >
                        {status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Button size="sm" variant="ghost" className="h-7 text-xs px-2 text-indigo-600">
                        Inspect
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="h-5 w-5 text-emerald-600" />
              User Profile Account Info
            </DialogTitle>
            <DialogDescription>
              Detailed account information for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-2 text-sm">
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-slate-900 text-white font-bold">
                    {selectedUser.email.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-slate-900">{getUserDisplayName(selectedUser)}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {selectedUser.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{selectedUser.role}</Badge>
                    <Badge
                      className={
                        getVerificationStatus(selectedUser) === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }
                    >
                      {getVerificationStatus(selectedUser)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Role Specific Details */}
              {selectedUser.role === 'STUDENT' && selectedUser.student && (
                <div className="p-3 border border-slate-200 rounded-lg space-y-2">
                  <h4 className="font-semibold text-xs text-muted-foreground uppercase flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5 text-indigo-600" /> Student Profile Info
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Institution:</span>{' '}
                      <span className="font-medium">{selectedUser.student.university}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Discipline:</span>{' '}
                      <span className="font-medium">{selectedUser.student.discipline}</span>
                    </div>
                    {selectedUser.student.resumeUrl && (
                      <div className="col-span-2 mt-1">
                        <a
                          href={selectedUser.student.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:underline"
                        >
                          <FileText className="h-3.5 w-3.5" /> View Student Resume / Doc
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedUser.role === 'EMPLOYER' && selectedUser.employer && (
                <div className="p-3 border border-slate-200 rounded-lg space-y-2">
                  <h4 className="font-semibold text-xs text-muted-foreground uppercase flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-indigo-600" /> Company Profile Info
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Company:</span>{' '}
                      <span className="font-medium">{selectedUser.employer.companyName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">CAC Reg No:</span>{' '}
                      <span className="font-medium">{selectedUser.employer.cacNumber}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
