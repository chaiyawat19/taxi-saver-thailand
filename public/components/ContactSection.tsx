"use client";

import { motion } from "framer-motion";
import Folder from "./Folder";

// ── Paper content (tiny cards inside the folder) ──────────────────────────────
const WhatsAppPaper = (
  <div className="w-full h-full flex flex-col items-center justify-center gap-[3px]">
    <svg viewBox="0 0 24 24" fill="#25D366" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.528 5.855L.057 23.5l5.799-1.522A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.659-.524-5.168-1.432L2.5 21.5l.962-4.244A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
    <span className="text-[8px] font-bold text-gray-700 leading-tight text-center">WhatsApp</span>
    <span className="text-[6px] text-gray-500 leading-tight">+66 81 234 5678</span>
  </div>
);

const FacebookPaper = (
  <div className="w-full h-full flex flex-col items-center justify-center gap-[3px]">
    <svg viewBox="0 0 24 24" fill="#1877F2" className="w-5 h-5">
      <path d="M24 12.073C24 5.445 18.627 0 12 0S0 5.445 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.247h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
    <span className="text-[8px] font-bold text-gray-700 leading-tight text-center">Facebook</span>
    <span className="text-[6px] text-gray-500 leading-tight">Taxi Saver Thailand</span>
  </div>
);

const PhonePaper = (
  <div className="w-full h-full flex flex-col items-center justify-center gap-[3px]">
    <svg viewBox="0 0 24 24" fill="none" stroke="#1DA58C" strokeWidth="2" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
    <span className="text-[8px] font-bold text-gray-700 leading-tight text-center">Phone</span>
    <span className="text-[6px] text-gray-500 leading-tight">+66 81 234 5678</span>
  </div>
);

// ── Contact channel cards (shown outside the folder) ─────────────────────────
const channels = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    detail: "+66 81 234 5678",
    href: "https://wa.me/66812345678",
    bg: "#25D366",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.528 5.855L.057 23.5l5.799-1.522A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.659-.524-5.168-1.432L2.5 21.5l.962-4.244A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    label: "Facebook",
    detail: "Taxi Saver Thailand",
    href: "https://facebook.com",
    bg: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
        <path d="M24 12.073C24 5.445 18.627 0 12 0S0 5.445 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.247h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    id: "phone",
    label: "Phone Call",
    detail: "+66 81 234 5678",
    href: "tel:+66812345678",
    bg: "#1DA58C",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="relative w-full bg-[#1DA58C] overflow-hidden">
      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16 py-16 md:py-24">

        {/* ── Layout: left text + folder | right channel cards ── */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-12">

          {/* LEFT — Heading + Folder */}
          <div className="flex flex-col items-center lg:items-start gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center lg:text-left"
            >
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">Get in touch</p>
              <h2 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] mb-4">
                We&apos;re Here<br />to Help
              </h2>
              <p className="text-white/70 text-base sm:text-lg max-w-sm leading-relaxed">
                Reach us anytime via WhatsApp, Facebook, or phone. We reply fast — usually within minutes.
              </p>
            </motion.div>

            {/* Folder + hint */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-4"
            >
              {/* Folder needs vertical space to fan out upward */}
              <div style={{ height: "240px", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                <Folder
                  size={2}
                  color="#5227FF"
                  items={[WhatsAppPaper, FacebookPaper, PhonePaper]}
                />
              </div>
              <p className="text-white/50 text-xs font-medium tracking-wide animate-pulse">
                ← Click the folder to reveal contacts
              </p>
            </motion.div>
          </div>

          {/* RIGHT — Contact channel cards */}
          <div className="flex flex-col gap-4 w-full max-w-md lg:max-w-sm xl:max-w-md">
            {channels.map((ch, i) => (
              <motion.a
                key={ch.id}
                href={ch.href}
                target={ch.href.startsWith("http") ? "_blank" : undefined}
                rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.025, x: 4 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-4 bg-white/10 hover:bg-white/18 backdrop-blur-sm border border-white/15 hover:border-white/30 rounded-2xl px-5 py-4 transition-colors duration-200 group cursor-pointer"
              >
                {/* Icon circle */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: ch.bg }}
                >
                  {ch.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-base leading-tight">{ch.label}</p>
                  <p className="text-white/60 text-sm mt-0.5 truncate">{ch.detail}</p>
                </div>

                {/* Arrow */}
                <svg
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
                  className="w-5 h-5 text-white/35 group-hover:text-white/70 group-hover:translate-x-1 transition-all duration-200 shrink-0"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </motion.a>
            ))}

            {/* Response time badge */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-2 mt-2 px-1"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_2px_rgba(74,222,128,0.5)] animate-pulse shrink-0" />
              <p className="text-white/55 text-sm">Typical response time: under 10 minutes</p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
