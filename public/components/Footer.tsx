"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

export default function Footer() {
  const { language, t } = useLanguage();

  const footerLinks = [
    { label: t.navHome,      href: "/#homepage" },
    { label: t.navFleet,     href: "/#fleet"  },
    { label: t.navPricing,   href: "/#pricing"  },
    { label: t.navContact,   href: "/#contact"  },
    { label: t.bookNow,      href: "/booking"  },
  ];

  return (
    <footer className="relative w-full bg-[#3668FF] overflow-hidden select-none">

      {/* Subtle dot texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      {/* Top divider line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/15" />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16">

        {/* ── CTA Banner ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-14 pb-10 border-b border-white/15">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-2"
            >
              {language === "th" ? "จองรถล่วงหน้า 24 ชั่วโมง" : "24/7 Advance Booking"}
            </motion.p>
            <h2 className="text-white text-2xl sm:text-5xl md:text-6xl font-bold leading-[1.05]">
              {language === "th" ? "พร้อมออกเดินทางแล้วหรือยัง?" : "Ready to Hit the Road?"}
            </h2>
          </div>
          <motion.a
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            href="/booking"
            className="inline-flex items-center gap-2.5 bg-white hover:bg-gray-50 text-[#3668FF] font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-xl text-base shrink-0 self-start md:self-auto"
          >
            {t.bookNow}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </motion.a>
        </div>

        {/* ── Three-column grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 py-12">

          {/* Col 1 — Brand + tagline + email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0 }}
            className="flex flex-col gap-5"
          >
            {/* Logo */}
            <a href="/#homepage" className="flex items-center group w-fit">
              <img
                src="/images/Logo-mono.png"
                alt="Taxi Saver Thailand"
                className="h-20 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-md brightness-0 invert"
              />
            </a>

            <p className="text-white/60 text-sm leading-relaxed max-w-[260px]">
              {language === "th"
                ? "บริการรถรับส่งและแท็กซี่ราคาสบายกระเป๋า ไม่มีมัดจำ จ่ายตรงให้คนขับ ครอบคลุมสนามบินสุวรรณภูมิ ดอนเมือง กรุงเทพฯ พัทยา หัวหิน"
                : "Affordable, deposit-free transfers & taxis. Pay the driver directly. Serving BKK & DMK airports, Bangkok, Pattaya, Hua Hin."}
            </p>
          </motion.div>

          {/* Col 2 — Navigation links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <p className="text-white/80 text-xs font-semibold uppercase tracking-widest">
              {language === "th" ? "แผนผังเว็บไซต์" : "Navigation"}
            </p>
            <nav className="flex flex-col gap-2.5">
              {footerLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white/65 hover:text-white text-sm font-medium transition-colors duration-200 w-fit hover:translate-x-0.5 transition-transform"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Col 3 — Contact + Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <p className="text-white/80 text-xs font-semibold uppercase tracking-widest">
              {language === "th" ? "ติดต่อเรา" : "Contact Us"}
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="tel:+66624494253"
                className="flex items-center gap-2.5 text-white/65 hover:text-white text-sm transition-colors duration-200"
              >
                <PhoneIcon />
                +66 62 449 4253
              </a>
              <a
                href="mailto:Taxisaverthailand@gmail.com"
                className="flex items-center gap-2.5 text-white/65 hover:text-white text-sm transition-colors duration-200 break-all"
              >
                <MailIcon />
                Taxisaverthailand@gmail.com
              </a>
            </div>

            {/* Social icons */}
            <div className="mt-1">
              <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-3">
                {language === "th" ? "ติดตามเรา" : "Follow Us"}
              </p>
              <div className="flex gap-3">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                {/* WhatsApp */}
                <a
                  href="https://wa.me/66624494253"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/15 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/35">
          <span>
            {language === "th"
              ? `© ${new Date().getFullYear()} Taxi Saver Thailand. สงวนลิขสิทธิ์ทั้งหมด`
              : `© ${new Date().getFullYear()} Taxi Saver Thailand. All rights reserved.`}
          </span>
          <span>taxisaverthailand.com</span>
        </div>

      </div>
    </footer>
  );
}
