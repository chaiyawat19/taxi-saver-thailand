"use client";

import { motion } from "framer-motion";
import Navbar from "../../../public/components/Navbar";
import Footer from "../../../public/components/Footer";
import PricingTable from "../../../public/components/PricingTable";

export default function PricingPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#1DA58C]">
      {/* ── Navbar ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full relative z-50"
      >
        <Navbar />
      </motion.div>

      {/* ── Pricing content ── */}
      <div className="relative z-10 pt-12 md:pt-16">
        <PricingTable />
      </div>

      {/* ── Footer ── */}
      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}
