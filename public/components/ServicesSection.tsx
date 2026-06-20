"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlareHover from "./GlareHover";

// ── Airport card slides ───────────────────────────────────────────────────────
const airportSlides = [
  { src: "/images/service-card/airport/airport.webp",   label: "Suvarnabhumi Airport" },
  { src: "/images/service-card/airport/don-mueang.webp", label: "Don Mueang Airport" },
];

// ── Upcountry card slides ─────────────────────────────────────────────────────
const upcountrySlides = [
  { src: "/images/service-card/upcountry/Bangkok.webp",  label: "Bangkok" },
  { src: "/images/service-card/upcountry/Pattaya.webp",  label: "Pattaya" },
  { src: "/images/service-card/upcountry/hua-hin.webp",  label: "Hua Hin" },
  { src: "/images/service-card/upcountry/rayong.webp",   label: "Rayong" },
];

// ── Reusable Carousel Card ────────────────────────────────────────────────────
interface ServiceCardProps {
  tag: string;
  title: string;
  slides: { src: string; label: string }[];
}

function ServiceCard({ tag, title, slides }: ServiceCardProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };
  const goNext = () => go((current + 1) % slides.length);
  const goPrev = () => go((current - 1 + slides.length) % slides.length);

  return (
    <GlareHover
      width="100%"
      height="100%"
      background="#fff"
      borderRadius="1rem"
      borderColor="transparent"
      glareColor="#ffffff"
      glareOpacity={0.25}
      className="flex-1 min-w-0 shadow-2xl flex flex-col group cursor-default!"
      style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}
    >
      {/* ── Header area ── */}
      <div 
        className="px-6 pt-5 pb-4 bg-white group-hover:bg-[#3668FF] transition-colors duration-300 ease-out" 
      >
        <p 
          className="text-xs font-semibold uppercase tracking-widest mb-1 text-[#1a1a1a]/60 group-hover:text-white/75 transition-colors duration-300 ease-out" 
        >
          {tag}
        </p>
        <h3 
          className="text-2xl sm:text-3xl min-h-[4rem] sm:min-h-[5rem] font-bold leading-tight text-[#1a1a1a] group-hover:text-white transition-colors duration-300 ease-out" 
        >
          {title}
        </h3>
      </div>

      {/* ── Image carousel ── */}
      <div className="relative flex-1 aspect-[4/3] bg-black overflow-hidden">
        {/* Slides */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={{
              enter:  (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit:   (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 will-change-transform"
          >
            <img
              src={slides[current].src}
              alt={slides[current].label}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
            />
            {/* Bottom gradient + location label */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
            <span className="absolute bottom-12 right-4 text-white/90 text-sm font-semibold drop-shadow-md">
              {slides[current].label}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Prev arrow */}
        {slides.length > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200"
            aria-label="Previous"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* Next arrow */}
        {slides.length > 1 && (
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200"
            aria-label="Next"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current
                  ? "bg-[#3668FF] w-5 h-2.5"
                  : "bg-white/40 w-2.5 h-2.5 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </GlareHover>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function ServicesSection() {
  return (
    <section id="services" className="relative w-full bg-[#1DA58C] overflow-hidden">
      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16 py-16 md:py-20 xl:py-24">

        {/* ── Section header ── */}
        <div className="mb-10">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-4">
            Our Services
          </h2>
          <div className="border-l-4 border-white/50 pl-4 max-w-md">
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Experience safe, high-quality, and cost-effective transport with our
              specialized transfer services. From reliable airport pickups at BKK and
              DMK to seamless city-to-city rides between Bangkok, Pattaya, Rayong,
              and Hua Hin, We deliver reliable comfort at a price that makes sense.
            </p>
          </div>
        </div>

        {/* ── Two service cards ── */}
        <div className="flex flex-col md:flex-row gap-5 lg:gap-6">
          {/* Airport card */}
          <div className="flex-1 min-w-0">
            <ServiceCard
              tag="Airport Transfers"
              title="Airport Pickups & Drop-offs"
              slides={airportSlides}
            />
          </div>

          {/* Upcountry / intercity card */}
          <div className="flex-1 min-w-0">
            <ServiceCard
              tag="City-to-City Transfers"
              title="Intercity Rides"
              slides={upcountrySlides}
            />
          </div>
        </div>

        {/* ── Footnote ── */}
        <p className="mt-6 text-white/60 text-sm">
          Please note: Pricing varies based on Fleet Type and distance.
        </p>

      </div>
    </section>
  );
}
