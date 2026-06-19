"use client";

import { useState, useEffect } from "react";
import Navbar from "../../public/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import Preloader from "../../public/components/Preloader";
import BlurText from "../../public/utility/BlurText";
import WhyTaxiSection from "../../public/components/WhyTaxiSection";
import ServicesSection from "../../public/components/ServicesSection";
import CurvedLoop from "../../public/components/CurvedLoop";
import VehiclesSection from "../../public/components/VehiclesSection";
import ContactSection from "../../public/components/ContactSection";
import Footer from "../../public/components/Footer";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const hasLoadedBefore = sessionStorage.getItem("hasLoadedBefore");
    if (hasLoadedBefore === "true") {
      setShowLoader(false);
      setShowContent(true);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const listener = () => setIsMobile(media.matches);
    setIsMobile(media.matches);
    if (media.addEventListener) {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    } else {
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, []);

  if (!isHydrated) {
    return <div className="min-h-screen bg-[#1DA58C]" />;
  }

  return (
    <>
      <link rel="preload" href="/images/hero/BG.webp" as="image" fetchPriority="high" />
      {showLoader && (
        <Preloader 
          onExitStart={() => {
            sessionStorage.setItem("hasLoadedBefore", "true");
            setShowContent(true);
          }} 
          onComplete={() => setShowLoader(false)} 
        />
      )}

      {showContent && (
        <main id="homepage" className="relative min-h-screen bg-[#1DA58C] overflow-hidden">
      {/* Navbar overlay */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full relative z-50"
      >
        <Navbar />
      </motion.div>

      {/* Hero Section Container */}
      <div className="relative w-full h-[95vh] min-h-[700px] max-h-[950px] overflow-hidden select-none bg-[#1DA58C]">
        {/* Layer 0: Background Image */}
        <img
          src="/images/hero/BG.webp"
          alt="Suvarnabhumi Airport Terminal BG"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-100"
          draggable={false}
        />

        {/* Layer 5: Gradient overlays */}
        {/* Top shadow for Navbar legibility */}
        <div className="absolute top-0 left-0 w-full h-[250px] bg-gradient-to-b from-black/50 to-transparent z-[5] pointer-events-none" />
        
        {/* Bottom gradient fade blending into the page color */}
        <div className="absolute bottom-0 left-0 w-full h-[400px] xl:h-[100px]: bg-gradient-to-t from-[#1DA58C] via-[#1DA58C]/50 to-transparent z-[40] pointer-events-none" />

        

        {/* Layer 20: Title and Subtitle positioned behind foreground objects */}
        <div className="absolute inset-0 flex flex-col justify-top mt-20 items-center text-center pointer-events-none px-4 md:mt-30 lg:mt-20">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-white font-semibold leading-none select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] flex flex-col z-30" 
          >
            <span className="text-[15vw] sm:text-[14vw] md:text-[12vw] lg:text-[9rem] xl:text-[9rem] 2xl:text-[11rem]">Taxi Saver</span>
            <span className="text-[15vw] sm:text-[14vw] md:text-[12vw] lg:text-[9rem] xl:text-[9rem] 2xl:text-[11rem] mt-[-10px] lg:mt-[-25px]">Thailand</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="text-white/95 text-base sm:text-lg lg:text-xl xl:text-2xl mt-4 font-semibold tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] z-40"
          >
            You can book service without deposit
          </motion.p>
        </div>

        {/* Layer 30: Foreground image elements with parallax entrance */}
        
        {/* Coconut tree (bottom left) */}
        <motion.img
          src="/images/hero/Coconut-tree.webp"
          alt="Coconut Tree"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className="absolute hidden sm:block  sm:bottom-0 sm:left-[-12%] sm:bottom-[50%] sm:h-[40%] md:block  md:h-[70%] md:left-[-23%] md:bottom-[10%] lg:h-[80%] lg:bottom-[-2%] lg:left-[-18%] xl:h-[90%] xl:left-[-5%] xl:bottom-[-8%] w-auto object-contain object-left-bottom z-30 pointer-events-none select-none "
        />

        <motion.img
          src="/images/hero/Coconut-tree.webp"
          alt="Coconut Tree"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
          className="absolute hidden sm:block sm:h-[40%] sm:left-[-12%] sm:bottom-[30%] md:h-[60%] md:block md:left-[-30%] md:bottom-[-10%] lg:h-[60%] lg:left-[-22%] lg:bottom-[-13%] xl:h-[60%] xl:left-[-10%] xl:bottom-[-10%] w-auto object-contain object-left-bottom z-30 pointer-events-none select-none"
        />

        {/* Airplane (top-left) */}
        <motion.img
          src="/images/hero/Air-plane.webp"
          alt="Airplane"
          initial={{ x: -140, y: -60, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="absolute  top-[6%] left-[-8%] md:top-[8%] md:left-[10%]  w-[14%] max-w-[150px] min-w-[90px] z-10 pointer-events-none select-none"
        />

        {/* Person with Luggage (bottom center-left) */}
        <motion.img
          src="/images/hero/Person-with-luggage.webp"
          alt="Person with Luggage"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
          className="absolute h-[50%] bottom-[15%] left-[-12%] sm:left-[16%] sm:bottom-[10%] md:left-[22%] md:bottom-[2%] lg:left-[30%] h-[38%] sm:h-[45%] md:h-[50%] lg:h-[54%] xl:bottom-[-17%] w-auto object-contain object-bottom z-[12] pointer-events-none select-none"
        />

        {/* SUV Car (bottom center-right) */}
        <motion.img
          src="/images/hero/SUV-car.webp"
          alt="SUV Car"
          initial={{ x: 500, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          className="absolute bottom-[26%] left-[20%] h-[100%] sm:h-[42%] sm:left-[45%] sm:bottom-[9%] md:left-[42%] lg:left-[42%] h-[20%] md:h-[40%] lg:h-[45%] xl:h-[45%] xl:left-[50%] xl:bottom-[-2%] w-auto object-contain object-bottom z-[10] pointer-events-none select-none"
        />

        {/* Layer 40: Call to Action buttons overlay */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
          className="absolute bottom-[20%] xl:bottom-[10%]  left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-4 z-40 w-full px-4"
        >
          <a
            href="/booking"
            className="relative overflow-hidden bg-[#3668FF] text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xl shadow-blue-600/30 border border-blue-400/30 group transition-all duration-300 hover:shadow-blue-500/50 hover:shadow-2xl active:scale-95"
          >
            {/* Shimmer effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            <span className="relative">Book a ride</span>
            <svg
              className="w-5 h-5 relative"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.446l-6.002-3.001a1.125 1.125 0 00-1.006-.002L3.89 19.467A1.125 1.125 0 012.25 18.44V6.752c0-.503.333-.94.817-1.068l5.485-1.446a1.125 1.125 0 011.006.002l6.002 3.001a1.125 1.125 0 001.006.002l5.093-1.341c.484-.128.817.309.817.812v11.688c0 .503-.333.94-.817 1.068l-5.485 1.446a1.125 1.125 0 01-1.006-.002z"
              />
            </svg>
          </a>

          <a
            href="#explore"
            className="relative overflow-hidden bg-white/95 text-gray-800 px-7 py-3.5 rounded-xl font-bold border border-white/20 backdrop-blur-sm group transition-all duration-300 hover:shadow-white/20 hover:shadow-2xl shadow-xl active:scale-95"
          >
            {/* Shimmer effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            <span className="relative">Explore more</span>
          </a>
        </motion.div>
      </div>

      {/* Section 2: Value Proposition */}
      <section id="explore" className="relative w-full bg-[#1DA58C] overflow-hidden">
        {/* Subtle grid texture overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />

        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16 pt-20 pb-12 sm:pb-16 md:pt-24 md:pb-20 lg:pt-28 lg:pb-[280px] xl:pb-[320px]">

          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            

            {/* Headline */}
            <BlurText
              text="Experience seamless, deposit-free booking with guaranteed safety on every trip."
              delay={50}
              animateBy="letters"
              direction="bottom"
              stepDuration={0.4}
              className="text-white font-medium leading-[1.1] text-[2.6rem] sm:text-[3.2rem] md:text-[3.6rem] lg:text-[4.4rem] xl:text-[4.8rem]"
            />

            
          </motion.div>

          {/* Right: Car image */}
          <motion.div
            key={isMobile ? "mobile-car" : "desktop-car"}
            initial={{ opacity: 1, x: isMobile ? 80 : 600 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: isMobile ? "-40px" : "-80px" }}
            transition={{ duration: isMobile ? 2.5 : 6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-fit z-20 flex justify-center px-4 mt-12 lg:absolute lg:left-0 lg:right-0 lg:bottom-20 lg:mt-0"
          >
            {/* Glow / shadow under car */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-[30px] bg-black/25 blur-2xl rounded-full pointer-events-none" />
            <img
              src="/images/section2/seden-car.png"
              alt="Sedan Car"
              className="relative w-full max-w-[520px] lg:max-w-[600px] xl:max-w-[680px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)] select-none pointer-events-none"
            />
          </motion.div>

        </div>

      </section>

      {/* Section 3: Why Taxi Saver? */}
      <WhyTaxiSection />

      <CurvedLoop 
        marqueeText="✦ Taxi Saver Thailand ✦ Safe & Reliable ✦ No Deposit Required ✦ Book Your Ride ✦ ✦ Taxi Saver Thailand ✦ Safe & Reliable ✦ No Deposit Required ✦ Book Your Ride ✦"
        speed={0.8}
        curveAmount={130}
        direction="left"
        interactive={true}
        className="text-white/10 font-black uppercase tracking-wider"
        containerClassName="h-[120px] md:h-[160px] bg-[#1DA58C] flex items-center justify-center w-full overflow-hidden select-none pointer-events-none"
      />

      {/* Section 4: Our Services */}
      <ServicesSection />

      {/* Section 5: Vehicles Type */}
      <VehiclesSection />

      {/* Section 6: Contact */}
      <ContactSection />

      {/* Footer */}
      <Footer />
        </main>
      )}
    </>
  );
}

