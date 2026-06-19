"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StickerPeel from "./StickerPeel";
import ScrollFloat from "./ScrollFloat";

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

  const [positions, setPositions] = useState(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) {
        return {
          sedan: { x: -50, y: -90 },
          suv: { x: 0, y: 70 },
          van: { x: 50, y: -20 }
        };
      } else if (window.innerWidth < 1024) {
        return {
          sedan: { x: -140, y: -90 },
          suv: { x: 0, y: 90 },
          van: { x: 140, y: -30 }
        };
      }
    }
    return {
      sedan: { x: -240, y: -70 },
      suv: { x: 0, y: 90 },
      van: { x: 240, y: -20 }
    };
  });

  const [widths, setWidths] = useState(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) {
        return { sedan: 200, suv: 200, van: 200 };
      }
    }
    return { sedan: 320, suv: 400, van: 300 };
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setPositions({
          sedan: { x: -50, y: -90 },
          suv: { x: 0, y: 70 },
          van: { x: 50, y: -20 }
        });
      } else if (window.innerWidth < 1024) {
        setPositions({
          sedan: { x: -140, y: -90 },
          suv: { x: 0, y: 90 },
          van: { x: 140, y: -30 }
        });
      } else {
        setPositions({
          sedan: { x: -240, y: -70 },
          suv: { x: 0, y: 90 },
          van: { x: 240, y: -20 }
        });
      }

      if (window.innerWidth < 768) {
        setWidths({ sedan: 200, suv: 200, van: 200 });
      } else {
        setWidths({ sedan: 300, suv: 300, van: 300 });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const vehicleDetails: Record<string, VehicleDetail> = {
    sedan: {
      name: "Sedan Cars",
      passengers: 3,
      luggage: 2,
      desc: "Perfect for solo travellers, couples, or business trips. Comfortable, clean, and budget-friendly.",
      color: "from-blue-500 to-indigo-600",
      image: "/images/vehicle-type/vehicle-bg/sedan-bg.png",
      features: [
        "✦ Best for 1-3 passengers",
        "✦ Standard Air Conditioning",
        "✦ Fits 2 large luggage bags",
      ]
    },
    suv: {
      name: "SUV Cars",
      passengers: 4,
      luggage: 4,
      desc: "Ideal for small families or passengers with extra luggage. Provides a commanding view and robust comfort.",
      color: "from-emerald-500 to-teal-600",
      image: "/images/vehicle-type/vehicle-bg/suv-bg.png",
      features: [
        "✦ Best for 3-4 passengers",
        "✦ Dual Zone Air Conditioning",
        "✦ Fits 4 large luggage bags",
      ]
    },
    van: {
      name: "VIP Van Cars",
      passengers: 9,
      luggage: 5,
      desc: "Excellent for large groups, families, golf tours, or corporate travel. Spacious interior with premium VIP seating.",
      color: "from-purple-500 to-pink-600",
      image: "/images/vehicle-type/vehicle-bg/van-bg.png",
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

      <div className="relative max-w-[1400px] mx-auto px-6 py-16 md:py-20 xl:py-24 flex flex-col items-center gap-12 w-full">
        
        {/* Section title */}
        <div className="text-center w-full">
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            stagger={0.03}
            textClassName="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
          >
            Our Fleet
          </ScrollFloat>
          <p className="text-white/80 text-sm max-w-sm mx-auto">
            Drag stickers around or click to view specs on the side panel.
          </p>
        </div>

        {/* ── Split Layout: 70% Draggable Area | 30% Details Panel ── */}
        <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch min-h-[500px]">
          
          {/* LEFT: 60% Draggable Area */}
          <div className="lg:w-[60%] w-full h-[55vh] min-h-[560px] border border-white/15 rounded-3xl bg-black/25 overflow-hidden relative select-none shadow-inner flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-white/5 font-extrabold uppercase tracking-widest text-xl">Drag & Arrange stickers</p>
            </div>

            <StickerPeel
              imageSrc="/images/vehicle-type/sedan.png"
              width={widths.sedan}
              rotate={-10}
              peelBackHoverPct={20}
              peelBackActivePct={10}
              shadowIntensity={0.5}
              lightingIntensity={0.5}
              initialPosition={positions.sedan}
              peelDirection={0}
              onClick={() => setSelectedVehicle("sedan")}
            />
            <StickerPeel
              imageSrc="/images/vehicle-type/suv.png"
              width={widths.suv}
              rotate={0}
              peelBackHoverPct={25}
              peelBackActivePct={15}
              shadowIntensity={0.5}
              lightingIntensity={0.5}
              initialPosition={positions.suv}
              peelDirection={0}
              onClick={() => setSelectedVehicle("suv")}
            />
            <StickerPeel
              imageSrc="/images/vehicle-type/van.png"
              width={widths.van}
              rotate={10}
              peelBackHoverPct={30}
              peelBackActivePct={15}
              shadowIntensity={0.5}
              lightingIntensity={0.5}
              initialPosition={positions.van}
              peelDirection={0}
              onClick={() => setSelectedVehicle("van")}
            />

            {/* Floating info tip */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 pointer-events-none select-none flex items-center gap-2 z-30 w-max whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[10px] sm:text-xs text-white/80 font-bold tracking-wider">
                Click on any sticker to view details
              </span>
            </div>
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
                 
                  <h3 className="text-2xl font-bold mt-2.5 mb-4 leading-tight">{vehicleDetails[selectedVehicle].name}</h3>
                  
                  {/* Miniature Image */}
                  <div className="w-full h-[120px] bg-black rounded-xl border border-white/5 overflow-hidden mb-4">
                    <img
                      src={vehicleDetails[selectedVehicle].image}
                      alt={vehicleDetails[selectedVehicle].name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {vehicleDetails[selectedVehicle].desc}
                  </p>

                  <div className="flex items-center justify-around bg-white/5 border border-white/10 rounded-xl p-3 mb-4 text-center">
                    <div className="flex-1">
                      <p className="text-sm  font-bold  tracking-wider">Passengers</p>
                      <p className="text-base font-extrabold text-white mt-0.5">{vehicleDetails[selectedVehicle].passengers} Max</p>
                    </div>
                    <div className="border-l border-white/15 h-8 self-center" />
                    <div className="flex-1">
                      <p className="text-sm font-bold  tracking-wider">Luggage</p>
                      <p className="text-base font-extrabold text-white mt-0.5">{vehicleDetails[selectedVehicle].luggage} Bags</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-6">
                    {vehicleDetails[selectedVehicle].features.map((feat, idx) => (
                      <p key={idx} className="text-slate-300 text-xs font-medium">{feat}</p>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 mt-auto">
                  <a
                    href="/booking"
                    className="w-full flex cursor-pointer items-center justify-center bg-white hover:bg-slate-900 text-black hover:text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20"
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
