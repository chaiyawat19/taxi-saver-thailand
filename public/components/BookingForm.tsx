"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MapPickerModal from "./MapPickerModal";

// ── Config ──────────────────────────────────────────────────────────────────
const CONTACT_WHATSAPP = "66900000000";
const CONTACT_EMAIL = "booking@taxisaverthailand.com";

// ── Types ───────────────────────────────────────────────────────────────────
type PickupKey = "don_mueang" | "suvarnabhumi" | "upcountry" | "hotel_bkk";
type DropoffKey = "don_mueang" | "suvarnabhumi" | "hotel_bkk" | "bkk_area" | "pattaya" | "hua_hin" | "rayong";
type UpcountryCity = "pattaya" | "hua_hin" | "rayong";
type VehicleType = "sedan" | "suv" | "van";
type DriverType = "general" | "women";

interface FormData {
  customerName: string;
  phone: string;
  email: string;
  travelDate: string;
  travelTime: string;
  pickupRegion: PickupKey | null;
  pickupUpcountryCity: UpcountryCity | null;
  pickupHotelName: string;
  dropoffRegion: DropoffKey | null;
  dropoffAddress: string;
  vehicleType: VehicleType;
  driverType: DriverType;
  additionalDetails: string;
  
  // Advanced fields
  flightNumber: string;
  largeLuggage: number;
  smallLuggage: number;
  hasGolfBag: boolean;
  hasSurfboard: boolean;
  hasStroller: boolean;
  hasWheelchair: boolean;
  hasBabySeat: boolean;
  babySeatCount: number;
  hasElderlyCare: boolean;
  hasStopover: boolean;
  stopoverDetails: string;
}

// ── Static data ──────────────────────────────────────────────────────────────
const PICKUP_OPTIONS: { id: PickupKey; name: string; desc: string; emoji: string }[] = [
  { id: "don_mueang",   name: "Don Mueang Airport",  desc: "International Airport (DMK)",         emoji: "✈️" },
  { id: "suvarnabhumi", name: "Suvarnabhumi Airport", desc: "International Airport (BKK)",         emoji: "🛫" },
  { id: "upcountry",    name: "Upcountry",            desc: "Pattaya · Hua Hin · Rayong",          emoji: "🏖️" },
  { id: "hotel_bkk",    name: "Hotel in Bangkok",     desc: "Any hotel or location in Bangkok",    emoji: "🏨" },
];

const UPCOUNTRY_CITIES: { id: UpcountryCity; name: string; emoji: string }[] = [
  { id: "pattaya",  name: "Pattaya",  emoji: "🏖️" },
  { id: "hua_hin",  name: "Hua Hin",  emoji: "🌊" },
  { id: "rayong",   name: "Rayong",   emoji: "🏝️" },
];

type DropoffOption = { name: string; desc: string; emoji: string; needsAddress: boolean; addressLabel: string };

const DROPOFF_OPTIONS: Record<DropoffKey, DropoffOption> = {
  don_mueang:   { name: "Don Mueang Airport",  desc: "DMK International Airport",            emoji: "✈️",  needsAddress: false, addressLabel: "" },
  suvarnabhumi: { name: "Suvarnabhumi Airport", desc: "BKK International Airport",            emoji: "🛫", needsAddress: false, addressLabel: "" },
  hotel_bkk:    { name: "Hotel in Bangkok",     desc: "Specify hotel name or address",        emoji: "🏨", needsAddress: true,  addressLabel: "Hotel name or address in Bangkok" },
  bkk_area:     { name: "Bangkok Area",         desc: "Hotel or area in Bangkok",             emoji: "🏙️", needsAddress: true,  addressLabel: "Hotel name or address in Bangkok" },
  pattaya:      { name: "Pattaya",              desc: "Hotel or address in Pattaya",          emoji: "🏖️", needsAddress: true,  addressLabel: "Hotel name or address in Pattaya" },
  hua_hin:      { name: "Hua Hin",              desc: "Hotel or address in Hua Hin",          emoji: "🌊", needsAddress: true,  addressLabel: "Hotel name or address in Hua Hin" },
  rayong:       { name: "Rayong",               desc: "Hotel or address in Rayong",           emoji: "🏝️", needsAddress: true,  addressLabel: "Hotel name or address in Rayong" },
};

const DROPOFF_MAP: Record<PickupKey, DropoffKey[]> = {
  don_mueang:   ["hotel_bkk", "pattaya", "hua_hin", "rayong"],
  suvarnabhumi: ["hotel_bkk", "pattaya", "hua_hin", "rayong"],
  upcountry:    ["bkk_area", "don_mueang", "suvarnabhumi"],
  hotel_bkk:    ["don_mueang", "suvarnabhumi", "pattaya", "hua_hin", "rayong"],
};

const VEHICLE_TYPES = [
  { id: "sedan" as VehicleType, name: "Sedan",  capacity: "1–3 passengers", emoji: "🚗" },
  { id: "suv"   as VehicleType, name: "SUV",    capacity: "1–3 passengers", emoji: "🚙" },
  { id: "van"   as VehicleType, name: "Van",    capacity: "4–5+ passengers", emoji: "🚐" },
];

