'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { saveEmployerProfile } from '../profile/actions';
import {
  Bell,
  Lock,
  Mail,
  User,
  Save,
  CheckCircle2,
  AlertCircle,
  Shield,
} from 'lucide-react';

interface EmployerSettingsFormProps {
  email: string;
  companyName: string;
}

export function EmployerSettingsForm({ email, companyName }: EmployerSettingsFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [notifications, setNotifications] = React.useState({
    newApplications: true,
    shortlistUpdates: true,
    offerUpdates: true,
    weeklyDigest: false,
  });

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Account Info */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
          <User className="w-4.5 h-4.5 text-brand-indigo" />
          <div>
            <h2 className="font-display text-sm font-semibold text-slate-900">Account Information</h2>
            <p className="text-xs text-slate-500">Your account details and sign-in credentials.</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Company Name</label>
              <div className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 font-medium text-slate-700">
                {companyName}
              </div>
              <p className="text-[10px] text-slate-400">Update via Company Profile page</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Email Address</label>
              <div className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 font-medium text-slate-700">
                {email}
              </div>
              <p className="text-[10px] text-slate-400">Contact support to change email</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
          <Bell className="w-4.5 h-4.5 text-brand-indigo" />
          <div>
            <h2 className="font-display text-sm font-semibold text-slate-900">Notification Preferences</h2>
            <p className="text-xs text-slate-500">Control when and how you receive notifications.</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { key: 'newApplications' as const, label: 'New Applications', desc: 'Get notified when a student applies to your listing' },
            { key: 'shortlistUpdates' as const, label: 'Shortlist Updates', desc: 'Updates when application statuses change' },
            { key: 'offerUpdates' as const, label: 'Offer Updates', desc: 'Notifications when offers are accepted or declined' },
            { key: 'weeklyDigest' as const, label: 'Weekly Digest', desc: 'Summary of activity across all your listings' },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors"
            >
              <div>
                <span className="text-xs font-semibold text-slate-900 block">{item.label}</span>
                <span className="text-[11px] text-slate-500">{item.desc}</span>
              </div>
              <button
                type="button"
                onClick={() => handleNotificationToggle(item.key)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  notifications[item.key] ? 'bg-brand-indigo' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    notifications[item.key] ? 'translate-x-4' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
          <Lock className="w-4.5 h-4.5 text-brand-indigo" />
          <div>
            <h2 className="font-display text-sm font-semibold text-slate-900">Security</h2>
            <p className="text-xs text-slate-500">Manage your password and account security.</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-xs font-semibold text-slate-900 block">Password</span>
                <span className="text-[11px] text-slate-500">Last changed: Unknown</span>
              </div>
            </div>
            <button
              type="button"
              className="text-xs font-bold text-brand-indigo hover:text-brand-indigo-hover transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-200/60 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-2.5 border-b border-rose-100">
          <AlertCircle className="w-4.5 h-4.5 text-rose-500" />
          <div>
            <h2 className="font-display text-sm font-semibold text-rose-900">Danger Zone</h2>
            <p className="text-xs text-rose-500">Irreversible actions affecting your account.</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-900 block">Deactivate Account</span>
            <span className="text-[11px] text-slate-500">Permanently remove your company account and data</span>
          </div>
          <button
            type="button"
            className="px-4 py-2 text-xs font-bold text-rose-600 border border-rose-200 rounded-full hover:bg-rose-50 transition-colors"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}
