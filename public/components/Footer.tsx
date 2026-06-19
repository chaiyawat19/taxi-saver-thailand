"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const links = [
  { label: "Home",      href: "/#homepage" },
  { label: "Services",  href: "/#services"  },
  { label: "Vehicles",  href: "/#vehicles"  },
  { label: "Book a Ride", href: "/booking"  },
];

// LINE icon SVG path
function LineIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.627.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSent(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative w-full bg-[#3668FF] overflow-hidden select-none">

      {/* Subtle dot texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      {/* Top divider line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/15" />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16">

        {/* ── CTA Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-14 pb-10 border-b border-white/15"
        >
          <div>
            <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-2">
              24/7 Advance Booking
            </p>
            <h2 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05]">
              Ready to Hit<br />the Road?
            </h2>
          </div>
          <a
            href="/booking"
            className="inline-flex items-center gap-2.5 bg-white hover:bg-gray-50 text-[#1DA58C] font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-xl text-base shrink-0 self-start md:self-auto"
          >
            Book Now
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </motion.div>

        {/* ── Three-column grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 py-12">

          {/* Col 1 — Brand + tagline + email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0 }}
            className="flex flex-col gap-5"
          >
            {/* Logo */}
            <a href="/#homepage" className="flex items-center gap-2.5 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors duration-200 shadow">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                </svg>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                Taxi Saver<span className="text-white/50">.</span>
              </span>
            </a>

            <p className="text-white/60 text-sm leading-relaxed max-w-[260px]">
              Affordable and reliable transport across Thailand. No deposit required. Trusted by thousands of travelers.
            </p>

            {/* Email subscribe */}
            <div>
              <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-2.5">
                Stay in touch
              </p>
              {sent ? (
                <p className="text-white/70 text-sm font-medium">✓ Thanks! We&apos;ll be in touch.</p>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-200 min-w-0"
                  />
                  <button
                    type="submit"
                    className="bg-white text-[#1DA58C] font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-all duration-200 shrink-0 hover:scale-[1.03] active:scale-[0.97]"
                  >
                    Send
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Col 2 — Navigation links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <p className="text-white/80 text-xs font-semibold uppercase tracking-widest">
              Navigation
            </p>
            <nav className="flex flex-col gap-2.5">
              {links.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white/65 hover:text-white text-sm font-medium transition-colors duration-200 w-fit hover:translate-x-0.5 transition-transform"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Col 3 — Contact + Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <p className="text-white/80 text-xs font-semibold uppercase tracking-widest">
              Contact Us
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="tel:+66812345678"
                className="flex items-center gap-2.5 text-white/65 hover:text-white text-sm transition-colors duration-200"
              >
                <PhoneIcon />
                +66 81 234 5678
              </a>
              <a
                href="mailto:hello@taxisaverthailand.com"
                className="flex items-center gap-2.5 text-white/65 hover:text-white text-sm transition-colors duration-200 break-all"
              >
                <MailIcon />
                hello@taxisaverthailand.com
              </a>
            </div>

            {/* Social icons */}
            <div className="mt-1">
              <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-3">
                Follow Us
              </p>
              <div className="flex gap-3">
                {/* LINE */}
                <a
                  href="https://line.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LINE"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                >
                  <LineIcon />
                </a>
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/15 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/35">
          <span>© {new Date().getFullYear()} Taxi Saver Thailand. All rights reserved.</span>
          <span>taxisaverthailand.com</span>
        </div>

      </div>
    </footer>
  );
}
