import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] text-black px-6 py-12 text-center font-sans border-t-4 border-black">
      <div className="max-w-md space-y-6">
        <div className="inline-block text-xs font-bold uppercase tracking-widest bg-black text-white px-3 py-1 font-mono">
          404 Error — Page Not Found
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-normal tracking-tight text-slate-900 leading-tight">
          Lost in Placement?
        </h1>

        <p className="text-sm md:text-base text-slate-600 font-sans leading-relaxed">
          The page or SIWES placement listing you are looking for might have been moved, closed, or doesn&apos;t exist.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-6 bg-landing-primary text-white hover:bg-landing-primary-hover font-sans text-xs tracking-wider uppercase font-bold border border-black transition-colors"
          >
            Go Home
          </Link>

          <Link
            href="/listings"
            className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-6 bg-transparent text-black border border-black hover:bg-black hover:text-white font-sans text-xs tracking-wider uppercase font-bold transition-colors"
          >
            Browse Listings
          </Link>
        </div>
      </div>
    </main>
  );
}
