'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SiwesOutreachModal } from '@/components/student/siwes-outreach-modal';
import {
  Building2,
  Search,
  MapPin,
  Briefcase,
  ShieldCheck,
  Send,
  ExternalLink,
  PlusCircle,
  GraduationCap,
  Sparkles,
  Loader2,
  Filter,
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
  const [companies, setCompanies] = useState<CompanyItem[]>(SEED_COMPANIES);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('ALL');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCompany, setActiveCompany] = useState<{
    name: string;
    email?: string | null;
    location?: string | null;
  }>({ name: '', email: null, location: null });

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

  const handleOpenOutreach = (company: { name: string; email?: string | null; location?: string | null }) => {
    setActiveCompany(company);
    setIsModalOpen(true);
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
    <div className="space-y-8 pb-12">
      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-zinc-900 p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Zero Cold-Start • Guaranteed SIWES Supply
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
            IT-Approved Employer Directory
          </h1>
          <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed">
            Browse hundreds of Nigerian companies historically approved by University IT Departments for 3-month and 6-month SIWES attachments. Generate formal application letters and dispatch verified placement requests in seconds.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Button
              onClick={() => handleOpenOutreach({ name: '', email: null, location: null })}
              className="bg-blue-500 hover:bg-blue-400 text-white font-semibold gap-2 shadow-lg active:scale-95"
            >
              <Send className="w-4 h-4" />
              Apply to Any Unlisted Company
            </Button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search companies by name, technology, or keywords (e.g. Flutterwave, Civil, Lagos)..."
              className="pl-10 h-11 text-sm bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <Button type="submit" className="h-11 px-6 bg-brand-indigo hover:bg-brand-indigo-hover text-white font-semibold">
            Search
          </Button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">University IT Approval</label>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="w-full h-9.5 px-3 border rounded-lg text-xs bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
            >
              <option value="ALL">All University Lists</option>
              <option value="UNILAG">UNILAG Approved</option>
              <option value="FUTA">FUTA Approved</option>
              <option value="UI">UI Approved</option>
              <option value="OAU">OAU Approved</option>
              <option value="UNIBEN">UNIBEN Approved</option>
              <option value="Covenant">Covenant Approved</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Industry Sector</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full h-9.5 px-3 border rounded-lg text-xs bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
            >
              <option value="ALL">All Industries</option>
              <option value="Software">Software & IT</option>
              <option value="Civil">Civil & Construction</option>
              <option value="Energy">Energy / Oil & Gas</option>
              <option value="Telecommunications">Telecommunications</option>
              <option value="Manufacturing">Manufacturing & FMCG</option>
              <option value="Fintech">Banking & Fintech</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Location Hub</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full h-9.5 px-3 border rounded-lg text-xs bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
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

      {/* ── Directory Grid ── */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-zinc-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm">Filtering approved employer directory...</p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-12 text-center space-y-4">
          <Building2 className="w-12 h-12 text-zinc-400 mx-auto" />
          <h3 className="text-lg font-bold">No companies found matching your filter</h3>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            You can still apply to any specific company by email using our SIWES outreach generator.
          </p>
          <Button
            onClick={() => handleOpenOutreach({ name: searchTerm || '', email: null, location: null })}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Send className="w-4 h-4" /> Send Application to {searchTerm || 'Custom Company'}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredCompanies.map((company) => (
            <Card
              key={company.id}
              className="hover:border-blue-500/50 hover:shadow-md transition-all duration-200 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">
                        {company.name}
                      </h3>
                      {company.isUniversityApproved && (
                        <span title="Verified SIWES Employer" className="text-blue-600">
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{company.industry}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{company.location}</span>
                    </div>
                  </div>

                  {company.approvedByUniversity && (
                    <Badge variant="outline" className="bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 text-[10px] whitespace-nowrap shrink-0">
                      <GraduationCap className="w-3 h-3 mr-1" />
                      {company.approvedByUniversity}
                    </Badge>
                  )}
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between gap-3">
                  {company.websiteUrl ? (
                    <a
                      href={company.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-zinc-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                    >
                      Website <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-zinc-400">Directory Listed</span>
                  )}

                  <Button
                    size="sm"
                    onClick={() =>
                      handleOpenOutreach({
                        name: company.name,
                        email: company.contactEmail,
                        location: company.location,
                      })
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 h-8.5 px-3.5 shadow-xs active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send SIWES Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Bottom Callout: Student-Led Outreach ── */}
      <div className="bg-gradient-to-r from-zinc-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-zinc-800 shadow-lg">
        <div className="space-y-1.5 text-center sm:text-left">
          <h3 className="text-lg font-bold flex items-center justify-center sm:justify-start gap-2">
            <PlusCircle className="w-5 h-5 text-blue-400" />
            Want to apply to a specific Nigerian company?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
            You don't have to wait for an opening to be posted. Enter the company name and HR email to auto-generate and dispatch a standardized SIWES application.
          </p>
        </div>

        <Button
          onClick={() => handleOpenOutreach({ name: '', email: null, location: null })}
          className="bg-white text-zinc-950 hover:bg-zinc-100 font-bold px-6 h-11 shrink-0 active:scale-95"
        >
          Generate Custom Application
        </Button>
      </div>

      {/* ── SIWES Outreach Modal ── */}
      <SiwesOutreachModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetCompany={activeCompany.name}
        targetEmail={activeCompany.email}
        targetLocation={activeCompany.location}
      />
    </div>
  );
}
