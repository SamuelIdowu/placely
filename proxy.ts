// middleware.ts (root level)
// Route protection for Placely.
//
// CORRECTION vs. setup guide:
// The guide checks pathname.startsWith('/(student)') but Next.js strips route
// group parentheses from the URL. The actual paths are /dashboard, /listings, etc.
// We protect routes by their REAL URL segments, mapped to required roles.
//
// Protected route map:
//   /dashboard, /profile, /listings/*, /applications/* → STUDENT
//   /employer/*, /employer/dashboard, etc.             → EMPLOYER
//   /admin/*                                           → ADMIN

import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Routes requiring a specific role
const STUDENT_ROUTES = ['/dashboard', '/profile', '/listings', '/applications'];
const EMPLOYER_ROUTES = ['/employer'];
const ADMIN_ROUTES = ['/admin'];

export default auth((req: any) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;
  const isAuthenticated = !!req.auth;

  // ── Student routes ────────────────────────────────────────────────────────
  const isStudentRoute = STUDENT_ROUTES.some((r: any) => pathname.startsWith(r));
  if (isStudentRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    if (role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  // ── Employer routes ───────────────────────────────────────────────────────
  const isEmployerRoute = EMPLOYER_ROUTES.some((r: any) => pathname.startsWith(r));
  if (isEmployerRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    if (role !== 'EMPLOYER') {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  // ── Admin routes ──────────────────────────────────────────────────────────
  const isAdminRoute = ADMIN_ROUTES.some((r: any) => pathname.startsWith(r));
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  // Run middleware on all routes except Next.js internals and static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
