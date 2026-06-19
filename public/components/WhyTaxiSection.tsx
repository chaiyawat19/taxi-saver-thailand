"use client";

import React from "react";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";
import { ShieldCheck, CircleDollarSign, Clock, Languages } from "lucide-react";
import { motion } from "framer-motion";
import ScrollFloat from "./ScrollFloat";

export default function WhyTaxiSection() {
  const cardsData = [
    {
      id: "01",
      title: "Safe & Reliable",
      icon: ShieldCheck,
      colorClass: "text-[#3668FF] bg-blue-50 border-blue-100 shadow-blue-100/5",
      points: [
        {
          title: "Professional Drivers",
          desc: "Experienced, vetted, and courteous chauffeurs for a smooth ride.",
        },
        {
          title: "Regularly Maintained Vehicles",
          desc: "Our fleet undergoes strict safety checks and routine maintenance.",
        },
      ],
    },
    {
      id: "02",
      title: "Value for Money",
      icon: CircleDollarSign,
      colorClass: "text-emerald-600 bg-emerald-50 border-emerald-100 shadow-emerald-100/5",
      points: [
        {
          title: "Upfront Pricing",
          desc: "Clear, transparent rates agreed before you ride.",
        },
        {
          title: "No Hidden Fees",
          desc: "Honest Pricing. No Post-Trip Surprises.",
        },
      ],
    },
    {
      id: "03",
      title: "Punctual & On-Time",
      icon: Clock,
      colorClass: "text-amber-600 bg-amber-50 border-amber-100 shadow-amber-100/5",
      points: [
        {
          title: "Real-Time Flight Tracking",
          desc: "We monitor your flight status to adjust pickup times automatically for any delays.",
        },
        {
          title: "Prompt Pickup",
          desc: "Our drivers arrive on schedule, ensuring you never have to wait.",
        },
      ],
    },
    {
      id: "04",
      title: "Tourist-Friendly",
      icon: Languages,
      colorClass: "text-purple-600 bg-purple-50 border-purple-100 shadow-purple-100/5",
      points: [
        {
          title: "Designed for Travelers",
          desc: "Easy booking experience and customer support tailored for international tourists.",
        },
        {
          title: "Bilingual Service",
          desc: "Support and driver communication available in both Thai and English.",
        },
      ],
    },
  ];

  return (
    <section id="about-us" className="relative w-full bg-[#1DA58C] overflow-hidden pb-40 md:pb-24">
      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      <div className="relative max-w-[1400px] mx-auto w-full">
        {/* Scroll Stack Container */}
        <ScrollStack 
          useWindowScroll={true} 
          itemDistance={60} 
          itemScale={0.03} 
          itemStackDistance={110}
          baseScale={0.92}
          rotationAmount={1}
          className="px-0"
        >
          {/* Section Title */}
          {/* Section Title */}
          <div className="text-center w-full px-6 mb-12">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              stagger={0.03}
              textClassName="text-white text-4xl sm:text-5xl font-bold tracking-tight mb-4"
            >
              Why Choose Taxi Saver?
            </ScrollFloat>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-1.5 w-24 bg-white/35 mx-auto rounded-full mb-6 origin-center"
            />
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="text-white/95 text-base sm:text-lg max-w-xl mx-auto leading-relaxed "
            >
              Your premium journey across Thailand, made simple. Safe, punctual, and transparent from the moment we meet, leaving an impression that makes you want to return.
            </motion.p>
          </div>

          {/* Cards */}
          {cardsData.map((card) => {
            const Icon = card.icon;
            return (
              <ScrollStackItem 
                key={card.id}
                itemClassName="bg-white border border-slate-200/80 text-slate-900 shadow-2xl overflow-hidden relative"
              >
                {/* Large watermark number positioned at the absolute bottom-right corner of the card */}
                <div className="absolute right-10 bottom-[-10px] md:bottom-[-35px] text-[10rem] md:text-[14rem] font-black text-slate-100 select-none pointer-events-none leading-none z-0">
                  {card.id}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 h-full items-center relative z-10">
                  {/* Left: Icon & Title */}
                  <div className="md:col-span-5 flex items-center gap-4 md:gap-6 z-10">
                    <div className={`p-4 md:p-5 rounded-2xl border flex-shrink-0 ${card.colorClass}`}>
                      <Icon className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
                        Feature {card.id} of 04
                      </p>
                    </div>
                  </div>

                  {/* Right: Detailed list items */}
                  <div className="md:col-span-7 space-y-4 md:space-y-6 z-10">
                    {card.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-3 sm:gap-4">
                        <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#1DA58C]/15 flex items-center justify-center text-[#1DA58C] text-[10px] font-extrabold">
                          ✓
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-wide">
                            {pt.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                            {pt.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollStackItem>
            );
          })}
        </ScrollStack>
      </div>
    </section>
  );
}
