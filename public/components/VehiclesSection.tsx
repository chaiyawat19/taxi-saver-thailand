"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

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
  const [selectedVehicle, setSelectedVehicle] = useState<string>("sedan_s");
  const { language } = useLanguage();

  const vehicleDetails: Record<string, VehicleDetail> = language === "th" ? {
    sedan_s: {
      name: "Sedan S",
      passengers: 3,
      luggage: 2,
      desc: "เหมาะสำหรับผู้เดินทางคนเดียวหรือคู่รัก ขนาดกะทัดรัด สะอาด และประหยัดงบสำหรับทริปใกล้ ๆ",
      color: "from-sky-500 to-blue-600",
      image: "/images/vehicle-type/almera.png",
      features: [
        "✦ เหมาะสำหรับผู้โดยสาร 1-3 ท่าน",
        "✦ ระบบปรับอากาศมาตรฐาน",
        "✦ บรรจุกระเป๋าเดินทางใบใหญ่ได้ 2 ใบ",
      ]
    },
    sedan_m: {
      name: "Sedan M",
      passengers: 3,
      luggage: 3,
      desc: "ยกระดับความสบายขึ้นมาอีกขั้น เหมาะสำหรับการเดินทางติดต่อธุรกิจ หรือครอบครัวขนาดเล็กที่ต้องการพื้นที่วางขาเพิ่มเติม",
      color: "from-indigo-500 to-violet-600",
      image: "/images/vehicle-type/altis.png",
      features: [
        "✦ เหมาะสำหรับผู้โดยสาร 1-3 ท่าน",
        "✦ ระบบปรับอากาศระดับพรีเมียม",
        "✦ บรรจุกระเป๋าเดินทางใบใหญ่ได้ 3 ใบ",
      ]
    },
    sedan_l: {
      name: "Sedan L",
      passengers: 3,
      luggage: 3,
      desc: "รถเก๋งผู้บริหารขนาดใหญ่เพื่อความสบายสูงสุด เหมาะสำหรับรับรองแขก VIP และการเดินทางระยะไกล",
      color: "from-violet-500 to-purple-600",
      image: "/images/vehicle-type/sedan.webp",
      features: [
        "✦ เหมาะสำหรับผู้โดยสาร 1-3 ท่าน",
        "✦ ความเงียบและความกว้างขวางระดับผู้บริหาร",
        "✦ บรรจุกระเป๋าเดินทางใบใหญ่ได้ 3 ใบ",
      ]
    },
    suv: {
      name: "SUV",
      passengers: 6,
      luggage: 4,
      desc: "เหมาะสำหรับครอบครัวขนาดเล็กหรือผู้เดินทางที่มีสัมภาระเพิ่มเติม ทัศนวิสัยสูงโปร่ง โครงสร้างแข็งแรงนั่งสบาย",
      color: "from-emerald-500 to-teal-600",
      image: "/images/vehicle-type/fortuner-19139.png",
      features: [
        "✦ เหมาะสำหรับผู้โดยสาร 3-6 ท่าน",
        "✦ ระบบปรับอากาศแยกส่วนหน้าหลัง",
        "✦ บรรจุกระเป๋าเดินทางใบใหญ่ได้ 4 ใบ",
      ]
    },
    van: {
      name: "VIP Van",
      passengers: 6,
      luggage: 4,
      desc: "ดีเยี่ยมสำหรับคณะใหญ่ ครอบครัว ทัวร์กอล์ฟ หรือการเดินทางเป็นกลุ่มคณะภายในกว้างขวางพร้อมเบาะนั่ง VIP สุดนุ่ม",
      color: "from-rose-500 to-pink-600",
      image: "/images/vehicle-type/alphard.webp",
      features: [
        "✦ เหมาะสำหรับผู้โดยสาร 4-6 ท่าน",
        "✦ บรรจุกระเป๋าเดินทางใบใหญ่ได้ 3-4 ใบ",
        "✦ เบาะ VIP และพื้นที่วางขากว้างขวางมาก",
        "✦ แนะนำสำหรับทริปท่องเที่ยวแบบหมู่คณะ"
      ]
    }
  } : {
    sedan_s: {
      name: "Sedan S",
      passengers: 3,
      luggage: 2,
      desc: "Perfect for solo travellers or couples. Compact, clean, and budget-friendly for short trips.",
      color: "from-sky-500 to-blue-600",
      image: "/images/vehicle-type/almera.png",
      features: [
        "✦ Best for 1-3 passengers",
        "✦ Standard Air Conditioning",
        "✦ Fits 2 large luggage bags",
      ]
    },
    sedan_m: {
      name: "Sedan M",
      passengers: 3,
      luggage: 3,
      desc: "A step up in comfort — ideal for business trips or small families wanting a little extra space.",
      color: "from-indigo-500 to-violet-600",
      image: "/images/vehicle-type/altis.png",
      features: [
        "✦ Best for 1-3 passengers",
        "✦ Premium Air Conditioning",
        "✦ Fits 3 large luggage bags",
      ]
    },
    sedan_l: {
      name: "Sedan L",
      passengers: 3,
      luggage: 3,
      desc: "Full-size executive sedan for maximum comfort. Great for VIP transfers and longer journeys.",
      color: "from-violet-500 to-purple-600",
      image: "/images/vehicle-type/sedan.webp",
      features: [
        "✦ Best for 1-3 passengers",
        "✦ Executive comfort & legroom",
        "✦ Fits 3 large luggage bags",
      ]
    },
    suv: {
      name: "SUV",
      passengers: 4,
      luggage: 4,
      desc: "Ideal for small families or passengers with extra luggage. Provides a commanding view and robust comfort.",
      color: "from-emerald-500 to-teal-600",
      image: "/images/vehicle-type/fortuner-19139.png",
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
      color: "from-rose-500 to-pink-600",
      image: "/images/vehicle-type/alphard.webp",
      features: [
        "✦ Best for 5-9 passengers",
        "✦ Fits 5-6 large luggage bags",
        "✦ Plenty of legroom & VIP seats",
        "✦ Recommended for group tours"
      ]
    }
  };

  const tabGroups = [
    {
      label: "Sedan",
      keys: ["sedan_s", "sedan_m", "sedan_l"],
    },
    { label: "SUV", keys: ["suv"] },
    { label: "VAN", keys: ["van"] },
  ];

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
            {language === "th" ? "รถบริการในระบบ" : "Our Fleet"}
          </h2>
          <p className="text-white/80 text-sm max-w-sm mx-auto">
            {language === "th" ? "เลือกประเภทรถยนต์ที่เหมาะกับการเดินทางของคุณในประเทศไทย" : "Choose your preferred vehicle for a comfortable trip across Thailand."}
          </p>
        </div>

        {/* Segmented control with sub-tabs for Sedan */}
        <div className="flex flex-col items-center gap-3 z-30">
          {/* Top-level category switcher */}
          <div className="flex bg-black/25 backdrop-blur-md p-1 rounded-2xl border border-white/10 gap-1 select-none">
            {tabGroups.map((group) => {
              const isGroupSelected = group.keys.includes(selectedVehicle);
              return (
                <button
                  key={group.label}
                  type="button"
                  onClick={() => setSelectedVehicle(group.keys[0])}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
                    isGroupSelected
                      ? "bg-white text-slate-900 shadow-xl"
                      : "text-white/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {group.label}
                </button>
              );
            })}
          </div>

          {/* Sedan sub-size selector */}
          <AnimatePresence>
            {(selectedVehicle === "sedan_s" || selectedVehicle === "sedan_m" || selectedVehicle === "sedan_l") && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="flex bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/10 gap-1 select-none"
              >
                {["sedan_s", "sedan_m", "sedan_l"].map((key) => {
                  const sizeLabel = key === "sedan_s" ? "S" : key === "sedan_m" ? "M" : "L";
                  const isSelected = selectedVehicle === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedVehicle(key)}
                      className={`px-5 py-1.5 rounded-lg font-bold text-sm transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-white/90 text-slate-900 shadow-lg"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {language === "th" ? `ไซส์ ${sizeLabel}` : `Size ${sizeLabel}`}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
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
                className="relative w-full h-full flex items-center justify-center group"
              >
                {/* Static wrapper container */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Shadow underneath the car */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[75%] h-[30px] bg-black/40 blur-2xl rounded-full pointer-events-none origin-center" />
                  
                  {/* Car Image */}
                  <img
                    src={vehicleDetails[selectedVehicle].image}
                    alt={vehicleDetails[selectedVehicle].name}
                    className={`w-full h-auto object-contain z-10 pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition-all duration-300 ${
                      selectedVehicle === "van"
                        ? "max-w-[480px] sm:max-w-[550px] lg:max-w-[500px] scale-[1.35] sm:scale-[1.25] mt-20"
                        : "max-w-[420px] sm:max-w-[480px] lg:max-w-[540px] "
                    }`}
                  />
                </div>
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
                      <p className="text-sm font-bold tracking-wider text-slate-200">
                        {language === "th" ? "ผู้โดยสารสูงสุด" : "Passengers"}
                      </p>
                      <p className="text-base font-extrabold text-white mt-0.5">
                        {vehicleDetails[selectedVehicle].passengers} {language === "th" ? "ท่าน" : "Max"}
                      </p>
                    </div>
                    <div className="border-l border-white/15 h-8 self-center" />
                    <div className="flex-1">
                      <p className="text-sm font-bold tracking-wider text-slate-200">
                        {language === "th" ? "จำนวนกระเป๋า" : "Luggage"}
                      </p>
                      <p className="text-base font-extrabold text-white mt-0.5">
                        {vehicleDetails[selectedVehicle].luggage} {language === "th" ? "ใบ" : "Bags"}
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
                    {language === "th" ? "จองรถประเภทนี้" : "Book This Vehicle"}
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
