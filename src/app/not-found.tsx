import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#1DA58C] text-white px-6 text-center select-none font-sans">
      <div className="max-w-md space-y-6">
        <h1 className="text-8xl font-black tracking-widest text-white/35">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Page Not Found</h2>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed">
            Oops! The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-white hover:bg-slate-900 text-black hover:text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg active:scale-95"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}
