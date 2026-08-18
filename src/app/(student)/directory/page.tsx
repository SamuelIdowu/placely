'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { getCompanyAvatarColor } from '@/lib/tokens';
import {
  Building2,
  Search,
  MapPin,
  Briefcase,
  Send,
  ExternalLink,
  PlusCircle,
  GraduationCap,
  Sparkles,
  Loader2,
  Banknote,
  Clock,
  ArrowRight,
  SearchX,
} from 'lucide-react';

interface CompanyItem {
  id: string;
  name: string;
  industry: string;
  location: string;
  address?: string | null;
  contactEmail?: string | null;
  phone?: string | null;
  websiteUrl?: string | null;
  isUniversityApproved: boolean;
  approvedByUniversity?: string | null;
}

// Initial Nigerian IT-approved company seed database for instant Day-1 utility
const SEED_COMPANIES: CompanyItem[] = [
  {
    id: 'seed-1',
    name: 'Andela Nigeria',
    industry: 'Software & Technology',
    location: 'Lagos (Hybrid/Remote)',
    contactEmail: 'talent@andela.com',
    websiteUrl: 'https://andela.com',
    isUniversityApproved: true,
    approvedByUniversity: 'UNILAG IT Unit',
  },
  {
    id: 'seed-2',
    name: 'Julius Berger Nigeria Plc',
    industry: 'Civil & Structural Engineering',
    location: 'Abuja & Lagos',
    contactEmail: 'recruitment@julius-berger.com',
    websiteUrl: 'https://julius-berger.com',
    isUniversityApproved: true,
    approvedByUniversity: 'FUTA IT Office',
  },
  {
    id: 'seed-3',
    name: 'Flutterwave',
    industry: 'Fintech & Software Engineering',
    location: 'Lagos, Nigeria',
    contactEmail: 'careers@flutterwavego.com',
    websiteUrl: 'https://flutterwave.com',
    isUniversityApproved: true,
    approvedByUniversity: 'UI SIWES Directorate',
  },
  {
    id: 'seed-4',
    name: 'Dangote Industries Limited',
    industry: 'Mechanical & Chemical Engineering',
    location: 'Lagos (Lekki / Ikoyi)',
    contactEmail: 'careers@dangote.com',
    websiteUrl: 'https://dangote.com',
    isUniversityApproved: true,
    approvedByUniversity: 'OAU Industrial Training',
  },
  {
    id: 'seed-5',
    name: 'MTN Nigeria Communications Plc',
    industry: 'Telecommunications & Networks',
    location: 'Lagos & Regional Hubs',
    contactEmail: 'internships@mtn.ng',
    websiteUrl: 'https://mtn.ng',
    isUniversityApproved: true,
    approvedByUniversity: 'UNIBEN IT Office',
  },
  {
    id: 'seed-6',
    name: 'Chevron Nigeria Limited',
    industry: 'Petroleum & Energy Engineering',
    location: 'Lagos (Lekki) & Warri',
    contactEmail: 'hrnigeria@chevron.com',
    websiteUrl: 'https://chevron.com',
    isUniversityApproved: true,
    approvedByUniversity: 'UNILAG IT Unit',
  },
  {
    id: 'seed-7',
    name: 'Paystack (Stripe)',
    industry: 'Software & Infrastructure',
    location: 'Lagos (Ikeja)',
    contactEmail: 'jobs@paystack.com',
    websiteUrl: 'https://paystack.com',
    isUniversityApproved: true,
    approvedByUniversity: 'Covenant University SIWES',
  },
  {
    id: 'seed-8',
    name: 'NLNG (Nigeria LNG Limited)',
    industry: 'Chemical & Process Engineering',
    location: 'Bonny Island & Port Harcourt',
    contactEmail: 'careers@nlng.com',
    websiteUrl: 'https://nlng.com',
    isUniversityApproved: true,
    approvedByUniversity: 'FUTA IT Office',
  },
];

