"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Vehicle data ──────────────────────────────────────────────────────────────
const vehicles = [
  {
    id: "sedan",
    name: "Sedan",
    capacity: "1 – 3 Passengers",
    description: "Solo travelers, couples, or small groups with light luggage.",
    image: "/images/vehicle-type/seden.png",
    scale: 1.0,
  },
  {
    id: "suv",
    name: "SUV",
    capacity: "1 – 3 Passengers",
    description: "Solo travelers, couples, or small groups with light luggage.",
    image: "/images/vehicle-type/suv.png",
    scale: .8,
  },
  {
    id: "van",
    name: "Van",
    capacity: "4 – 9 Passengers",
    description: "Larger groups or families with extra luggage and comfort needs.",
    image: "/images/vehicle-type/van.png",
    scale: 1.5,
  },
];

const wrap = (idx: number) => ((idx % vehicles.length) + vehicles.length) % vehicles.length;

export default function VehiclesSection() {
  const [current, setCurrent] = useState(1); // start on SUV
  const [direction, setDirection] = useState(0);

  const go = (next: number) => {
    setDirection(next > current || (current === vehicles.length - 1 && next === 0) ? 1 : -1);
    setCurrent(wrap(next));
  };

  const goNext = () => go(wrap(current + 1));
  const goPrev = () => go(wrap(current - 1));

  const prev = vehicles[wrap(current - 1)];
  const curr = vehicles[current];
  const next = vehicles[wrap(current + 1)];

  const vehicleScale = curr.scale ?? 1.0;
  const imageVariants = {
    enter: (d: number) => ({ x: d >= 0 ? 150 : -150, opacity: 0, scale: 0.82 * vehicleScale }),
    center: {
      x: 0,
      opacity: 1,
      scale: vehicleScale,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 14,
        mass: 0.9,
      }
    },
    exit: (d: number) => ({
      x: d >= 0 ? -150 : 150,
      opacity: 0,
      scale: 0.82 * vehicleScale,
      transition: {
        duration: 0.25,
        ease: "easeInOut" as const
      }
    }),
  };

  return (
    <section id="vehicles" className="relative w-full bg-[#1DA58C] overflow-hidden">
      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      {/* Radial glow behind centre car */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 52%, rgba(0,0,0,0.15) 0%, transparent 70%)" }}
      />
      <AnimatePresence>
        <motion.div
          key={curr.id}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 0.8, scale: 1 }}
          exit={{ opacity: 0, scale: 1.25 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 50% 50% at 50% 52%, rgba(255,255,255,0.16) 0%, transparent 65%)" }}
        />
      </AnimatePresence>

      <div className="relative max-w-[1400px] mx-auto px-0 py-16 md:py-20 xl:py-24">

        {/* ── Section title ── */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-8 md:mb-12 px-6"
        >
          Vehicles Type
        </motion.h2>

        {/* ── Carousel row ── */}
        <div className="relative flex items-center justify-center select-none" style={{ minHeight: "340px" }}>

          {/* ── LEFT peek (prev vehicle) ── */}
          <button
            onClick={goPrev}
            aria-label="Previous vehicle"
            className="absolute left-0 z-20 flex items-center h-full cursor-pointer group"
            style={{ width: "22%" }}
          >
            {/* Peeking car image */}
            <div className="relative w-full h-full flex items-center justify-end pr-2 overflow-hidden">
              <img
                src={prev.image}
                alt={prev.name}
                className="w-[90%] max-w-[280px] object-contain opacity-45 origin-right transition-all duration-300 group-hover:opacity-70 group-hover:translate-x-2"
                style={{ filter: "brightness(0.7)", transform: `scale(${(prev.scale ?? 1) * 0.75})` }}
              />
            </div>
            {/* Arrow circle */}
            <div className="absolute left-4 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/25 hover:bg-white/45 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 hover:scale-110 shadow-lg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 sm:w-6 sm:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
              </svg>
            </div>
          </button>

          {/* ── CENTRE: current vehicle ── */}
          <div className="relative z-10 flex items-center justify-center" style={{ width: "56%" }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={curr.id}
                src={curr.image}
                alt={curr.name}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                whileHover={{ y: -12, scale: vehicleScale * 1.04 }}
                className="w-full max-w-[520px] md:max-w-[600px] xl:max-w-[680px] object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.35)] cursor-pointer"
              />
            </AnimatePresence>
          </div>

          {/* ── RIGHT peek (next vehicle) ── */}
          <button
            onClick={goNext}
            aria-label="Next vehicle"
            className="absolute right-0 z-20 flex items-center h-full cursor-pointer group"
            style={{ width: "22%" }}
          >
            {/* Peeking car image */}
            <div className="relative w-full h-full flex items-center justify-start pl-2 overflow-hidden">
              <img
                src={next.image}
                alt={next.name}
                className="w-[90%] max-w-[280px] object-contain opacity-45 origin-left transition-all duration-300 group-hover:opacity-70 group-hover:-translate-x-2"
                style={{ filter: "brightness(0.7)", transform: `scale(${(next.scale ?? 1) * 0.75})` }}
              />
            </div>
            {/* Arrow circle */}
            <div className="absolute right-4 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/25 hover:bg-white/45 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 hover:scale-110 shadow-lg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 sm:w-6 sm:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </button>
        </div>

        {/* ── Vehicle info ── */}
        <div className="text-center mt-6 md:mt-8 px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={curr.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
            >
              <h3 className="text-white text-4xl sm:text-5xl font-bold mb-2">{curr.name}</h3>
              <p className="text-white/80 text-base sm:text-lg font-medium mb-1">{curr.capacity}</p>
              <p className="text-white/65 text-sm sm:text-base max-w-sm mx-auto">{curr.description}</p>
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2.5 mt-6">
            {vehicles.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to ${vehicles[i].name}`}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === current
                    ? "bg-white w-6 h-2.5"
                    : "bg-white/35 w-2.5 h-2.5 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mt-10 px-6"
        >
          <a
            href="/booking"
            className="inline-flex items-center gap-2.5 bg-white hover:bg-gray-50 text-[#1DA58C] font-bold px-8 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-xl text-base"
          >
            Book This Vehicle
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
