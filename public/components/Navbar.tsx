"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Homepage", href: "/#homepage" },
    { label: "Services", href: "/#services" },
    { label: "Vehicles", href: "/#vehicles" },
    { label: "Contact", href: "/#contact" },
  ];

  const containerVariants: Variants = {
    open: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
    closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  };

  const linkVariants: Variants = {
    open: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    closed: { opacity: 0, y: -16, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <nav
      className={`navbar transition-all duration-500 ${
        scrolled
          ? "bg-black/50 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      {/* Main Navbar Row */}
      <div className="flex justify-between items-center w-full max-w-[1400px] mx-auto px-6 py-2 md:py-3">

        {/* Brand Logo */}
        <a
          href="/#homepage"
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1DA58C] to-[#12806d] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
            <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </div>
          <span className="text-white font-bold tracking-tight text-base md:text-lg leading-none">
            Taxi Saver<span className="text-[#4adebc] ml-0.5">.</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center flex-1">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-white/80 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium text-sm tracking-wide"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: CTA & Hamburger */}
        <div className="flex items-center gap-3">
          {/* Book now CTA */}
          <a
            href="/booking"
            className="relative overflow-hidden bg-[#3668FF] text-white px-4 py-2 md:px-5 md:py-2.5 rounded-xl font-semibold flex items-center gap-1.5 md:gap-2 text-xs md:text-sm shadow-lg shadow-blue-600/30 border border-blue-400/30 group transition-all duration-300 hover:shadow-blue-500/50 hover:shadow-xl"
          >
            {/* Shimmer effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            <span className="relative">Book now</span>
            <svg
              className="w-3.5 h-3.5 md:w-4 md:h-4 relative"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.446l-6.002-3.001a1.125 1.125 0 00-1.006-.002L3.89 19.467A1.125 1.125 0 012.25 18.44V6.752c0-.503.333-.94.817-1.068l5.485-1.446a1.125 1.125 0 011.006.002l6.002 3.001a1.125 1.125 0 001.006.002l5.093-1.341c.484-.128.817.309.817.812v11.688c0 .503-.333.94-.817 1.068l-5.485 1.446a1.125 1.125 0 01-1.006-.002z"
              />
            </svg>
          </a>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white focus:outline-none transition-all duration-200 active:scale-95"
            aria-label="Toggle menu"
          >
            <motion.div
              animate={isOpen ? "open" : "closed"}
              className="flex flex-col justify-center items-center w-5 h-4 gap-[5px]"
            >
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 9 },
                }}
                transition={{ duration: 0.3 }}
                className="w-5 h-0.5 bg-white rounded-full origin-center block"
              />
              <motion.span
                variants={{
                  closed: { opacity: 1, scaleX: 1 },
                  open: { opacity: 0, scaleX: 0 },
                }}
                transition={{ duration: 0.2 }}
                className="w-5 h-0.5 bg-white rounded-full block"
              />
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -9 },
                }}
                transition={{ duration: 0.3 }}
                className="w-5 h-0.5 bg-white rounded-full origin-center block"
              />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="w-full max-w-[1200px] mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute top-full left-0 w-full overflow-hidden z-40 bg-black/75 backdrop-blur-2xl border-b border-white/10"
          >
            <motion.ul
              variants={containerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex flex-col px-4 pb-6 pt-3"
            >
              {links.map((link, i) => (
                <motion.li key={link.label} variants={linkVariants}>
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between text-white/85 hover:text-white px-4 py-4 rounded-xl hover:bg-white/8 active:bg-white/15 transition-all duration-200 border-b border-white/8 last:border-0 group"
                  >
                    <span className="font-semibold text-base tracking-wide">{link.label}</span>
                    <svg
                      className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </a>
                </motion.li>
              ))}

              {/* Mobile CTA */}
              <motion.li variants={linkVariants} className="mt-4">
                <a
                  href="/booking"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-[#3668FF] hover:bg-[#2555e5] text-white py-3.5 rounded-xl font-bold text-base shadow-lg shadow-blue-600/30 active:scale-98 transition-all duration-200"
                >
                  Book a ride
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

