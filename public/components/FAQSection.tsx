"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const faqsEn = [
  {
    q: "When do I pay?",
    a: "You pay the driver directly in cash at the end of your trip. No upfront payment or deposit is required when booking online.",
  },
  {
    q: "Can I cancel my booking?",
    a: "Yes, you can cancel free of charge up to 24 hours before your scheduled pickup. Just contact us via WhatsApp or phone to cancel.",
  },
  {
    q: "How many passengers can you accommodate?",
    a: "We offer: Sedan (up to 3 pax), SUV/Fortuner (up to 6 pax), and VIP Alphard (up to 6 pax with extra luggage space). Select your vehicle during booking.",
  },
  {
    q: "What if my flight is delayed?",
    a: "We monitor your flight in real-time. If your flight is delayed, we automatically adjust the pickup time — at no extra charge.",
  },
  {
    q: "Are your drivers English-speaking?",
    a: "Drivers communicate basic English for tourist needs. Our support team is fully bilingual (Thai & English) and available 24/7 via WhatsApp.",
  },
  {
    q: "What airports do you serve?",
    a: "We cover both Suvarnabhumi Airport (BKK) and Don Mueang Airport (DMK) — for arrivals, departures, and all point-to-point transfers.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend booking at least 24 hours in advance. Last-minute bookings are often possible too — just reach out via WhatsApp.",
  },
];

const faqsTh = [
  {
    q: "ต้องจ่ายเงินตอนไหน?",
    a: "จ่ายตรงให้คนขับเป็นเงินสดเมื่อสิ้นสุดการเดินทาง ไม่มีค่ามัดจำหรือการชำระล่วงหน้าเมื่อจองออนไลน์",
  },
  {
    q: "ยกเลิกการจองได้ไหม?",
    a: "ได้ครับ ยกเลิกฟรีก่อนเวลานัดรับอย่างน้อย 24 ชั่วโมง ติดต่อผ่าน WhatsApp หรือโทรศัพท์ได้เลย",
  },
  {
    q: "รองรับผู้โดยสารได้กี่คน?",
    a: "มีหลายรุ่นให้เลือก: รถเก๋ง (3 คน), รถ SUV/ฟอร์จูนเนอร์ (6 คน), และรถ VIP Alphard (6 คน + กระเป๋ามากขึ้น) เลือกรุ่นได้ตอนจอง",
  },
  {
    q: "ถ้าเครื่องบินดีเลย์จะทำยังไง?",
    a: "เราติดตามสถานะเที่ยวบินแบบเรียลไทม์ ถ้าเครื่องบินดีเลย์ คนขับจะปรับเวลามารับให้อัตโนมัติ ไม่มีค่าใช้จ่ายเพิ่ม",
  },
  {
    q: "คนขับพูดภาษาอังกฤษได้ไหม?",
    a: "คนขับสื่อสารภาษาอังกฤษพื้นฐานสำหรับนักท่องเที่ยวได้ และทีมซัพพอร์ตพูดได้ทั้งไทยและอังกฤษ พร้อมช่วยตลอด 24 ชั่วโมง",
  },
  {
    q: "ให้บริการสนามบินอะไรบ้าง?",
    a: "ให้บริการทั้งสนามบินสุวรรณภูมิ (BKK) และดอนเมือง (DMK) ทั้งรับและส่งผู้โดยสาร",
  },
  {
    q: "ควรจองล่วงหน้ากี่วัน?",
    a: "แนะนำจองล่วงหน้าอย่างน้อย 24 ชั่วโมงเพื่อความมั่นใจในการจัดรถ แต่ถ้าด่วนทักหาเราผ่าน WhatsApp ได้เลยครับ",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { language } = useLanguage();
  const faqs = language === "th" ? faqsTh : faqsEn;

  return (
    <section id="faq" className="relative w-full bg-[#1DA58C] overflow-hidden">
      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16 py-16 md:py-24">

        {/* ── Section Header ── */}
        <div className="mb-10 md:mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-white/90  uppercase tracking-widest mb-3"
          >
            {language === "th" ? "คำถามที่พบบ่อย" : "Common Questions"}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
          >
            {language === "th" ? "มีข้อสงสัย ?" : "Got Questions?"}
          </motion.h2>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] gap-8 xl:gap-12 items-start">

          {/* ── Left: FAQ Accordion ── */}
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className={`border rounded-2xl overflow-hidden transition-colors duration-200 ${
                  openIndex === i
                    ? "bg-white/15 border-white/25"
                    : "bg-white/8 border-white/12 hover:bg-white/12"
                }`}
              >
                <button
                  id={`faq-btn-${i}`}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left group cursor-pointer"
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className={`font-semibold text-sm sm:text-base leading-snug transition-colors duration-200 ${openIndex === i ? "text-white" : "text-white/80"}`}>
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 ${
                      openIndex === i ? "bg-white/25" : "bg-white/12 group-hover:bg-white/20"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 text-white" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      id={`faq-answer-${i}`}
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                      role="region"
                      aria-labelledby={`faq-btn-${i}`}
                    >
                      <p className="px-5 pb-5 text-white/70 text-sm sm:text-base leading-relaxed border-t border-white/15 pt-3">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* ── Right: Image + CTA Card ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-28 flex flex-col gap-5"
          >
            {/* Photo */}
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-black/30">
              <img
                src="/images/faq.jpg"
                alt="Taxi Saver driver in vehicle"
                className="w-full h-full object-cover object-center"
                draggable={false}
              />
              {/* Subtle green overlay at bottom for blending */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Badge overlaid on photo */}
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                <span className="bg-white/95 backdrop-blur-sm text-[#1DA58C] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  ✓ {language === "th" ? "ไม่มีมัดจำ" : "No Deposit"}
                </span>
                <span className="bg-white/95 backdrop-blur-sm text-[#1DA58C] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  ✓ {language === "th" ? "ตรงเวลา" : "On-Time Pickup"}
                </span>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-white/12 border border-white/20 rounded-2xl p-6 flex flex-col gap-4">
              <div>
                <p className="text-white font-bold text-lg leading-snug">
                  {language === "th" ? "ยังมีคำถามอีกไหม?" : "Still have questions?"}
                </p>
                <p className="text-white/60 text-sm mt-1 leading-relaxed">
                  {language === "th"
                    ? "ทีมงานเราพร้อมตอบทุกคำถามตลอด 24 ชั่วโมง"
                    : "Our team is ready to answer any questions, 24/7."}
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <a
                  href="https://wa.me/66624494253"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 bg-white text-[#1DA58C] font-bold text-sm px-5 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {language === "th" ? "ทัก WhatsApp" : "Chat on WhatsApp"}
                </a>

               
              </div>

              {/* Quick contact row */}
              <div className="flex items-center gap-2 pt-1 border-t border-white/15">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-white/50 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <a href="tel:+66624494253" className="text-white/55 hover:text-white/80 text-xs font-medium transition-colors duration-200">
                  +66 62 449 4253
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
