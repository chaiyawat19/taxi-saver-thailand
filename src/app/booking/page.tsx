"use client";

import SideRays from "../../../public/components/SideRays";
import Navbar from "../../../public/components/Navbar";
import BookingForm from "../../../public/components/BookingForm";
import Footer from "../../../public/components/Footer";
import { motion } from "framer-motion";

export default function BookingPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">

      {/* ── LAYER –1: SideRays pinned to the viewport, behind everything ── */}
      

      {/* ── LAYER 50: Navbar ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full relative z-50"
      >
        <Navbar />
      </motion.div>

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
