"use client";

import dynamic from "next/dynamic";
import Navbar from "../../../public/components/Navbar";
import BookingForm from "../../../public/components/BookingForm";

const Footer = dynamic(() => import("../../../public/components/Footer"), {
  ssr: true,
});

export default function BookingPageClient() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* ── LAYER 50: Navbar ── */}
      <div className="w-full relative z-50">
        <Navbar />
      </div>

      {/* ── LAYER 20: Main content ── */}
      <div className="relative z-20 pt-24 md:pt-28">
        <BookingForm />
      </div>

      {/* ── LAYER 10: Footer ── */}
      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}

