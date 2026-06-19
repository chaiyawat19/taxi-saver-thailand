"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CountUp from "./Countup";

interface PreloaderProps {
  onExitStart: () => void;
  onComplete: () => void;
}

export default function Preloader({ onExitStart, onComplete }: PreloaderProps) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [countFinished, setCountFinished] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const imagesToPreload = [
      "/images/hero/BG.png",
      "/images/hero/Coconut-tree.png",
      "/images/hero/Air-plane.png",
      "/images/hero/Person-with-luggage.png",
      "/images/hero/SUV-car.png",
      "/images/section2/seden-car.png",
      "/images/vehicle-type/seden.png",
      "/images/vehicle-type/suv.png",
      "/images/vehicle-type/van.png",
      "/images/section3/slide1.png",
      "/images/section3/slide2.png",
      "/images/section3/slide3.png"
    ];

    let loadedCount = 0;
    const totalImages = imagesToPreload.length;

    const onLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        setImagesLoaded(true);
      }
    };

    const onError = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        setImagesLoaded(true);
      }
    };

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = onLoad;
      img.onerror = onError;
    });

    // Fallback safety timeout (max 6 seconds waiting for images)
    const safetyTimeout = setTimeout(() => {
      setImagesLoaded(true);
    }, 6000);

    return () => clearTimeout(safetyTimeout);
  }, []);

  useEffect(() => {
    if (countFinished && imagesLoaded) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        onExitStart();
      }, 150); // short wait to let "100" sink in
      return () => clearTimeout(timer);
    }
  }, [countFinished, imagesLoaded, onExitStart]);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={isExiting ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (isExiting) {
          onComplete();
        }
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1DA58C] text-white"
    >
      {/* Subtle grid background texture */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }}
      />
      
      {/* Soft gradient glow in the center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none" />

      <motion.div 
        animate={isExiting ? { opacity: 0, y: -30 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative flex flex-col items-center z-10"
      >
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xs sm:text-sm font-black uppercase tracking-[0.4em] text-white/70 mb-4"
        >
          Taxi Saver Thailand
        </motion.p>
        
        <div className="flex items-baseline justify-center select-none">
          <CountUp
            from={0}
            to={100}
            separator=","
            direction="up"
            duration={1.2}
            className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter tabular-nums drop-shadow-md"
            delay={0.1}
            onEnd={() => {
              setCountFinished(true);
            }}
          />
          <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white/50 ml-1 select-none">%</span>
        </div>

        {/* Minimalist animated progress line */}
        <div className="w-[180px] h-[3px] bg-white/20 rounded-full mt-8 overflow-hidden relative">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.1 }}
            className="h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
