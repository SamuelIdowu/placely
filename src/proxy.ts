// src/proxy.ts
// Next.js 16 proxy file convention for authentication and role-based access control.

import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const path = nextUrl.pathname;

  const isStudentRoute = path === '/dashboard' || path.startsWith('/profile') || path.startsWith('/applications');
  const isEmployerRoute = path.startsWith('/employer');
  const isAdminRoute = path.startsWith('/admin');
  const isAuthRoute = path.startsWith('/sign-in') || path.startsWith('/sign-up');

  // 1. Unauthenticated users trying to access protected routes
  if (!isLoggedIn && (isStudentRoute || isEmployerRoute || isAdminRoute)) {
    const signInUrl = new URL('/sign-in', nextUrl.origin);
    signInUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(signInUrl);
  }

  // 2. Authenticated users trying to access auth pages (sign-in / sign-up)
  if (isLoggedIn && isAuthRoute) {
    if (userRole === 'STUDENT') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl.origin));
    }
    if (userRole === 'EMPLOYER') {
      return NextResponse.redirect(new URL('/employer/dashboard', nextUrl.origin));
    }
    if (userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', nextUrl.origin));
    }
  }

  // 3. Authenticated users trying to access routes meant for another role
  if (isLoggedIn) {
    if (isStudentRoute && userRole !== 'STUDENT') {
      const target = userRole === 'EMPLOYER' ? '/employer/dashboard' : '/admin/dashboard';
      return NextResponse.redirect(new URL(target, nextUrl.origin));
    }

    if (isEmployerRoute && userRole !== 'EMPLOYER') {
      const target = userRole === 'STUDENT' ? '/dashboard' : '/admin/dashboard';
      return NextResponse.redirect(new URL(target, nextUrl.origin));
    }

    if (isAdminRoute && userRole !== 'ADMIN') {
      const target = userRole === 'STUDENT' ? '/dashboard' : '/employer/dashboard';
      return NextResponse.redirect(new URL(target, nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