export default function StudentDirectoryPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<CompanyItem[]>(SEED_COMPANIES);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('ALL');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');

  useEffect(() => {
    fetchDirectory();
  }, [selectedUniversity, selectedIndustry, selectedLocation]);

  const fetchDirectory = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedUniversity !== 'ALL') params.set('university', selectedUniversity);
      if (selectedIndustry !== 'ALL') params.set('industry', selectedIndustry);
      if (selectedLocation !== 'ALL') params.set('location', selectedLocation);
      if (searchTerm) params.set('search', searchTerm);

      const res = await fetch(`/api/directory?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.companies && data.companies.length > 0) {
          setCompanies(data.companies);
        } else if (!searchTerm && selectedUniversity === 'ALL' && selectedIndustry === 'ALL') {
          setCompanies(SEED_COMPANIES);
        } else {
          setCompanies([]);
        }
      }
    } catch {
      setCompanies(SEED_COMPANIES);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDirectory();
  };

  const handleNavigateOutreach = (company: { name: string; email?: string | null; location?: string | null }) => {
    const params = new URLSearchParams();
    if (company.name) params.set('company', company.name);
    if (company.email) params.set('email', company.email);
    if (company.location) params.set('location', company.location);
    router.push(`/outreach?${params.toString()}`);
  };

  const filteredCompanies = companies.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.industry.toLowerCase().includes(term) ||
      c.location.toLowerCase().includes(term) ||
      (c.approvedByUniversity && c.approvedByUniversity.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-5 pb-10">
      {/* ── 1. Header Band ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Institutional Training Network
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles className="w-2.5 h-2.5" /> 100% ITF Approved
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-slate-900 mt-1">
            IT-Approved Employer Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verified Nigerian companies historically approved by University IT Departments for 3-month and 6-month SIWES attachments.
          </p>
        </div>
      </div>

      {/* ── 2. Bento Hero: Custom Outreach Callout ── */}
      <div className="rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 bg-surface-dark shadow-2xs">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-indigo text-white">
              <PlusCircle className="w-3 h-3" /> Direct Outreach
            </span>
            <h2 className="font-serif text-lg sm:text-xl font-normal tracking-tight text-white">
              Applying to an unlisted Nigerian company?
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-medium text-surface-dark-muted leading-relaxed">
            Open the SIWES Letter Studio to format, edit with rich WYSIWYG tools, and dispatch your verified placement letter directly to HR.
          </p>
        </div>

        <Button
          onClick={() => handleNavigateOutreach({ name: '', email: null, location: null })}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white transition-all shrink-0 bg-brand-indigo hover:bg-brand-indigo-hover rounded-full w-full sm:w-auto shadow-xs active:scale-95 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          Open Letter Studio
        </Button>
      </div>

      {/* ── 3. Search & Filter Controls ── */}
      <div className="bg-white rounded-[20px] p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3.5">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search companies by name, technology, or sector (e.g. Flutterwave, Julius Berger, Lagos)..."
              className="pl-10 h-10 text-xs sm:text-sm bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
            />
          </div>
          <Button
            type="submit"
            className="h-10 px-6 bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-semibold rounded-full shadow-xs shrink-0 cursor-pointer"
          >
            Search Directory
          </Button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-100">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
              University IT Endorsement
            </label>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="w-full h-9 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 focus:outline-none focus:border-brand-indigo"
            >
              <option value="ALL">All Universities (Nationwide)</option>
              <option value="UNILAG">UNILAG Approved</option>
              <option value="FUTA">FUTA Approved</option>
              <option value="UI">UI Approved</option>
              <option value="OAU">OAU Approved</option>
              <option value="UNIBEN">UNIBEN Approved</option>
              <option value="Covenant">Covenant Approved</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
              Industry Sector
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full h-9 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 focus:outline-none focus:border-brand-indigo"
            >
              <option value="ALL">All Engineering & Tech Sectors</option>
              <option value="Software">Software & IT</option>
              <option value="Civil">Civil & Construction</option>
              <option value="Energy">Energy / Oil & Gas</option>
              <option value="Telecommunications">Telecommunications</option>
              <option value="Manufacturing">Manufacturing & FMCG</option>
              <option value="Fintech">Banking & Fintech</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
              Location Hub
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full h-9 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 focus:outline-none focus:border-brand-indigo"
            >
              <option value="ALL">All Locations (Nigeria)</option>
              <option value="Lagos">Lagos State</option>
              <option value="Abuja">Abuja (FCT)</option>
              <option value="Port Harcourt">Port Harcourt / Rivers</option>
              <option value="Ibadan">Ibadan / Oyo</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 4. Results Count Strip ── */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>
          Showing <span className="font-bold text-slate-900">{filteredCompanies.length}</span> approved {filteredCompanies.length === 1 ? 'organization' : 'organizations'}
        </span>
        {(selectedUniversity !== 'ALL' || selectedIndustry !== 'ALL' || selectedLocation !== 'ALL' || searchTerm) && (
          <span className="text-brand-indigo font-semibold bg-brand-indigo-light px-2.5 py-0.5 rounded-full border border-indigo-100">
            Filtered directory
          </span>
        )}
      </div>

      {/* ── 5. Directory Grid ── */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-indigo" />
          <p className="text-xs font-medium">Filtering approved employer directory...</p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-12 px-6 bg-white text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-brand-indigo-light flex items-center justify-center text-brand-indigo mx-auto">
            <SearchX className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No companies found matching your active filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You can still draft, edit, and dispatch an official SIWES application letter to any company in Nigeria.
            </p>
          </div>
          <div className="pt-2">
            <Button
              onClick={() => handleNavigateOutreach({ name: searchTerm || '', email: null, location: null })}
              className="bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-semibold rounded-full px-5 py-2.5 gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Draft Letter for {searchTerm || 'Target Company'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCompanies.map((company) => {
            const avatarColor = getCompanyAvatarColor(company.name);
            const initials = company.name.charAt(0).toUpperCase();

            return (
              <div
                key={company.id}
                className="bg-white rounded-[20px] p-5 border border-border hover:border-brand-indigo transition-all hover:shadow-xs flex flex-col justify-between group h-full shadow-2xs"
              >
                <div className="space-y-3.5">
                  {/* Top Row: Avatar, Name, Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
                        style={{ background: avatarColor }}
                      >
                        {initials}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{company.name}</span>
                          {company.isUniversityApproved && <VerificationBadge size="sm" />}
                        </div>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {company.location}
                        </span>
                      </div>
                    </div>

                    {company.approvedByUniversity && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-indigo-light text-brand-indigo border border-indigo-100 shrink-0">
                        <GraduationCap className="w-3 h-3" />
                        {company.approvedByUniversity}
                      </span>
                    )}
                  </div>

                  {/* Industry & Highlights */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span>{company.industry}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        ITF SIWES Eligible
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 ml-auto">
                        <Banknote className="w-2.5 h-2.5" />
                        ₦65k–₦85k/mo
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer CTA Band */}
                <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  {company.websiteUrl ? (
                    <a
                      href={company.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-brand-indigo transition-colors"
                    >
                      Website <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> 6 Mo SIWES
                    </span>
                  )}

                  <Button
                    size="sm"
                    onClick={() =>
                      handleNavigateOutreach({
                        name: company.name,
                        email: company.contactEmail,
                        location: company.location,
                      })
                    }
                    className="bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-semibold rounded-full px-4 h-8 gap-1.5 shadow-xs active:scale-95 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    Draft &amp; Send Letter
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
