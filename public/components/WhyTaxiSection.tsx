"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BlurText from "../utility/BlurText";

const slides = [
  { src: "/images/section3/slide1.png", alt: "Passenger at airport pickup" },
  { src: "/images/section3/slide2.png", alt: "Professional taxi driver" },
  { src: "/images/section3/slide3.png", alt: "Clean taxi interior" },
];

const tabs = [
  {
    id: 0,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    label: "Certified Safety",
    color: "#3668FF",
    heading: "Certified Safety",
    bullets: [
      { bold: "Professional Drivers:", text: "Fully vetted and experienced chauffeurs you can trust." },
      { bold: "Well-Maintained Fleet:", text: "Every vehicle undergoes regular safety checks for a smooth, worry-free ride." },
    ],
  },
  {
    id: 1,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    label: "Care & Comfort",
    color: "#E8445A",
    heading: "Care & Comfort",
    bullets: [
      { bold: "Passenger First:", text: "Comfortable, air-conditioned vehicles designed for a relaxing journey." },
      { bold: "No Hidden Fees:", text: "Transparent pricing with no surprises — what you see is what you pay." },
    ],
  },
  {
    id: 2,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    label: "Always On Time",
    color: "#F5A623",
    heading: "Always On Time",
    bullets: [
      { bold: "Real-Time Tracking:", text: "Monitor your driver's arrival with live GPS updates in the app." },
      { bold: "Punctual Guaranteed:", text: "We prioritise your schedule so you never miss a flight or meeting." },
    ],
  },
  {
    id: 3,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M5 8l6 6" />
        <path d="M4 14l6-6 2-3" />
        <path d="M2 5h12" />
        <path d="M7 2h1" />
        <path d="M22 22l-5-10-5 10" />
        <path d="M14 18h6" />
      </svg>
    ),
    label: "Multilingual",
    color: "#1DA58C",
    heading: "Multilingual Support",
    bullets: [
      { bold: "Global Travellers Welcome:", text: "Our drivers and support team speak English, Thai, Chinese and more." },
      { bold: "Seamless Communication:", text: "Book and communicate effortlessly in your preferred language." },
    ],
  },
];

export default function WhyTaxiSection() {
  const [current, setCurrent] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const tab = tabs[activeTab];

  return (
    <section id="why" className="relative w-full bg-[#1DA58C] overflow-hidden">
      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16 py-16 md:py-20 xl:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            Why Taxi Saver ?
          </h2>
          <div className="flex flex-wrap text-base sm:text-lg mt-1 gap-x-1.5">
            <BlurText
              text="Because Better Rides Mean"
              delay={50}
              animateBy="letters"
              direction="bottom"
              className="text-white/80"
            />
            <BlurText
              text="Bigger Savings."
              delay={50}
              animateBy="words"
              direction="bottom"
              className="font-bold text-white"
            />
          </div>
          <div className="mt-5 h-px bg-white/20 w-full" />
        </motion.div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
          {/* LEFT: Image Carousel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:w-[45%] xl:w-[42%] flex-shrink-0"
          >
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-black/30">
              {/* Slides */}
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.img
                  key={current}
                  src={slides[current].src}
                  alt={slides[current].alt}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

              {/* Next arrow */}
              <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                aria-label="Next slide"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                </svg>
              </button>

              {/* Prev arrow */}
              <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                aria-label="Previous slide"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === current ? "bg-white scale-110" : "bg-white/40"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Feature Tabs Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Tab icons row */}
            <div className="flex border-b border-gray-100">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex-1 flex items-center justify-center py-4 px-3 transition-all duration-200 relative ${
                    activeTab === t.id ? "text-white" : "text-gray-400 hover:text-gray-600"
                  }`}
                  style={{ backgroundColor: activeTab === t.id ? t.color : "transparent" }}
                  aria-label={t.label}
                >
                  {t.icon}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 p-7 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <h3
                    className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5"
                    style={{ color: tab.color }}
                  >
                    {tab.heading}
                  </h3>
                  <ul className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
                    {tab.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: tab.color }}
                        />
                        <span>
                          <span className="font-bold" style={{ color: "#1a1a1a" }}>{b.bold} </span>
                          {b.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