const DRIVER_TYPES = [
  { id: "general" as DriverType, name: "General Driver", desc: "Any professional driver",  emoji: "🧑‍✈️" },
  { id: "women"   as DriverType, name: "Women Driver",   desc: "Female driver only",       emoji: "👩‍✈️" },
];

const STEPS = ["Your Details", "Pick-up", "Drop-off", "Preferences"];

const STEP_INFO = [
  { title: "Your Contact Details",    body: "We need your name, phone, and travel schedule to arrange your ride." },
  { title: "Pick-up Location",        body: "Choose your starting point — airport, hotel, or upcountry city." },
  { title: "Drop-off Location",       body: "Select your destination. Options depend on your pick-up." },
  { title: "Vehicle & Preferences",   body: "Choose vehicle type, driver preference, and any special requests." },
];

// ── Animation variants ──────────────────────────────────────────────────────
const slideVariants = {
  enter:  (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
  exit:   (dir: number) => ({ x: dir < 0 ? 48 : -48, opacity: 0, transition: { duration: 0.2 } }),
};

// ── Helpers ─────────────────────────────────────────────────────────────────
const inputCls = (err?: string) =>
  `w-full bg-black/20 border ${err ? "border-red-400/70" : "border-white/10"} text-white rounded-xl px-4 py-3 placeholder:text-white/30 focus:outline-none focus:border-[#3668FF] focus:ring-1 focus:ring-[#3668FF]/30 transition-all text-sm`;

const cardCls = (selected: boolean) =>
  `flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
    selected
      ? "bg-[#3668FF] border-[#3668FF] shadow-lg shadow-blue-500/20 text-white"
      : "bg-black/20 border-white/10 text-white/75 hover:border-white/25 hover:bg-black/30"
  }`;

const STORAGE_KEY_FORM = "taxisaver_booking_form";
const STORAGE_KEY_STEP = "taxisaver_booking_step";

const DEFAULT_FORM: FormData = {
  customerName: "",
  phone: "",
  email: "",
  travelDate: "",
  travelTime: "",
  pickupRegion: null,
  pickupUpcountryCity: null,
  pickupHotelName: "",
  dropoffRegion: null,
  dropoffAddress: "",
  vehicleType: "sedan",
  driverType: "general",
  additionalDetails: "",
  flightNumber: "",
  largeLuggage: 0,
  smallLuggage: 0,
  hasGolfBag: false,
  hasSurfboard: false,
  hasStroller: false,
  hasWheelchair: false,
  hasBabySeat: false,
  babySeatCount: 0,
  hasElderlyCare: false,
  hasStopover: false,
  stopoverDetails: "",
};

// ── Component ────────────────────────────────────────────────────────────────
export default function BookingForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitType, setSubmitType] = useState<"whatsapp" | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapTarget, setMapTarget] = useState<"pickup" | "dropoff" | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedForm = localStorage.getItem(STORAGE_KEY_FORM);
      if (savedForm) {
        setForm({ ...DEFAULT_FORM, ...JSON.parse(savedForm) });
      }
      const savedStep = localStorage.getItem(STORAGE_KEY_STEP);
      if (savedStep) {
        const parsedStep = parseInt(savedStep, 10);
        if (!isNaN(parsedStep) && parsedStep >= 0 && parsedStep < STEPS.length) {
          setStep(parsedStep);
        }
      }
    } catch (e) {
      console.error("Failed to load booking details from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save form data to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_FORM, JSON.stringify(form));
    } catch (e) {
      console.error("Failed to save booking details to localStorage", e);
    }
  }, [form, isLoaded]);

  // Save step to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_STEP, String(step));
    } catch (e) {
      console.error("Failed to save step to localStorage", e);
    }
  }, [step, isLoaded]);

  // Clear/Reset all details
  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all entered booking details?")) {
      try {
        localStorage.removeItem(STORAGE_KEY_FORM);
        localStorage.removeItem(STORAGE_KEY_STEP);
      } catch (e) {
        console.error("Failed to clear localStorage", e);
      }
      setForm(DEFAULT_FORM);
      setStep(0);
      setErrors({});
    }
  };

  const isFormDirty = Object.keys(form).some(k => {
    const key = k as keyof FormData;
    return form[key] !== DEFAULT_FORM[key];
  });

  const handleSelectAddress = (address: string) => {
    if (mapTarget === "pickup") {
      set("pickupHotelName", address);
    } else if (mapTarget === "dropoff") {
      set("dropoffAddress", address);
    }
    setMapTarget(null);
  };

  // Single field updater
  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: "" }));
  };

  // Multi-field updater
  const setMany = (updates: Partial<FormData>) => {
    setForm(prev => ({ ...prev, ...updates }));
    setErrors({});
  };

  // ── Derived values ───────────────────────────────────────────────────────
  const dropoffKeys: DropoffKey[] = form.pickupRegion ? DROPOFF_MAP[form.pickupRegion] : [];
  const currentDropoff = form.dropoffRegion ? DROPOFF_OPTIONS[form.dropoffRegion] : null;

  const pickupLabel = (() => {
    if (!form.pickupRegion) return "";
    if (form.pickupRegion === "upcountry" && form.pickupUpcountryCity) {
      return UPCOUNTRY_CITIES.find(c => c.id === form.pickupUpcountryCity)?.name ?? "Upcountry";
    }
    if (form.pickupRegion === "hotel_bkk") return form.pickupHotelName || "Hotel in Bangkok";
    return PICKUP_OPTIONS.find(p => p.id === form.pickupRegion)?.name ?? "";
  })();

  const dropoffLabel = (() => {
    if (!form.dropoffRegion) return "";
    const opt = DROPOFF_OPTIONS[form.dropoffRegion];
    return opt.needsAddress && form.dropoffAddress ? `${opt.name} — ${form.dropoffAddress}` : opt.name;
  })();

  // ── Message compiler ────────────────────────────────────────────────────
  const compileMessage = () => {
    const vehicle = { sedan: "Sedan (1–3 passengers)", suv: "SUV (1–3 passengers)", van: "Van (4–5+ passengers)" }[form.vehicleType];
    const driver  = form.driverType === "women" ? "Women Driver" : "General Driver";
    
    // Luggage details
    let luggageParts = [];
    if (form.largeLuggage > 0) luggageParts.push(`${form.largeLuggage} Large`);
    if (form.smallLuggage > 0) luggageParts.push(`${form.smallLuggage} Small`);
    const luggageStr = luggageParts.length > 0 ? luggageParts.join(", ") : "None";

    // Oversized items
    let oversizedList = [];
    if (form.hasGolfBag) oversizedList.push("Golf Bag");
    if (form.hasSurfboard) oversizedList.push("Surfboard");
    if (form.hasStroller) oversizedList.push("Stroller");
    if (form.hasWheelchair) oversizedList.push("Wheelchair");
    const oversizedStr = oversizedList.length > 0 ? oversizedList.join(", ") : "";

    // Special Requests
    let specialList = [];
    if (form.hasBabySeat) specialList.push(`Baby Seat (${form.babySeatCount})`);
    if (form.hasElderlyCare) specialList.push("Elderly/Easy-access Care");
    if (form.hasStopover) specialList.push(`Stopover: ${form.stopoverDetails}`);
    const specialStr = specialList.length > 0 ? specialList.join(", ") : "";

    let msg = `Hello, I'd like to book a taxi with Taxi Saver Thailand.

👤 Name: ${form.customerName}
📞 Phone: ${form.phone}${form.email ? `\n📧 Email: ${form.email}` : ""}
📅 Date: ${form.travelDate || "Not specified"}
⏰ Time: ${form.travelTime || "Not specified"}

📍 Pick-up: ${pickupLabel}
🏁 Drop-off: ${dropoffLabel}`;

    if (form.flightNumber) {
      msg += `\n✈️ Flight: ${form.flightNumber}`;
    }

    msg += `\n\n🚗 Vehicle: ${vehicle}
🧑‍✈️ Driver: ${driver}
💼 Luggage: ${luggageStr}${oversizedStr ? ` (${oversizedStr})` : ""}`;

    if (specialStr) {
      msg += `\n✨ Special Requests: ${specialStr}`;
    }

    if (form.additionalDetails) {
      msg += `\n📝 Notes: ${form.additionalDetails}`;
    }

    return msg;
  };

  // ── Validation ──────────────────────────────────────────────────────────
  const validate = (s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 0) {
      if (!form.customerName.trim()) errs.customerName = "Full name is required.";
      if (!form.phone.trim())        errs.phone        = "Phone number is required.";
      if (!form.travelDate)          errs.travelDate   = "Travel date is required.";
      if (!form.travelTime)          errs.travelTime   = "Pick-up time is required.";
    }
    if (s === 1) {
      if (!form.pickupRegion) errs.pickupRegion = "Please select a pick-up location.";
      if (form.pickupRegion === "upcountry" && !form.pickupUpcountryCity) errs.pickupUpcountryCity = "Please select a city.";
      if (form.pickupRegion === "hotel_bkk" && !form.pickupHotelName.trim()) errs.pickupHotelName = "Please enter the hotel name or address.";
    }
    if (s === 2) {
      if (!form.dropoffRegion) errs.dropoffRegion = "Please select a drop-off location.";
      if (currentDropoff?.needsAddress && !form.dropoffAddress.trim()) errs.dropoffAddress = "Please specify the hotel name or address.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => { if (!validate(step)) return; setDirection(1); setStep(s => s + 1); };
  const goBack = () => { setDirection(-1); setStep(s => s - 1); };

  // ── Submit handlers ─────────────────────────────────────────────────────
  const handleWhatsApp = () => {
    window.open(`https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(compileMessage())}`, "_blank");
    setSubmitType("whatsapp");
  };

  const handleEmail = () => setShowEmailModal(true);

  const getGmailUrl   = () => `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${encodeURIComponent(`Taxi Booking – ${form.customerName}`)}&body=${encodeURIComponent(compileMessage())}`;
  const getOutlookUrl = () => `https://outlook.live.com/default.aspx?rru=compose&to=${CONTACT_EMAIL}&subject=${encodeURIComponent(`Taxi Booking – ${form.customerName}`)}&body=${encodeURIComponent(compileMessage())}`;
  const getMailtoUrl  = () => `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Taxi Booking – ${form.customerName}`)}&body=${encodeURIComponent(compileMessage())}`;

  const getGmailHref = () => {
    const webUrl = getGmailUrl();
    if (!isLoaded || typeof window === "undefined" || typeof navigator === "undefined") {
      return webUrl;
    }
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(ua);
    const isIOS = /ipad|iphone|ipod/.test(ua);

    const subject = `Taxi Booking – ${form.customerName}`;
    const body = compileMessage();

    if (isIOS) {
      return `googlegmail:///co?to=${CONTACT_EMAIL}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else if (isAndroid) {
      return `intent://compose?to=${CONTACT_EMAIL}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}#Intent;scheme=mailto;package=com.google.android.gm;end`;
    }
    return webUrl;
  };

  const getOutlookHref = () => {
    const webUrl = getOutlookUrl();
    if (!isLoaded || typeof window === "undefined" || typeof navigator === "undefined") {
      return webUrl;
    }
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(ua);
    const isIOS = /ipad|iphone|ipod/.test(ua);

    const subject = `Taxi Booking – ${form.customerName}`;
    const body = compileMessage();

    if (isIOS) {
      return `ms-outlook://compose?to=${CONTACT_EMAIL}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else if (isAndroid) {
      return `intent://compose?to=${CONTACT_EMAIL}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}#Intent;scheme=mailto;package=com.microsoft.office.outlook;end`;
    }
    return webUrl;
  };

  const getEmailLinkProps = (type: "gmail" | "outlook") => {
    const webUrl = type === "gmail" ? getGmailUrl() : getOutlookUrl();
    if (!isLoaded || typeof window === "undefined" || typeof navigator === "undefined") {
      return {
        href: webUrl,
        target: "_blank",
        rel: "noopener noreferrer",
      };
    }
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /android|ipad|iphone|ipod/.test(ua);

    return {
      href: type === "gmail" ? getGmailHref() : getOutlookHref(),
      target: isMobile ? undefined : "_blank",
      rel: isMobile ? undefined : "noopener noreferrer",
    };
  };

  const handleGmailClick = () => {
    setShowEmailModal(false);

    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const ua = navigator.userAgent.toLowerCase();
      const isIOS = /ipad|iphone|ipod/.test(ua);

      if (isIOS) {
        // Fallback to Web Gmail after 1.5 seconds if app doesn't open
        const start = Date.now();
        const webUrl = getGmailUrl();
        setTimeout(() => {
          if (Date.now() - start < 2000) {
            window.open(webUrl, "_blank");
          }
        }, 1500);
      }
    }
  };

  const handleOutlookClick = () => {
    setShowEmailModal(false);

    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const ua = navigator.userAgent.toLowerCase();
      const isIOS = /ipad|iphone|ipod/.test(ua);

      if (isIOS) {
        // Fallback to Outlook Web after 1.5 seconds if app doesn't open
        const start = Date.now();
        const webUrl = getOutlookUrl();
        setTimeout(() => {
          if (Date.now() - start < 2000) {
            window.open(webUrl, "_blank");
          }
        }, 1500);
      }
    }
  };

  // ── Email modal ──────────────────────────────────────────────────────────
  const EmailModal = () => (
    <AnimatePresence>
      {showEmailModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ backdropFilter: "blur(12px)", backgroundColor: "rgba(0,0,0,0.65)" }}
          onClick={() => setShowEmailModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className="bg-[#0d0d14] border border-white/15 rounded-3xl p-8 w-full max-w-sm shadow-2xl"
          >
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-1">Send via Email</h3>
            <p className="text-white/50 text-sm text-center mb-7">Choose your email client to send the booking details.</p>

            <div className="space-y-3">
              {/* Default Mail App */}
              <a
                href={getMailtoUrl()}
                onClick={() => setShowEmailModal(false)}
                className="flex items-center gap-4 w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-2xl px-5 py-4 transition-all duration-200 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold text-base">Mail App (Default)</div>
                  <div className="text-xs text-white/45">Recommended for Mobile</div>
                </div>
                <svg className="w-4 h-4 text-white/30 group-hover:text-white/60 ml-auto transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>

              {/* Gmail */}
              <a
                {...getEmailLinkProps("gmail")}
                onClick={handleGmailClick}
                className="flex items-center gap-4 w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-2xl px-5 py-4 transition-all duration-200 cursor-pointer group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EA4335] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-1.29 1.454-2.032 2.508-1.242L12 10.73l9.492-7.116c1.054-.79 2.508-.048 2.508 1.242z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold text-base">Gmail</div>
                  <div className="text-xs text-white/45">Open in Gmail app or web</div>
                </div>
                <svg className="w-4 h-4 text-white/30 group-hover:text-white/60 ml-auto transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>

              {/* Outlook */}
              <a
                {...getEmailLinkProps("outlook")}
                onClick={handleOutlookClick}
                className="flex items-center gap-4 w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-2xl px-5 py-4 transition-all duration-200 cursor-pointer group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0078d4] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M7.462 0L0 1.31v21.38L7.462 24l16.538-2V2L7.462 0zm-.615 18.03c-2.78 0-4.616-2.24-4.616-5.723 0-3.574 1.87-5.868 4.698-5.868 2.78 0 4.47 2.185 4.47 5.647 0 3.649-1.738 5.944-4.552 5.944zm.046-9.924c-1.482 0-2.39 1.456-2.39 4.06 0 2.55.877 3.99 2.36 3.99 1.5 0 2.39-1.47 2.39-4.07 0-2.55-.876-3.98-2.36-3.98z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold text-base">Outlook</div>
                  <div className="text-xs text-white/45">Open in Outlook app or web</div>
                </div>
                <svg className="w-4 h-4 text-white/30 group-hover:text-white/60 ml-auto transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>

            <button
              type="button"
              onClick={() => setShowEmailModal(false)}
              className="w-full mt-5 py-3 rounded-2xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 text-sm font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ── Step renderers ──────────────────────────────────────────────────────
  const renderStep0 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-base font-semibold text-white/90 mb-2">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input type="text" value={form.customerName} onChange={e => set("customerName", e.target.value)}
            placeholder="First and last name" className={inputCls(errors.customerName)} />
          {errors.customerName && <p className="mt-1 text-sm text-red-300">{errors.customerName}</p>}
        </div>
        <div>
          <label className="block text-base font-semibold text-white/90 mb-2">
            Phone Number <span className="text-red-400">*</span>
          </label>
          <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
            placeholder="+66 8X-XXXX-XXXX" className={inputCls(errors.phone)} />
          {errors.phone && <p className="mt-1 text-sm text-red-300">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-base font-semibold text-white/90 mb-2">
          Email{" "}
          <span className="text-white/40 text-sm font-normal">(optional — for booking confirmation)</span>
        </label>
        <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
          placeholder="your@email.com" className={inputCls()} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-base font-semibold text-white/90 mb-2">
            Travel Date <span className="text-red-400">*</span>
          </label>
          <input type="date" value={form.travelDate} onChange={e => set("travelDate", e.target.value)}
            className={inputCls(errors.travelDate)} style={{ colorScheme: "dark" }} />
          {errors.travelDate && <p className="mt-1 text-sm text-red-300">{errors.travelDate}</p>}
        </div>
        <div>
          <label className="block text-base font-semibold text-white/90 mb-2">
            Pick-up Time <span className="text-red-400">*</span>
          </label>
          <input type="time" value={form.travelTime} onChange={e => set("travelTime", e.target.value)}
            className={inputCls(errors.travelTime)} style={{ colorScheme: "dark" }} />
          {errors.travelTime && <p className="mt-1 text-sm text-red-300">{errors.travelTime}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <p className="text-base text-white/55">Where will you be picked up?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PICKUP_OPTIONS.map(opt => (
          <button key={opt.id} type="button"
            onClick={() => setMany({ pickupRegion: opt.id, pickupUpcountryCity: null, pickupHotelName: "", dropoffRegion: null, dropoffAddress: "" })}
            className={cardCls(form.pickupRegion === opt.id)}>
            <span className="text-2xl flex-shrink-0">{opt.emoji}</span>
            <div>
              <div className="font-bold text-base">{opt.name}</div>
              <div className="text-xs opacity-70 mt-0.5">{opt.desc}</div>
            </div>
          </button>
        ))}
      </div>
      {errors.pickupRegion && <p className="text-sm text-red-300">{errors.pickupRegion}</p>}

      {/* Upcountry city selector */}
      {form.pickupRegion === "upcountry" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 pt-1">
          <p className="text-base font-semibold text-white/80">Which city?</p>
          <div className="grid grid-cols-3 gap-3">
            {UPCOUNTRY_CITIES.map(city => (
              <button key={city.id} type="button"
                onClick={() => set("pickupUpcountryCity", city.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  form.pickupUpcountryCity === city.id
                    ? "bg-[#3668FF] border-[#3668FF] text-white"
                    : "bg-black/20 border-white/10 text-white/70 hover:border-white/25"
                }`}>
                <span className="text-xl">{city.emoji}</span>
                <span className="text-sm font-bold">{city.name}</span>
              </button>
            ))}
          </div>
          {errors.pickupUpcountryCity && <p className="text-sm text-red-300">{errors.pickupUpcountryCity}</p>}
        </motion.div>
      )}

      {/* Hotel Bangkok name input */}
      {form.pickupRegion === "hotel_bkk" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pt-1">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-base font-semibold text-white/90">
              Hotel Name or Address <span className="text-red-400">*</span>
            </label>
            <button
              type="button"
              onClick={() => setMapTarget("pickup")}
              className="text-xs text-[#3668FF] hover:text-[#2a56e0] font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              🗺️ Pick on Map
            </button>
          </div>
          <input type="text" value={form.pickupHotelName} onChange={e => set("pickupHotelName", e.target.value)}
            placeholder="e.g., Marriott Sukhumvit, near Siam Paragon..." className={inputCls(errors.pickupHotelName)} />
          {errors.pickupHotelName && <p className="mt-1 text-sm text-red-300">{errors.pickupHotelName}</p>}
        </motion.div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <p className="text-base text-white/55">Where would you like to go?</p>

      {dropoffKeys.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-white/40 text-base">
          Go back and complete your pick-up location first.
        </div>
      ) : (
        <>
          <div className={`grid gap-3 ${dropoffKeys.length <= 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
            {dropoffKeys.map(key => {
              const opt = DROPOFF_OPTIONS[key];
              return (
                <button key={key} type="button"
                  onClick={() => setMany({ dropoffRegion: key, dropoffAddress: "" })}
                  className={cardCls(form.dropoffRegion === key)}>
                  <span className="text-2xl flex-shrink-0">{opt.emoji}</span>
                  <div>
                    <div className="font-bold text-base">{opt.name}</div>
                    <div className="text-xs opacity-70 mt-0.5">{opt.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.dropoffRegion && <p className="text-sm text-red-300">{errors.dropoffRegion}</p>}

          {/* Address input for hotel / city destinations */}
          {currentDropoff?.needsAddress && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-base font-semibold text-white/90">
                  {currentDropoff.addressLabel} <span className="text-red-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setMapTarget("dropoff")}
                  className="text-xs text-[#3668FF] hover:text-[#2a56e0] font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  🗺️ Pick on Map
                </button>
              </div>
              <input type="text" value={form.dropoffAddress} onChange={e => set("dropoffAddress", e.target.value)}
                placeholder="e.g., Avani Pattaya Resort, 300 Beach Road..."
                className={inputCls(errors.dropoffAddress)} />
              {errors.dropoffAddress && <p className="mt-1 text-sm text-red-300">{errors.dropoffAddress}</p>}
              <p className="mt-1.5 text-xs text-white/40">
                Helps the driver navigate accurately with GPS.
              </p>
            </motion.div>
          )}

          {/* Bangkok zone notice */}
          {(form.dropoffRegion === "hotel_bkk" || form.dropoffRegion === "bkk_area") && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-amber-400/10 border border-amber-400/25 rounded-xl p-3 text-sm text-amber-200/80 leading-relaxed">
              <span className="font-bold text-amber-300">Note:</span> Rates cover central Bangkok hotels.
              For outer districts (e.g., Min Buri, Nong Chok, Thawi Watthana), an additional surcharge may apply.
              Our team will confirm this when we contact you.
            </motion.div>
          )}
        </>
      )}
    </div>
  );

  const renderStep3 = () => {
    const hasAirport =
      form.pickupRegion === "don_mueang" ||
      form.pickupRegion === "suvarnabhumi" ||
      form.dropoffRegion === "don_mueang" ||
      form.dropoffRegion === "suvarnabhumi";

    return (
      <div className="space-y-6">
        {/* Vehicle type */}
        <div>
          <label className="block text-base font-semibold text-white/90 mb-3">Vehicle Type</label>
          <div className="grid grid-cols-3 gap-3">
            {VEHICLE_TYPES.map(v => (
              <button key={v.id} type="button"
                onClick={() => set("vehicleType", v.id)}
                className={`flex flex-col items-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  form.vehicleType === v.id
                    ? "bg-[#3668FF] border-[#3668FF] text-white shadow-lg shadow-blue-500/20"
                    : "bg-black/20 border-white/10 text-white/75 hover:border-white/25"
                }`}>
                <span className="text-2xl mb-2">{v.emoji}</span>
                <div className="font-bold text-base">{v.name}</div>
                <div className="text-xs opacity-60 mt-0.5">{v.capacity}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Driver preference */}
        <div>
          <label className="block text-base font-semibold text-white/90 mb-3">Driver Preference</label>
          <div className="grid grid-cols-2 gap-3">
            {DRIVER_TYPES.map(d => (
              <button key={d.id} type="button"
                onClick={() => set("driverType", d.id)}
                className={cardCls(form.driverType === d.id)}>
                <span className="text-2xl">{d.emoji}</span>
                <div>
                  <div className="font-bold text-base">{d.name}</div>
                  <div className="text-xs opacity-70 mt-0.5">{d.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Flight Info (Conditional) */}
        {hasAirport && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <label className="block text-base font-semibold text-white/90">
              Flight Number <span className="text-white/40 text-sm font-normal">(optional but highly recommended)</span>
            </label>
            <input
              type="text"
              value={form.flightNumber}
              onChange={e => set("flightNumber", e.target.value.toUpperCase())}
              placeholder="e.g., TG 413, FD 3201"
              className={inputCls()}
            />
            <p className="text-xs text-white/45">Helps our driver monitor your flight status in case of delays.</p>
          </motion.div>
        )}

        {/* Luggage Details */}
        <div className="space-y-3">
          <label className="block text-base font-semibold text-white/90">Luggage Information</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/10 rounded-2xl">
              <div className="text-left">
                <span className="text-sm font-semibold text-white/80 block">Large Luggage</span>
                <span className="text-[10px] text-white/40 block">24" or larger (e.g. check-in bags)</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => set("largeLuggage", Math.max(0, form.largeLuggage - 1))}
                  className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer select-none"
                >
                  -
                </button>
                <span className="text-sm font-bold w-4 text-center text-white">{form.largeLuggage}</span>
                <button
                  type="button"
                  onClick={() => set("largeLuggage", form.largeLuggage + 1)}
                  className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer select-none"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/10 rounded-2xl">
              <div className="text-left">
                <span className="text-sm font-semibold text-white/80 block">Small Luggage</span>
                <span className="text-[10px] text-white/40 block">Hand-carry / backpack</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => set("smallLuggage", Math.max(0, form.smallLuggage - 1))}
                  className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer select-none"
                >
                  -
                </button>
                <span className="text-sm font-bold w-4 text-center text-white">{form.smallLuggage}</span>
                <button
                  type="button"
                  onClick={() => set("smallLuggage", form.smallLuggage + 1)}
                  className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer select-none"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          
          
        </div>

        {/* Special Requests */}
        <div className="space-y-3">
          <label className="block text-base font-semibold text-white/90">Special Requests</label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                const updated = !form.hasBabySeat;
                setMany({
                  hasBabySeat: updated,
                  babySeatCount: updated ? 1 : 0
                });
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                form.hasBabySeat
                  ? "bg-[#3668FF]/20 border-[#3668FF] text-white"
                  : "bg-black/20 border-white/10 text-white/60 hover:border-white/20"
              }`}
            >
              🍼 Baby / Child Seat
            </button>
            <button
              type="button"
              onClick={() => set("hasElderlyCare", !form.hasElderlyCare)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                form.hasElderlyCare
                  ? "bg-[#3668FF]/20 border-[#3668FF] text-white"
                  : "bg-black/20 border-white/10 text-white/60 hover:border-white/20"
              }`}
            >
              👵 Elderly / Special Accessibility
            </button>
            
          </div>

          {/* Baby seat counter */}
          {form.hasBabySeat && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-3 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-between max-w-xs">
              <span className="text-xs font-semibold text-white/70">Number of Baby Seats:</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => set("babySeatCount", Math.max(1, form.babySeatCount - 1))}
                  className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer select-none"
                >
                  -
                </button>
                <span className="text-sm font-bold w-4 text-center text-white">{form.babySeatCount}</span>
                <button
                  type="button"
                  onClick={() => set("babySeatCount", form.babySeatCount + 1)}
                  className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer select-none"
                >
                  +
                </button>
              </div>
            </motion.div>
          )}

         
        </div>

        {/* Additional notes */}
        <div>
          <label className="block text-base font-semibold text-white/90 mb-2">
            Additional Notes / Requests{" "}
            <span className="text-white/40 text-sm font-normal">(optional)</span>
          </label>
          <textarea value={form.additionalDetails} onChange={e => set("additionalDetails", e.target.value)}
            rows={3} placeholder="Flight terminal, specific vehicle instructions, or anything else..."
            className={inputCls()} />
        </div>

        <div className="h-px bg-white/10" />

        {/* WhatsApp success */}
        {submitType === "whatsapp" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 text-white">
            <p className="font-bold text-base mb-1.5">✅ WhatsApp Booking Initiated</p>
            <p className="text-white/60 text-sm mb-3">If the app did not open, use the button below to retry.</p>
            <div className="flex gap-2">
              <a href={`https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(compileMessage())}`}
                target="_blank" rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors">
                Retry WhatsApp
              </a>
              <button type="button" onClick={() => setSubmitType(null)}
                className="border border-white/20 hover:bg-white/10 text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer">
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        {/* Booking channel buttons */}
        <div>
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-white/50 mb-3">
            Select a booking channel
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button type="button" onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 rounded-xl font-bold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.488 2.01 14.041.986 11.666.986c-5.439 0-9.866 4.372-9.87 9.802 0 1.63.463 3.224 1.34 4.625l-1.005 3.676 3.771-.978zm12.251-7.22c-.1-.168-.369-.269-.773-.47s-2.386-1.178-2.756-1.313c-.37-.134-.64-.201-.908.201s-1.042 1.313-1.277 1.582c-.235.269-.47.302-.874.1s-1.714-.63-3.265-2.015c-1.207-1.078-2.022-2.409-2.257-2.812-.236-.403-.025-.621.176-.821.18-.18.4-.47.601-.706.202-.235.269-.403.403-.672.135-.269.068-.504-.034-.706s-.908-2.185-1.244-2.992c-.328-.792-.662-.684-.908-.696-.235-.012-.504-.015-.773-.015s-.706.1-1.075.504c-.369.403-1.41 1.378-1.41 3.361s1.444 3.899 1.646 4.167c.202.269 2.843 4.342 6.89 6.082.962.414 1.714.661 2.302.849.967.308 1.848.265 2.544.161.776-.117 2.386-.975 2.723-1.916.336-.941.336-1.748.235-1.916z" />
              </svg>
              WhatsApp Booking
            </button>
            <button type="button" onClick={handleEmail}
              className="w-full flex items-center justify-center gap-2.5 bg-white text-gray-900 py-3.5 rounded-xl font-bold transition-all cursor-pointer hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Email Booking
            </button>
          </div>
        </div>
      </div>
    );
  };

  const stepRenderers = [renderStep0, renderStep1, renderStep2, renderStep3];

  // ── Main render ─────────────────────────────────────────────────────────
  return (
    <section id="booking" className="relative w-full bg-transparent overflow-hidden scroll-mt-20">
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16 py-16 md:py-20 xl:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-start">

          {/* ── LEFT: info panel (sticky on desktop) ───────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-[38%] text-white lg:sticky lg:top-28"
          >
            <span className="text-[#4adebc] font-bold tracking-wider text-sm uppercase mb-3 block">Easy Booking</span>
            <h2 className="text-4xl sm:text-5xl font-semibold leading-tight mb-6">Book Your Ride</h2>

            {/* Dynamic step description */}
            <AnimatePresence mode="wait">
              <motion.div key={step}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mb-8"
              >
                <p className="text-[#4adebc] font-semibold text-base mb-1">Step {step + 1} of {STEPS.length}</p>
                <h3 className="text-white text-2xl font-bold mb-2">{STEP_INFO[step].title}</h3>
                <p className="text-white/65 text-base leading-relaxed">{STEP_INFO[step].body}</p>
              </motion.div>
            </AnimatePresence>

            {/* Progress indicator */}
            <div className="flex items-center">
              {STEPS.map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-400 ${
                    i < step  ? "bg-[#4adebc] border-[#4adebc] text-black"
                    : i === step ? "bg-[#3668FF] border-[#3668FF] text-white shadow-lg shadow-blue-500/30"
                    : "bg-transparent border-white/20 text-white/35"
                  }`}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 w-8 transition-all duration-400 ${i < step ? "bg-[#4adebc]" : "bg-white/15"}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Live booking summary */}
            {step >= 1 && (form.customerName || form.pickupRegion) && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-white/[0.04] rounded-2xl p-4 border border-white/10 space-y-2 text-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-white/30 mb-3">Your booking so far</p>
                {form.customerName && <div className="flex gap-2.5 text-white/80"><span className="text-white/35 w-4">👤</span>{form.customerName}</div>}
                {form.phone        && <div className="flex gap-2.5 text-white/80"><span className="text-white/35 w-4">📞</span>{form.phone}</div>}
                {form.travelDate   && <div className="flex gap-2.5 text-white/80"><span className="text-white/35 w-4">📅</span>{form.travelDate}{form.travelTime ? ` at ${form.travelTime}` : ""}</div>}
                {pickupLabel       && <div className="flex gap-2.5 text-white/80"><span className="text-white/35 w-4">📍</span>{pickupLabel}</div>}
                {dropoffLabel      && <div className="flex gap-2.5 text-white/80"><span className="text-white/35 w-4">🏁</span>{dropoffLabel}</div>}
                {form.flightNumber && <div className="flex gap-2.5 text-white/80"><span className="text-white/35 w-4">✈️</span>{form.flightNumber}</div>}
                {(form.largeLuggage > 0 || form.smallLuggage > 0 || form.hasGolfBag || form.hasSurfboard || form.hasStroller || form.hasWheelchair) && (
                  <div className="flex gap-2.5 text-white/80">
                    <span className="text-white/35 w-4">💼</span>
                    <span>
                      {form.largeLuggage}L, {form.smallLuggage}S
                      {form.hasGolfBag && " + Golf"}
                      {form.hasSurfboard && " + Surf"}
                      {form.hasStroller && " + Stroller"}
                      {form.hasWheelchair && " + Wheelchair"}
                    </span>
                  </div>
                )}
                {(form.hasBabySeat || form.hasElderlyCare || form.hasStopover) && (
                  <div className="flex gap-2.5 text-white/80">
                    <span className="text-white/35 w-4">✨</span>
                    <span>
                      {form.hasBabySeat && `Baby Seat (${form.babySeatCount}) `}
                      {form.hasElderlyCare && "Elderly Care "}
                      {form.hasStopover && "Stopover"}
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Clear button if form is dirty */}
            {isFormDirty && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/10 hover:border-red-500/30 bg-red-500/5 hover:bg-red-500/10"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear all details
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* ── RIGHT: form card ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[62%] bg-black/25 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Step tab bar */}
            <div className="flex border-b border-white/10">
              {STEPS.map((label, i) => (
                <div key={i} className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider transition-colors duration-300 select-none ${
                  i === step  ? "text-white bg-white/[0.04]"
                  : i < step  ? "text-[#4adebc]"
                  : "text-white/20"
                }`}>
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </div>
              ))}
            </div>

            {/* Step content with animated transition */}
            <div className="p-6 sm:p-8 md:p-10">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {stepRenderers[step]()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation row */}
              <div className={`flex mt-8 pt-6 border-t border-white/10 ${step > 0 ? "justify-between" : "justify-end"}`}>
                {step > 0 && (
                  <button type="button" onClick={goBack}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-white/65 hover:bg-white/5 hover:text-white text-sm font-semibold transition-all cursor-pointer">
                    ← Back
                  </button>
                )}
                {step < STEPS.length - 1 && (
                  <button type="button" onClick={goNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3668FF] hover:bg-[#2a56e0] text-white text-sm font-bold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]">
                    Continue →
                  </button>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
      <EmailModal />
      <AnimatePresence>
        {mapTarget && (
          <MapPickerModal
            title={mapTarget === "pickup" ? "Select Pick-up Location" : "Select Drop-off Location"}
            onClose={() => setMapTarget(null)}
            onSelect={handleSelectAddress}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
