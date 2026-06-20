"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VehicleDetail {
  name: string;
  passengers: number;
  luggage: number;
  desc: string;
  color: string;
  image: string;
  features: string[];
}

export default function VehiclesSection() {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("suv");

  const vehicleDetails: Record<string, VehicleDetail> = {
    sedan: {
      name: "Sedan",
      passengers: 3,
      luggage: 2,
      desc: "Perfect for solo travellers, couples, or business trips. Comfortable, clean, and budget-friendly.",
      color: "from-blue-500 to-indigo-600",
      image: "/images/vehicle-type/sedan.webp",
      features: [
        "✦ Best for 1-3 passengers",
        "✦ Standard Air Conditioning",
        "✦ Fits 2 large luggage bags",
      ]
    },
    suv: {
      name: "SUV",
      passengers: 4,
      luggage: 4,
      desc: "Ideal for small families or passengers with extra luggage. Provides a commanding view and robust comfort.",
      color: "from-emerald-500 to-teal-600",
      image: "/images/vehicle-type/suv.webp",
      features: [
        "✦ Best for 3-4 passengers",
        "✦ Dual Zone Air Conditioning",
        "✦ Fits 4 large luggage bags",
      ]
    },
    van: {
      name: "VIP Van",
      passengers: 9,
      luggage: 5,
      desc: "Excellent for large groups, families, golf tours, or corporate travel. Spacious interior with premium VIP seating.",
      color: "from-purple-500 to-pink-600",
      image: "/images/vehicle-type/van.webp",
      features: [
        "✦ Best for 5-9 passengers",
        "✦ Fits 5-6 large luggage bags",
        "✦ Plenty of legroom & VIP seats",
        "✦ Recommended for group tours"
      ]
    }
  };

  return (
    <section id="fleet" className="relative w-full bg-[#1DA58C] overflow-hidden">
      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      {/* Radial glow behind center card */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 52%, rgba(0,0,0,0.1) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 py-16 md:py-20 xl:py-24 flex flex-col items-center gap-10 w-full">
        
        {/* Section title */}
        <div className="text-center w-full">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            Our Fleet
          </h2>
          <p className="text-white/80 text-sm max-w-sm mx-auto">
            Choose your preferred vehicle for a comfortable trip across Thailand.
          </p>
        </div>

        {/* Segmented Slicer / Switcher Control */}
        <div className="flex bg-black/25 backdrop-blur-md p-1 rounded-2xl border border-white/10 gap-1 select-none z-30">
          {Object.keys(vehicleDetails).map((key) => {
            const isSelected = selectedVehicle === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedVehicle(key)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-white text-slate-900 shadow-xl"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                {vehicleDetails[key].name}
              </button>
            );
          })}
        </div>

        {/* ── Split Layout: 60% Vehicle Image | 40% Details Panel ── */}
        <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch min-h-[460px]">
          
          {/* LEFT: Car Image Display */}
          <div className="lg:w-[60%] w-full h-[45vh] lg:h-auto min-h-[360px] border border-white/15 rounded-3xl bg-black/25 overflow-hidden relative select-none shadow-inner flex items-center justify-center p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedVehicle}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full flex items-center justify-center cursor-pointer group"
              >
                {/* Floating wrapper trigger */}
                <motion.div
                  className="relative w-full h-full flex items-center justify-center"
                  whileHover="hover"
                >
                  {/* Dynamic Shadow underneath the car */}
                  <motion.div 
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[75%] h-[30px] bg-black/40 blur-2xl rounded-full pointer-events-none origin-center"
                    variants={{
                      hover: {
                        scaleX: 0.8,
                        scaleY: 0.9,
                        opacity: 0.5,
                        y: 8,
                        transition: { duration: 0.4, ease: "easeOut" }
                      }
                    }}
                  />
                  
                  {/* Car Image with float lift & tilt */}
                  <motion.img
                    src={vehicleDetails[selectedVehicle].image}
                    alt={vehicleDetails[selectedVehicle].name}
                    className={`w-full h-auto object-contain z-10 pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition-all duration-300 ${
                      selectedVehicle === "van"
                        ? "max-w-[480px] sm:max-w-[550px] lg:max-w-[620px] scale-[1.18]"
                        : "max-w-[420px] sm:max-w-[480px] lg:max-w-[540px]"
                    }`}
                    variants={{
                      hover: {
                        y: -14,
                        scale: selectedVehicle === "van" ? 1.23 : 1.05,
                        rotate: selectedVehicle === "sedan" ? -1.5 : selectedVehicle === "suv" ? 1.5 : 1,
                        transition: { duration: 0.4, ease: "easeOut" }
                      }
                    }}
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: 40% Info Panel */}
          <div className="lg:w-[40%] w-full bg-[#3668FF] border border-white/10 rounded-3xl p-6 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedVehicle}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full justify-between"
              >
                <div>
                  <h3 className="text-2xl font-bold mt-2.5 mb-4 leading-tight">
                    {vehicleDetails[selectedVehicle].name}
                  </h3>

                  <p className="text-slate-200 text-sm leading-relaxed mb-6">
                    {vehicleDetails[selectedVehicle].desc}
                  </p>

                  {/* Passengers & Luggage Spec */}
                  <div className="flex items-center justify-around bg-white/5 border border-white/10 rounded-xl p-3 mb-6 text-center">
                    <div className="flex-1">
                      <p className="text-sm font-bold tracking-wider text-slate-200">Passengers</p>
                      <p className="text-base font-extrabold text-white mt-0.5">
                        {vehicleDetails[selectedVehicle].passengers} Max
                      </p>
                    </div>
                    <div className="border-l border-white/15 h-8 self-center" />
                    <div className="flex-1">
                      <p className="text-sm font-bold tracking-wider text-slate-200">Luggage</p>
                      <p className="text-base font-extrabold text-white mt-0.5">
                        {vehicleDetails[selectedVehicle].luggage} Bags
                      </p>
                    </div>
                  </div>

                  {/* Features Bullet List */}
                  <div className="space-y-2 mb-6 pl-1">
                    {vehicleDetails[selectedVehicle].features.map((feat, idx) => (
                      <p key={idx} className="text-slate-200 text-sm font-medium">
                        {feat}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 mt-auto">
                  <a
                    href="/booking"
                    className="w-full flex cursor-pointer items-center justify-center bg-white hover:bg-slate-900 text-black hover:text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Book This Vehicle
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
