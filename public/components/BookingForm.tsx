"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import GlareHover from "./GlareHover";
import { useLanguage } from "../context/LanguageContext";
import {
  User,
  Baby,
  Briefcase,
  Plane,
  FileText,
  UserCheck,
} from "lucide-react";

// ── Config ──────────────────────────────────────────────────────────────────
const CONTACT_WHATSAPP = "66624494253";
const CONTACT_EMAIL = "Taxisaverthailand@gmail.com";

// ── Types ───────────────────────────────────────────────────────────────────
type PickupKey = "don_mueang" | "suvarnabhumi" | "upcountry" | "hotel_bkk";
type DropoffKey = "don_mueang" | "suvarnabhumi" | "hotel_bkk" | "bkk_area" | "pattaya" | "hua_hin";
type UpcountryCity = "pattaya" | "hua_hin";
type VehicleType = "sedan_s" | "sedan_m" | "sedan_l" | "suv" | "van";
type DriverType = "general" | "women";

interface FormData {
  customerName: string;
  phone: string;
  phoneCountryCode: string;
  email: string;
  travelDate: string;
  travelTime: string;
  pickupRegion: PickupKey | null;
  pickupUpcountryCity: UpcountryCity | null;
  pickupHotelName: string;
  pickupMapUrl?: string;
  dropoffRegion: DropoffKey | null;
  dropoffAddress: string;
  dropoffMapUrl?: string;
  vehicleType: VehicleType;
  driverType: DriverType;
  additionalDetails: string;
  hasSelectedVehicle: boolean;
  adults: number;
  children: number;

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
const PICKUP_OPTIONS: { id: PickupKey; name: string; desc: string; image: string }[] = [
  { id: "don_mueang", name: "Don Mueang Airport", desc: "International Airport (DMK)", image: "/images/book-card/don-mueang.webp" },
  { id: "suvarnabhumi", name: "Suvarnabhumi Airport", desc: "International Airport (BKK)", image: "/images/book-card/suvarnabhumi.webp" },
  { id: "upcountry", name: "Upcountry", desc: "Pattaya · Hua Hin", image: "/images/book-card/upcountry.webp" },
  { id: "hotel_bkk", name: "Bangkok City", desc: "Any hotel or location in Bangkok", image: "/images/book-card/hotel-bkk.webp" },
];

const UPCOUNTRY_CITIES: { id: UpcountryCity; name: string }[] = [
  { id: "pattaya", name: "Pattaya" },
  { id: "hua_hin", name: "Hua Hin" },
];

type DropoffOption = { name: string; desc: string; image: string; needsAddress: boolean; addressLabel: string };

const DROPOFF_OPTIONS: Record<DropoffKey, DropoffOption> = {
  don_mueang: { name: "Don Mueang Airport", desc: "DMK International Airport", image: "/images/book-card/don-mueang.webp", needsAddress: false, addressLabel: "" },
  suvarnabhumi: { name: "Suvarnabhumi Airport", desc: "BKK International Airport", image: "/images/book-card/suvarnabhumi.webp", needsAddress: false, addressLabel: "" },
  hotel_bkk: { name: "Bangkok City", desc: "Specify hotel name or address", image: "/images/book-card/hotel-bkk.webp", needsAddress: true, addressLabel: "Hotel name or address in Bangkok" },
  bkk_area: { name: "Bangkok Area", desc: "Hotel or area in Bangkok", image: "/images/book-card/bkk-area.webp", needsAddress: true, addressLabel: "Hotel name or address in Bangkok" },
  pattaya: { name: "Pattaya", desc: "Hotel or address in Pattaya", image: "/images/book-card/pattaya.webp", needsAddress: true, addressLabel: "Hotel name or address in Pattaya" },
  hua_hin: { name: "Hua Hin", desc: "Hotel or address in Hua Hin", image: "/images/book-card/hua-hin.webp", needsAddress: true, addressLabel: "Hotel name or address in Hua Hin" },
};

const DROPOFF_MAP: Record<PickupKey, DropoffKey[]> = {
  don_mueang: ["hotel_bkk", "pattaya", "hua_hin"],
  suvarnabhumi: ["hotel_bkk", "pattaya", "hua_hin"],
  upcountry: ["bkk_area", "don_mueang", "suvarnabhumi"],
  hotel_bkk: ["pattaya", "hua_hin"],
};

const VEHICLE_TYPES = [
  { id: "sedan_s" as VehicleType, name: "Sedan S", capacity: "1–3 passengers" },
  { id: "sedan_m" as VehicleType, name: "Sedan M", capacity: "1–3 passengers" },
  { id: "sedan_l" as VehicleType, name: "Sedan L", capacity: "1–3 passengers" },
  { id: "suv" as VehicleType, name: "SUV", capacity: "3–6 passengers" },
  { id: "van" as VehicleType, name: "Van", capacity: "4-6 passengers" },
];

const DRIVER_TYPES = [
  { id: "general" as DriverType, name: "General Driver", desc: "Any professional driver" },
  { id: "women" as DriverType, name: "Women Driver", desc: "Female driver only" },
];

import routeData from "../route.json";

// ── Full route pricing table ─────────────────────────────────────────────────
// Route key encodes the canonical route (order-independent where prices match)
type RouteKey =
  | "pattaya_bkk_airport"   // Pattaya ↔ Suvarnabhumi (BKK)
  | "pattaya_bkk_city"      // Pattaya ↔ Bangkok city / hotel
  | "pattaya_dmk"           // Pattaya ↔ Don Mueang (DMK)
  | "bkk_airport_huahin"    // Suvarnabhumi ↔ Hua Hin
  | "pattaya_huahin"        // Pattaya ↔ Hua Hin
  | "dmk_huahin"            // Don Mueang ↔ Hua Hin
  | "bkk_city_huahin"       // Bangkok city / hotel ↔ Hua Hin
  | "dmk_bkk_city"          // Don Mueang → Bangkok City
  | "bkk_airport_city";     // Suvarnabhumi → Bangkok City

const ROUTE_PRICES: Record<VehicleType, Record<RouteKey, number>> = {} as any;
const ROUTE_LABELS: Record<RouteKey, { from: string; to: string }> = {} as any;

routeData.routes.forEach((r: any) => {
  const key = r.id as RouteKey;
  ROUTE_LABELS[key] = { from: r.from, to: r.to };
  Object.keys(r.prices).forEach((vType) => {
    const vt = vType as VehicleType;
    if (!ROUTE_PRICES[vt]) {
      ROUTE_PRICES[vt] = {} as any;
    }
    ROUTE_PRICES[vt][key] = r.prices[vType];
  });
});

// Derive the canonical route key from the selected pickup / dropoff pair.
// Returns null when no fixed price is defined for this combo.
function getRouteKey(pickup: string | null, dropoff: string | null): RouteKey | null {
  if (!pickup || !dropoff) return null;

  // Normalise upcountry → use the sub-city stored in form (handled by caller)
  const p = pickup;
  const d = dropoff;

  // Airport → Bangkok City
  if (p === "don_mueang" && (d === "hotel_bkk" || d === "bkk_area")) return "dmk_bkk_city";
  if (p === "suvarnabhumi" && (d === "hotel_bkk" || d === "bkk_area")) return "bkk_airport_city";

  // Pattaya ↔ Suvarnabhumi airport
  if ((p === "upcountry" && d === "suvarnabhumi") || (p === "suvarnabhumi" && d === "pattaya")) return "pattaya_bkk_airport";
  // Pattaya ↔ Don Mueang airport
  if ((p === "upcountry" && d === "don_mueang") || (p === "don_mueang" && d === "pattaya")) return "pattaya_dmk";
  // Pattaya ↔ Bangkok city / hotel
  if ((p === "upcountry" && (d === "hotel_bkk" || d === "bkk_area")) ||
    ((p === "hotel_bkk") && d === "pattaya")) return "pattaya_bkk_city";

  // ── Hua Hin routes ──
  if (d === "hua_hin" || p === "upcountry") {
    // pickup = airport / city, dropoff = hua_hin
    if (p === "suvarnabhumi" && d === "hua_hin") return "bkk_airport_huahin";
    if (p === "don_mueang" && d === "hua_hin") return "dmk_huahin";
    if ((p === "hotel_bkk") && d === "hua_hin") return "bkk_city_huahin";
    // pickup = hua_hin (upcountry), dropoff = airport / city
    if (p === "upcountry" && d === "hua_hin") return "pattaya_huahin";
  }
  // Reverse: pickup = upcountry (Hua Hin city) — not currently in DROPOFF_MAP but future-proof
  if (p === "suvarnabhumi" && d === "hua_hin") return "bkk_airport_huahin";
  if (p === "don_mueang" && d === "hua_hin") return "dmk_huahin";
  if ((p === "hotel_bkk" || p === "bkk_area") && d === "hua_hin") return "bkk_city_huahin";

  return null;
}

// Convenience: get price for current form selections
function getPrice(pickup: string | null, dropoff: string | null, pickupCity: string | null, vehicle: VehicleType): { routeKey: RouteKey; price: number } | null {
  // For upcountry pickup we need to know which city was selected
  let effectivePickup = pickup;
  if (pickup === "upcountry" && pickupCity === "hua_hin") {
    // Hua Hin upcountry → treat same as bkk_city route to dropoff
    // (not currently reachable in form flow but kept consistent)
    effectivePickup = "upcountry_huahin";
  }
  // For upcountry pickup with pattaya city, use "upcountry" as normal
  const key = getRouteKey(effectivePickup, dropoff);
  if (!key) return null;
  return { routeKey: key, price: ROUTE_PRICES[vehicle][key] };
}

// ── Animation variants ──────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
  exit: (dir: number) => ({ x: dir < 0 ? 48 : -48, opacity: 0, transition: { duration: 0.2 } }),
};

// ── Helpers ─────────────────────────────────────────────────────────────────
const inputCls = (err?: string) =>
  `w-full bg-slate-50 border ${err ? "border-red-500" : "border-slate-200"} text-slate-900 rounded-xl px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:border-[#3668FF] focus:ring-2 focus:ring-[#3668FF]/15 transition-all text-sm`;

const cardCls = (selected: boolean) =>
  `flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${selected
    ? "bg-blue-50/50 border-[#3668FF] shadow-[0_0_12px_rgba(54,104,255,0.08)] text-[#3668FF]"
    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
  }`;

const STORAGE_KEY_FORM = "taxisaver_booking_form";
const STORAGE_KEY_STEP = "taxisaver_booking_step";

const DEFAULT_FORM: FormData = {
  customerName: "",
  phone: "",
  phoneCountryCode: "+66",
  email: "",
  travelDate: "",
  travelTime: "",
  pickupRegion: null,
  pickupUpcountryCity: null,
  pickupHotelName: "",
  pickupMapUrl: "",
  dropoffRegion: null,
  dropoffAddress: "",
  dropoffMapUrl: "",
  vehicleType: "sedan_s",
  driverType: "general",
  additionalDetails: "",
  hasSelectedVehicle: false,
  adults: 1,
  children: 0,
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
  const { language, t } = useLanguage();
  const STEPS = [t.step1, t.step2, t.step3, t.step4, t.step5];

  const STEP_INFO = [
    { title: t.step1Title, body: t.step1Body },
    { title: t.step2Title, body: t.step2Body },
    { title: t.step3Title, body: t.step3Body },
    { title: t.step4Title, body: t.step4Body },
    { title: t.step5Title, body: t.step5Body },
  ];

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitType, setSubmitType] = useState<"whatsapp" | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<"filling" | "success">("filling");
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [isLoaded, setIsLoaded] = useState(false);
  const [todayStr, setTodayStr] = useState("");
  const [isCustomCc, setIsCustomCc] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const hasAirport =
    form.pickupRegion === "don_mueang" ||
    form.pickupRegion === "suvarnabhumi" ||
    form.dropoffRegion === "don_mueang" ||
    form.dropoffRegion === "suvarnabhumi";

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedForm = localStorage.getItem(STORAGE_KEY_FORM);
      if (savedForm) {
        const parsed = JSON.parse(savedForm);
        setForm({ ...DEFAULT_FORM, ...parsed });

        const predefinedCodes = ["+66", "+65", "+60", "+62", "+63", "+84", "+86", "+852", "+886", "+81", "+82", "+91", "+61", "+44", "+1", "+49", "+33", "+7"];
        if (parsed.phoneCountryCode && !predefinedCodes.includes(parsed.phoneCountryCode)) {
          setIsCustomCc(true);
        }
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

    // Set today's date string
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    setTodayStr(`${yyyy}-${mm}-${dd}`);

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

  // Clear flight number if airport is deselected
  useEffect(() => {
    if (!hasAirport && form.flightNumber) {
      set("flightNumber", "");
    }
  }, [hasAirport, form.flightNumber]);

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
    setShowClearModal(true);
  };

  const confirmReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_FORM);
      localStorage.removeItem(STORAGE_KEY_STEP);
    } catch (e) {
      console.error("Failed to clear localStorage", e);
    }
    setForm(DEFAULT_FORM);
    setStep(0);
    setErrors({});
    setShowClearModal(false);
    showToast("Booking details cleared successfully!", "success");
  };

  // ── Clear details confirmation modal ──────────────────────────────────────
  const ClearConfirmModal = () => (
    <AnimatePresence>
      {showClearModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backdropFilter: "blur(12px)", backgroundColor: "rgba(0,0,0,0.55)" }}
          onClick={() => setShowClearModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-3xl p-7 w-full max-w-sm shadow-2xl text-center select-none"
          >
            {/* Warning Icon */}
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans">
              {language === "th" ? "ล้างข้อมูลการจอง?" : "Clear Booking Details?"}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 font-sans">
              {language === "th"
                ? "คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลการจองทั้งหมดที่ระบุไว้? การกระทำนี้ไม่สามารถย้อนกลับได้"
                : "Are you sure you want to clear all entered booking details? This action cannot be undone."}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm transition-all cursor-pointer"
              >
                {language === "th" ? "ยกเลิก" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={confirmReset}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all cursor-pointer shadow-lg shadow-red-600/10"
              >
                {language === "th" ? "ล้างทั้งหมด" : "Clear All"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const isFormDirty = Object.keys(form).some(k => {
    const key = k as keyof FormData;
    return form[key] !== DEFAULT_FORM[key];
  });


  // Single field updater
  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => {
      const next = { ...prev, [key]: "" };
      if (key === "largeLuggage" || key === "smallLuggage") {
        next.luggage = "";
      }
      return next;
    });
  };

  // Multi-field updater
  const setMany = (updates: Partial<FormData>) => {
    setForm(prev => ({ ...prev, ...updates }));
    setErrors({});
  };

  // ── Derived values ───────────────────────────────────────────────────────
  const dropoffKeys: DropoffKey[] = form.pickupRegion ? DROPOFF_MAP[form.pickupRegion] : [];
  const currentDropoff = form.dropoffRegion ? DROPOFF_OPTIONS[form.dropoffRegion] : null;

  const getPickupName = (id: PickupKey) => {
    if (language === "th") {
      switch (id) {
        case "don_mueang": return "สนามบินดอนเมือง";
        case "suvarnabhumi": return "สนามบินสุวรรณภูมิ";
        case "upcountry": return "ต่างจังหวัด";
        case "hotel_bkk": return "กรุงเทพฯ (ตัวเมือง)";
        default: return id;
      }
    }
    switch (id) {
      case "don_mueang": return "Don Mueang Airport";
      case "suvarnabhumi": return "Suvarnabhumi Airport";
      case "upcountry": return "Upcountry";
      case "hotel_bkk": return "Bangkok City";
      default: return id;
    }
  };

  const getPickupDesc = (id: PickupKey) => {
    if (language === "th") {
      switch (id) {
        case "don_mueang": return "สนามบินนานาชาติดอนเมือง (DMK)";
        case "suvarnabhumi": return "สนามบินนานาชาติสุวรรณภูมิ (BKK)";
        case "upcountry": return "พัทยา · หัวหิน ";
        case "hotel_bkk": return "โรงแรมหรือสถานที่ส่งในกรุงเทพฯ";
        default: return "";
      }
    }
    switch (id) {
      case "don_mueang": return "International Airport (DMK)";
      case "suvarnabhumi": return "International Airport (BKK)";
      case "upcountry": return "Pattaya · Hua Hin (To Bangkok / Driver starts from Bangkok)";
      case "hotel_bkk": return "Any hotel or location in Bangkok";
      default: return "";
    }
  };

  const getCityName = (id: UpcountryCity) => {
    if (language === "th") {
      switch (id) {
        case "pattaya": return "พัทยา";
        case "hua_hin": return "หัวหิน";
        default: return id;
      }
    }
    switch (id) {
      case "pattaya": return "Pattaya";
      case "hua_hin": return "Hua Hin";
      default: return id;
    }
  };

  const getDropoffName = (id: DropoffKey) => {
    if (language === "th") {
      switch (id) {
        case "don_mueang": return "สนามบินดอนเมือง";
        case "suvarnabhumi": return "สนามบินสุวรรณภูมิ";
        case "hotel_bkk": return "กรุงเทพฯ (ตัวเมือง)";
        case "bkk_area": return "กรุงเทพฯ (ตัวเมือง)";
        case "pattaya": return "พัทยา";
        case "hua_hin": return "หัวหิน";
        default: return id;
      }
    }
    switch (id) {
      case "don_mueang": return "Don Mueang Airport";
      case "suvarnabhumi": return "Suvarnabhumi Airport";
      case "hotel_bkk": return "Bangkok City";
      case "bkk_area": return "Bangkok Area";
      case "pattaya": return "Pattaya";
      case "hua_hin": return "Hua Hin";
      default: return id;
    }
  };

  const getDropoffDesc = (id: DropoffKey) => {
    if (language === "th") {
      switch (id) {
        case "don_mueang": return "สนามบินดอนเมือง (DMK)";
        case "suvarnabhumi": return "สนามบินสุวรรณภูมิ (BKK)";
        case "hotel_bkk": return "ระบุชื่อโรงแรมหรือสถานที่ส่ง";
        case "bkk_area": return "โรงแรมหรือสถานที่ส่งในกรุงเทพฯ";
        case "pattaya": return "โรงแรมหรือสถานที่ส่งในพัทยา";
        case "hua_hin": return "โรงแรมหรือสถานที่ส่งในหัวหิน";
        default: return "";
      }
    }
    switch (id) {
      case "don_mueang": return "DMK International Airport";
      case "suvarnabhumi": return "BKK International Airport";
      case "hotel_bkk": return "Specify hotel name or address";
      case "bkk_area": return "Hotel or area in Bangkok";
      case "pattaya": return "Hotel or address in Pattaya";
      case "hua_hin": return "Hotel or address in Hua Hin";
      default: return "";
    }
  };

  const getDropoffAddressLabel = (id: DropoffKey) => {
    if (language === "th") {
      switch (id) {
        case "hotel_bkk": return "ชื่อโรงแรมหรือที่อยู่ในกรุงเทพฯ";
        case "bkk_area": return "ชื่อโรงแรมหรือที่อยู่ในกรุงเทพฯ";
        case "pattaya": return "ชื่อโรงแรมหรือที่อยู่ในพัทยา";
        case "hua_hin": return "ชื่อโรงแรมหรือที่อยู่ในหัวหิน";
        default: return "โรงแรมหรือที่อยู่ปลายทาง";
      }
    }
    switch (id) {
      case "hotel_bkk": return "Hotel name or address in Bangkok";
      case "bkk_area": return "Hotel name or address in Bangkok";
      case "pattaya": return "Hotel name or address in Pattaya";
      case "hua_hin": return "Hotel name or address in Hua Hin";
      default: return "Destination Hotel or Address";
    }
  };

  const pickupLabel = (() => {
    if (!form.pickupRegion) return "";
    if (form.pickupRegion === "upcountry" && form.pickupUpcountryCity) {
      const cityName = getCityName(form.pickupUpcountryCity);
      return form.pickupHotelName.trim() ? `${cityName} — ${form.pickupHotelName.trim()}` : cityName;
    }
    if (form.pickupRegion === "hotel_bkk") {
      const regionName = getPickupName("hotel_bkk");
      return form.pickupHotelName ? `${regionName} — ${form.pickupHotelName}` : regionName;
    }
    return getPickupName(form.pickupRegion);
  })();

  const dropoffLabel = (() => {
    if (!form.dropoffRegion) return "";
    const name = getDropoffName(form.dropoffRegion);
    const needsAddress = DROPOFF_OPTIONS[form.dropoffRegion].needsAddress;
    return needsAddress && form.dropoffAddress ? `${name} — ${form.dropoffAddress}` : name;
  })();

  // ── Message compiler ────────────────────────────────────────────────────
  const compileMessage = () => {
    const isTh = language === "th";

    // ── Vehicle labels ──────────────────────────────────────────────────
    const vehicleLabels: Record<VehicleType, string> = isTh ? {
      sedan_s: "Sedan S (1–3 ผู้โดยสาร)",
      sedan_m: "Sedan M (1–3 ผู้โดยสาร)",
      sedan_l: "Sedan L (1–3 ผู้โดยสาร)",
      suv: "SUV (1–4 ผู้โดยสาร)",
      van: "Van (5–9 ผู้โดยสาร)",
    } : {
      sedan_s: "Sedan S (1–3 passengers)",
      sedan_m: "Sedan M (1–3 passengers)",
      sedan_l: "Sedan L (1–3 passengers)",
      suv: "SUV (1–4 passengers)",
      van: "Van (5–9 passengers)",
    };
    const vehicle = vehicleLabels[form.vehicleType];
    const driver = isTh
      ? (form.driverType === "women" ? "คนขับหญิง" : "คนขับทั่วไป")
      : (form.driverType === "women" ? "Women Driver" : "General Driver");

    // ── Luggage ─────────────────────────────────────────────────────────
    let luggageParts: string[] = [];
    if (isTh) {
      if (form.largeLuggage > 0) luggageParts.push(`${form.largeLuggage} ใบใหญ่`);
      if (form.smallLuggage > 0) luggageParts.push(`${form.smallLuggage} ใบเล็ก`);
    } else {
      if (form.largeLuggage > 0) luggageParts.push(`${form.largeLuggage} Large`);
      if (form.smallLuggage > 0) luggageParts.push(`${form.smallLuggage} Small`);
    }
    const luggageStr = luggageParts.length > 0 ? luggageParts.join(", ") : (isTh ? "ไม่มี" : "None");

    // ── Oversized items ─────────────────────────────────────────────────
    let oversizedList: string[] = [];
    if (isTh) {
      if (form.hasGolfBag) oversizedList.push("ถุงกอล์ฟ");
      if (form.hasSurfboard) oversizedList.push("กระดานโต้คลื่น");
      if (form.hasStroller) oversizedList.push("รถเข็นเด็ก");
      if (form.hasWheelchair) oversizedList.push("วีลแชร์");
    } else {
      if (form.hasGolfBag) oversizedList.push("Golf Bag");
      if (form.hasSurfboard) oversizedList.push("Surfboard");
      if (form.hasStroller) oversizedList.push("Stroller");
      if (form.hasWheelchair) oversizedList.push("Wheelchair");
    }
    const oversizedStr = oversizedList.length > 0 ? oversizedList.join(", ") : "";

    // ── Special Requests ────────────────────────────────────────────────
    let specialList: string[] = [];
    if (isTh) {
      if (form.hasBabySeat) specialList.push(`คาร์ซีทเด็ก (${form.babySeatCount})`);
      if (form.hasElderlyCare) specialList.push("บริการดูแลผู้สูงอายุ");
      if (form.hasStopover) specialList.push(`แวะพัก: ${form.stopoverDetails}`);
    } else {
      if (form.hasBabySeat) specialList.push(`Baby Seat (${form.babySeatCount})`);
      if (form.hasElderlyCare) specialList.push("Elderly/Easy-access Care");
      if (form.hasStopover) specialList.push(`Stopover: ${form.stopoverDetails}`);
    }
    const specialStr = specialList.length > 0 ? specialList.join(", ") : "";

    // ── Estimated price ─────────────────────────────────────────────────
    const priceResult = getPrice(form.pickupRegion, form.dropoffRegion, form.pickupUpcountryCity, form.vehicleType);
    const priceStr = priceResult
      ? `฿${priceResult.price.toLocaleString()} (${ROUTE_LABELS[priceResult.routeKey].from} → ${ROUTE_LABELS[priceResult.routeKey].to}${ isTh ? " รวมค่าทางด่วนทั้งหมด" : ", all tolls included"})`
      : (isTh ? "จะยืนยันภายหลัง" : "To be confirmed");

    // ── Build message ───────────────────────────────────────────────────
    let msg: string;
    if (isTh) {
      msg = `สวัสดีครับ/ค่ะ ต้องการจองรถแท็กซี่กับ Taxi Saver Thailand

👤 ชื่อ-นามสกุล: ${form.customerName}
📞 โทรศัพท์: ${form.phoneCountryCode} ${form.phone}${form.email ? `\n📧 อีเมล: ${form.email}` : ""}
📅 วันที่เดินทาง: ${form.travelDate || "ยังไม่ระบุ"}
⏰ เวลารับ: ${form.travelTime || "ยังไม่ระบุ"}
🧑‍🤝‍🧑 ผู้โดยสาร: ${form.adults} ผู้ใหญ่${form.children > 0 ? `, ${form.children} เด็ก` : ""}

📍 ต้นทาง: ${pickupLabel}${form.pickupMapUrl ? `\n🗺️ แผนที่: ${form.pickupMapUrl}` : ""}
🏁 ปลายทาง: ${dropoffLabel}${form.dropoffMapUrl ? `\n🗺️ แผนที่: ${form.dropoffMapUrl}` : ""}`;

      if (hasAirport && form.flightNumber) {
        msg += `\n✈️ เที่ยวบิน: ${form.flightNumber}`;
      }

      msg += `\n\n🚗 รถ: ${vehicle}
🧑‍✈️ คนขับ: ${driver}
💼 สัมภาระ: ${luggageStr}${oversizedStr ? ` (${oversizedStr})` : ""}
💰 ราคาประมาณ: ${priceStr}`;

      if (specialStr) {
        msg += `\n✨ ขอพิเศษ: ${specialStr}`;
      }

      if (form.additionalDetails) {
        msg += `\n📝 หมายเหตุ: ${form.additionalDetails}`;
      }
    } else {
      msg = `Hello, I'd like to book a taxi with Taxi Saver Thailand.

👤 Name: ${form.customerName}
📞 Phone: ${form.phoneCountryCode} ${form.phone}${form.email ? `\n📧 Email: ${form.email}` : ""}
📅 Date: ${form.travelDate || "Not specified"}
⏰ Time: ${form.travelTime || "Not specified"}
🧑‍🤝‍🧑 Passengers: ${form.adults} Adults${form.children > 0 ? `, ${form.children} Children` : ""}

📍 Pick-up: ${pickupLabel}${form.pickupMapUrl ? `\n🗺️ Map: ${form.pickupMapUrl}` : ""}
🏁 Drop-off: ${dropoffLabel}${form.dropoffMapUrl ? `\n🗺️ Map: ${form.dropoffMapUrl}` : ""}`;

      if (hasAirport && form.flightNumber) {
        msg += `\n✈️ Flight: ${form.flightNumber}`;
      }

      msg += `\n\n🚗 Vehicle: ${vehicle}
🧑‍✈️ Driver: ${driver}
💼 Luggage: ${luggageStr}${oversizedStr ? ` (${oversizedStr})` : ""}
💰 Est. Price: ${priceStr}`;

      if (specialStr) {
        msg += `\n✨ Special Requests: ${specialStr}`;
      }

      if (form.additionalDetails) {
        msg += `\n📝 Notes: ${form.additionalDetails}`;
      }
    }

    return msg;
  };

  // ── Validation ──────────────────────────────────────────────────────────
  const validate = (s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 0) {
      if (!form.customerName.trim()) {
        errs.customerName = language === "th" ? "กรุณาระบุชื่อ-นามสกุล" : "Full name is required.";
      }

      if (!form.phoneCountryCode || form.phoneCountryCode.trim() === "+" || form.phoneCountryCode.trim() === "") {
        errs.phone = language === "th" ? "กรุณาระบุรหัสประเทศ" : "Please specify a country code.";
      } else if (!form.phone.trim()) {
        errs.phone = language === "th" ? "กรุณาระบุเบอร์โทรศัพท์" : "Phone number is required.";
      } else {
        const digits = form.phone.replace(/\D/g, "");
        if (digits.length < 8 || digits.length > 15) {
          errs.phone = language === "th" ? "กรุณาระบุเบอร์โทรศัพท์ที่ถูกต้อง (8-15 หลัก)" : "Please enter a valid phone number (8-15 digits).";
        }
      }

      if (!form.travelDate) {
        errs.travelDate = language === "th" ? "กรุณาระบุวันที่เดินทาง" : "Travel date is required.";
      } else if (todayStr && form.travelDate < todayStr) {
        errs.travelDate = language === "th" ? "วันที่เดินทางต้องไม่เป็นวันในอดีต" : "Travel date cannot be in the past.";
      }

      if (!form.travelTime) {
        errs.travelTime = language === "th" ? "กรุณาระบุเวลาเข้ารับ" : "Pick-up time is required.";
      }
    }
    if (s === 1) {
      if (!form.pickupRegion) errs.pickupRegion = language === "th" ? "กรุณาเลือกสถานที่รับต้นทาง" : "Please select a pick-up location.";
      if (form.pickupRegion === "upcountry") {
        if (!form.pickupUpcountryCity) {
          errs.pickupUpcountryCity = language === "th" ? "กรุณาเลือกเมือง" : "Please select a city.";
        } else if (!form.pickupHotelName.trim()) {
          errs.pickupHotelName = language === "th" ? "กรุณาระบุชื่อโรงแรมหรือที่อยู่ต้นทาง" : "Please specify the pick-up hotel or address.";
        }
      }
      if (form.pickupRegion === "hotel_bkk" && !form.pickupHotelName.trim()) errs.pickupHotelName = language === "th" ? "กรุณาระบุชื่อโรงแรมหรือที่อยู่ต้นทาง" : "Please enter the hotel name or address.";
    }
    if (s === 2) {
      if (!form.dropoffRegion) errs.dropoffRegion = language === "th" ? "กรุณาเลือกจุดส่งปลายทาง" : "Please select a drop-off location.";
      if (currentDropoff?.needsAddress && !form.dropoffAddress.trim()) errs.dropoffAddress = language === "th" ? "กรุณาระบุชื่อโรงแรมหรือที่อยู่ปลายทาง" : "Please specify the hotel name or address.";
    }
    if (s === 3) {
      if (form.largeLuggage === 0 && form.smallLuggage === 0) {
        errs.luggage = language === "th" ? "กรุณาระบุจำนวนสัมภาระ อย่างน้อย 1 ใบ" : "Please specify your luggage count (at least 1 large or small luggage is required).";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => { if (!validate(step)) return; setDirection(1); setStep(s => s + 1); };
  const goBack = () => { setDirection(-1); setStep(s => s - 1); };

  // ── Submit handlers ─────────────────────────────────────────────────────
  const handleWhatsApp = () => {
    if (!validate(3)) return;
    window.open(`https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(compileMessage())}`, "_blank");
    setSubmitType("whatsapp");
    setBookingStatus("success");
  };

  const handleEmail = () => {
    if (!validate(3)) return;
    setShowEmailModal(true);
  };

  const handleDownloadReceipt = () => {
    if (!receiptRef.current) return;
    toPng(receiptRef.current, {
      cacheBust: true,
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        const safeName = form.customerName ? form.customerName.replace(/\s+/g, "-").toLowerCase() : "booking";
        link.download = `taxi-saver-receipt-${safeName}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Failed to download receipt image", err);
        alert("Unable to generate receipt image. Please try again.");
      });
  };

  const emailSubject = language === "th" ? `จองรถแท็กซี่ – ${form.customerName}` : `Taxi Booking – ${form.customerName}`;
  const getGmailUrl = () => `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(compileMessage())}`;
  const getOutlookUrl = () => `https://outlook.live.com/default.aspx?rru=compose&to=${CONTACT_EMAIL}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(compileMessage())}`;
  const getMailtoUrl = () => `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(compileMessage())}`;

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
    setBookingStatus("success");

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
    setBookingStatus("success");

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
          style={{ backdropFilter: "blur(12px)", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowEmailModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-3xl p-8 w-full max-w-sm shadow-2xl"
          >
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-slate-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 text-center mb-1">
              {language === "th" ? "ส่งทางอีเมล" : "Send via Email"}
            </h3>
            <p className="text-slate-500 text-sm text-center mb-7">
              {language === "th" ? "เลือกผู้ให้บริการอีเมลของคุณเพื่อส่งข้อมูลการจอง" : "Choose your email client to send the booking details."}
            </p>

            <div className="space-y-3">
              {/* Gmail */}
              <a
                {...getEmailLinkProps("gmail")}
                onClick={handleGmailClick}
                className="flex items-center gap-4 w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-350 text-slate-800 rounded-2xl px-5 py-4 transition-all duration-200 cursor-pointer group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EA4335] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-1.29 1.454-2.032 2.508-1.242L12 10.73l9.492-7.116c1.054-.79 2.508-.048 2.508 1.242z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold text-base">Gmail</div>
                  <div className="text-xs text-slate-500">
                    {language === "th" ? "เปิดในแอปหรือเว็บ Gmail" : "Open in Gmail app or web"}
                  </div>
                </div>
                <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 ml-auto transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>

              {/* Outlook */}
              <a
                {...getEmailLinkProps("outlook")}
                onClick={handleOutlookClick}
                className="flex items-center gap-4 w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-350 text-slate-800 rounded-2xl px-5 py-4 transition-all duration-200 cursor-pointer group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0078d4] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M7.462 0L0 1.31v21.38L7.462 24l16.538-2V2L7.462 0zm-.615 18.03c-2.78 0-4.616-2.24-4.616-5.723 0-3.574 1.87-5.868 4.698-5.868 2.78 0 4.47 2.185 4.47 5.647 0 3.649-1.738 5.944-4.552 5.944zm.046-9.924c-1.482 0-2.39 1.456-2.39 4.06 0 2.55.877 3.99 2.36 3.99 1.5 0 2.39-1.47 2.39-4.07 0-2.55-.876-3.98-2.36-3.98z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold text-base">Outlook</div>
                  <div className="text-xs text-slate-500">
                    {language === "th" ? "เปิดในแอปหรือเว็บ Outlook" : "Open in Outlook app or web"}
                  </div>
                </div>
                <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 ml-auto transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>

            <button
              type="button"
              onClick={() => setShowEmailModal(false)}
              className="w-full mt-5 py-3 rounded-2xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-sm font-semibold transition-all cursor-pointer"
            >
              {language === "th" ? "ยกเลิก" : "Cancel"}
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
          <label className="block text-base font-semibold text-slate-700 mb-2">
            {language === "th" ? "ชื่อ-นามสกุล" : "Full Name"} <span className="text-red-500">*</span>
          </label>
          <input type="text" value={form.customerName} onChange={e => set("customerName", e.target.value)}
            placeholder={language === "th" ? "ชื่อจริง และนามสกุล" : "First and last name"} className={inputCls(errors.customerName)} />
          {errors.customerName && <p className="mt-1 text-sm text-red-500">{errors.customerName}</p>}
        </div>
        <div>
          <label className="block text-base font-semibold text-slate-700 mb-2">
            {language === "th" ? "เบอร์โทรศัพท์" : "Phone Number"} <span className="text-red-500">*</span>
          </label>
          <div className={`flex items-center bg-slate-50 border ${errors.phone ? "border-red-500" : "border-slate-200"} rounded-xl focus-within:border-[#3668FF] focus-within:ring-2 focus-within:ring-[#3668FF]/15 transition-all overflow-hidden`}>
            {isCustomCc ? (
              <div className="flex items-center border-r border-slate-200 bg-slate-100/30">
                <input
                  type="text"
                  value={form.phoneCountryCode === "custom" ? "+" : form.phoneCountryCode}
                  onChange={e => {
                    let val = e.target.value;
                    if (!val.startsWith("+")) {
                      val = "+" + val.replace(/\+/g, "");
                    }
                    val = "+" + val.slice(1).replace(/[^0-9]/g, "");
                    set("phoneCountryCode", val);
                  }}
                  placeholder="+XX"
                  className="w-16 bg-transparent text-slate-800 text-sm font-semibold pl-3 pr-1 py-3 focus:outline-none text-center"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomCc(false);
                    set("phoneCountryCode", "+66");
                  }}
                  className="pr-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer select-none"
                  title={language === "th" ? "เลือกจากรายการ" : "Choose from list"}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="relative border-r border-slate-200 bg-transparent flex items-center">
                <select
                  value={form.phoneCountryCode}
                  onChange={e => {
                    if (e.target.value === "custom") {
                      setIsCustomCc(true);
                      set("phoneCountryCode", "+");
                    } else {
                      set("phoneCountryCode", e.target.value);
                    }
                  }}
                  className="appearance-none bg-transparent text-slate-800 text-sm font-semibold pl-3 pr-8 py-3 focus:outline-none cursor-pointer"
                >
                  <option value="+66">TH +66</option>
                  <option value="+65">SG +65</option>
                  <option value="+60">MY +60</option>
                  <option value="+62">ID +62</option>
                  <option value="+63">PH +63</option>
                  <option value="+84">VN +84</option>
                  <option value="+86">CN +86</option>
                  <option value="+852">HK +852</option>
                  <option value="+886">TW +886</option>
                  <option value="+81">JP +81</option>
                  <option value="+82">KR +82</option>
                  <option value="+91">IN +91</option>
                  <option value="+61">AU +61</option>
                  <option value="+44">GB +44</option>
                  <option value="+1">US +1</option>
                  <option value="+49">DE +49</option>
                  <option value="+33">FR +33</option>
                  <option value="+7">RU +7</option>
                  <option value="custom">{language === "th" ? "อื่น ๆ (+)" : "Other (+)"}</option>
                </select>
                <div className="absolute right-2.5 pointer-events-none text-slate-500 flex items-center">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            )}
            <input
              type="tel"
              value={form.phone}
              onChange={e => set("phone", e.target.value)}
              placeholder="8X-XXXX-XXXX"
              className="bg-transparent text-slate-900 placeholder:text-slate-400 text-sm w-full px-4 py-3 focus:outline-none"
            />
          </div>
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-base font-semibold text-slate-700 mb-2">
          {language === "th" ? "อีเมล" : "Email"}{" "}
          <span className="text-slate-400 text-sm font-normal">
            {language === "th" ? "(ไม่บังคับ — สำหรับรับอีเมลยืนยันการจอง)" : "(optional — for booking confirmation)"}
          </span>
        </label>
        <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
          placeholder="your@email.com" className={inputCls()} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-base font-semibold text-slate-700 mb-2">
            {language === "th" ? "วันที่เดินทาง" : "Travel Date"} <span className="text-red-500">*</span>
          </label>
          <input type="date" min={todayStr} value={form.travelDate} onChange={e => set("travelDate", e.target.value)}
            className={inputCls(errors.travelDate)} style={{ colorScheme: "light" }} />
          {errors.travelDate && <p className="mt-1 text-sm text-red-500">{errors.travelDate}</p>}
        </div>
        <div>
          <label className="block text-base font-semibold text-slate-700 mb-2">
            {language === "th" ? "เวลาเข้ารับ" : "Pick-up Time"} <span className="text-red-500">*</span>
          </label>
          <input type="time" value={form.travelTime} onChange={e => set("travelTime", e.target.value)}
            className={inputCls(errors.travelTime)} style={{ colorScheme: "light" }} />
          {errors.travelTime && <p className="mt-1 text-sm text-red-500">{errors.travelTime}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <p className="text-base text-slate-600">
        {language === "th" ? "คุณต้องการให้รถไปรับที่ไหน?" : "Where will you be picked up?"}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PICKUP_OPTIONS.map(opt => {
          const selected = form.pickupRegion === opt.id;
          return (
            <button key={opt.id} type="button"
              onClick={() => setMany({ pickupRegion: opt.id, pickupUpcountryCity: null, pickupHotelName: "", pickupMapUrl: "", dropoffRegion: null, dropoffAddress: "", dropoffMapUrl: "" })}
              className={cardCls(selected)}>
              <div className="flex flex-col pr-2">
                <span className={`font-bold text-base ${selected ? "text-[#3668FF]" : "text-slate-800"}`}>{getPickupName(opt.id)}</span>
                <span className={`text-xs mt-1 ${selected ? "text-[#3668FF]/80" : "text-slate-500"}`}>{getPickupDesc(opt.id)}</span>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${selected ? "border-[#3668FF] bg-[#3668FF]" : "border-slate-300 bg-transparent"
                }`}>
                {selected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>
      {errors.pickupRegion && <p className="text-sm text-red-500">{errors.pickupRegion}</p>}

      {/* Upcountry city selector */}
      {form.pickupRegion === "upcountry" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 pt-1">
          <p className="text-base font-semibold text-slate-700">
            {language === "th" ? "เมืองปลายทาง?" : "Which city?"}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {UPCOUNTRY_CITIES.map(city => {
              const selected = form.pickupUpcountryCity === city.id;
              return (
                <button key={city.id} type="button"
                  onClick={() => set("pickupUpcountryCity", city.id)}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${selected
                      ? "bg-blue-50/50 border-[#3668FF] shadow-[0_0_12px_rgba(54,104,255,0.08)] text-[#3668FF]"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}>
                  <span className="text-sm font-bold">{getCityName(city.id)}</span>
                  <div className={`mt-2.5 w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${selected ? "border-[#3668FF] bg-[#3668FF]" : "border-slate-300 bg-transparent"
                    }`}>
                    {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
          {errors.pickupUpcountryCity && <p className="text-sm text-red-500">{errors.pickupUpcountryCity}</p>}
        </motion.div>
      )}

      {/* Upcountry specific hotel/address input */}
      {form.pickupRegion === "upcountry" && form.pickupUpcountryCity && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
          <label className="block text-base font-semibold text-slate-700 mb-2">
            {language === "th" ? (
              <>ชื่อโรงแรม หรือที่อยู่ใน {getCityName(form.pickupUpcountryCity)} <span className="text-red-500">*</span></>
            ) : (
              <>Hotel Name or Address in {getCityName(form.pickupUpcountryCity)} <span className="text-red-500">*</span></>
            )}
          </label>
          <input type="text" value={form.pickupHotelName} onChange={e => set("pickupHotelName", e.target.value)}
            placeholder={language === "th" ? "เช่น ชื่อโรงแรม, รีสอร์ทริมหาด หรือที่อยู่..." : "e.g., Hotel name, beach resort, or specific address..."} className={inputCls(errors.pickupHotelName)} />
          {errors.pickupHotelName && <p className="mt-1 text-sm text-red-500">{errors.pickupHotelName}</p>}
        </motion.div>
      )}

      {/* Hotel Bangkok name input */}
      {form.pickupRegion === "hotel_bkk" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pt-1">
          <label className="block text-base font-semibold text-slate-700 mb-2">
            {language === "th" ? "ชื่อโรงแรมหรือที่อยู่ในกรุงเทพฯ" : "Hotel Name or Address in Bangkok"} <span className="text-red-500">*</span>
          </label>
          <input type="text" value={form.pickupHotelName} onChange={e => set("pickupHotelName", e.target.value)}
            placeholder={language === "th" ? "เช่น แมริออท สุขุมวิท, ใกล้สยามพารากอน..." : "e.g., Marriott Sukhumvit, near Siam Paragon..."} className={inputCls(errors.pickupHotelName)} />
          {errors.pickupHotelName && <p className="mt-1 text-sm text-red-500">{errors.pickupHotelName}</p>}
        </motion.div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <p className="text-base text-slate-500">
        {language === "th" ? "คุณต้องการเดินทางไปที่ไหน?" : "Where would you like to go?"}
      </p>

      {dropoffKeys.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-base">
          {language === "th" ? "กรุณาย้อนกลับเพื่อเลือกสถานที่รับต้นทางก่อน" : "Go back and complete your pick-up location first."}
        </div>
      ) : (
        <>
          <div className={`grid gap-3 ${dropoffKeys.length <= 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
            {dropoffKeys.map(key => {
              const selected = form.dropoffRegion === key;
              return (
                <button key={key} type="button"
                  onClick={() => setMany({ dropoffRegion: key, dropoffAddress: "", dropoffMapUrl: "" })}
                  className={cardCls(selected)}>
                  <div className="flex flex-col pr-2">
                    <span className={`font-bold text-base ${selected ? "text-[#3668FF]" : "text-slate-800"}`}>{getDropoffName(key)}</span>
                    <span className={`text-xs mt-1 ${selected ? "text-[#3668FF]/80" : "text-slate-500"}`}>{getDropoffDesc(key)}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${selected ? "border-[#3668FF] bg-[#3668FF]" : "border-slate-300 bg-transparent"
                    }`}>
                    {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
          {errors.dropoffRegion && <p className="text-sm text-red-500">{errors.dropoffRegion}</p>}

          {/* Address input for hotel / city destinations */}
          {currentDropoff?.needsAddress && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pt-1">
              <label className="block text-base font-semibold text-slate-700 mb-2">
                {getDropoffAddressLabel(form.dropoffRegion as DropoffKey)} <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.dropoffAddress} onChange={e => set("dropoffAddress", e.target.value)}
                placeholder={language === "th" ? "เช่น โรงแรม อวานี พัทยา รีสอร์ท, เลขที่ 300 ถนนเลียบชายหาด..." : "e.g., Avani Pattaya Resort, 300 Beach Road..."}
                className={inputCls(errors.dropoffAddress)} />
              {errors.dropoffAddress && <p className="mt-1 text-sm text-red-500">{errors.dropoffAddress}</p>}

            </motion.div>
          )}
        </>
      )}
    </div>
  );

  const renderStep3 = () => {
    return (
      <div className="space-y-10 sm:space-y-12">
        {/* ── Fleet Type — 2-level selector ── */}
        <div className="space-y-4">
          <label className="block text-base font-semibold text-slate-700 mb-1">
            {language === "th" ? "ประเภทรถยนต์" : "Fleet Type"}
          </label>

          {/* Level 1: Category */}
          <div className="grid grid-cols-3 gap-3">
            {/* Sedan category */}
            {(() => {
              const isSedanSelected = ["sedan_s","sedan_m","sedan_l"].includes(form.vehicleType) && form.hasSelectedVehicle;
              const priceResult = getPrice(form.pickupRegion, form.dropoffRegion, form.pickupUpcountryCity, "sedan_s");
              return (
                <button
                  type="button"
                  onClick={() => setMany({ vehicleType: "sedan_s", hasSelectedVehicle: true })}
                  className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer ${
                    isSedanSelected
                      ? "bg-blue-50 border-[#3668FF] shadow-[0_0_16px_rgba(54,104,255,0.12)]"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  
                  <div>
                    <div className={`font-bold text-sm sm:text-base ${isSedanSelected ? "text-[#3668FF]" : "text-slate-800"}`}>
                      {language === "th" ? "รถเก๋ง (Sedan)" : "Sedan"}
                    </div>
                    <div className={`text-xs mt-0.5 ${isSedanSelected ? "text-[#3668FF]/70" : "text-slate-400"}`}>
                      {language === "th" ? "ผู้โดยสาร 1–3 ท่าน" : "1–3 passengers"}
                    </div>
                  </div>
                  {priceResult && (
                    <div className={`mt-1 px-3 py-1 rounded-full text-sm font-black shadow-sm border transition-all ${
                      isSedanSelected
                        ? "bg-[#3668FF] text-white border-transparent"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                      ฿{priceResult.price.toLocaleString()}
                    </div>
                  )}
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    isSedanSelected ? "border-[#3668FF] bg-[#3668FF]" : "border-slate-300"
                  }`}>
                    {isSedanSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })()}

            {/* SUV */}
            {(() => {
              const isSelected = form.vehicleType === "suv" && form.hasSelectedVehicle;
              const priceResult = getPrice(form.pickupRegion, form.dropoffRegion, form.pickupUpcountryCity, "suv");
              return (
                <button
                  type="button"
                  onClick={() => setMany({ vehicleType: "suv", hasSelectedVehicle: true })}
                  className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-blue-50 border-[#3668FF] shadow-[0_0_16px_rgba(54,104,255,0.12)]"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <div className={`font-bold text-sm sm:text-base ${isSelected ? "text-[#3668FF]" : "text-slate-800"}`}>
                      {language === "th" ? "รถอเนกประสงค์ (SUV)" : "SUV"}
                    </div>
                    <div className={`text-xs mt-0.5 ${isSelected ? "text-[#3668FF]/70" : "text-slate-400"}`}>
                      {language === "th" ? "ผู้โดยสาร 3–6 ท่าน" : "1–4 passengers"}
                    </div>
                  </div>
                  {priceResult && (
                    <div className={`mt-1 px-3 py-1 rounded-full text-sm font-black shadow-sm border transition-all ${
                      isSelected
                        ? "bg-[#3668FF] text-white border-transparent"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                      ฿{priceResult.price.toLocaleString()}
                    </div>
                  )}
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    isSelected ? "border-[#3668FF] bg-[#3668FF]" : "border-slate-300"
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })()}

            {/* Van */}
            {(() => {
              const isSelected = form.vehicleType === "van" && form.hasSelectedVehicle;
              const priceResult = getPrice(form.pickupRegion, form.dropoffRegion, form.pickupUpcountryCity, "van");
              return (
                <button
                  type="button"
                  onClick={() => setMany({ vehicleType: "van", hasSelectedVehicle: true })}
                  className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-blue-50 border-[#3668FF] shadow-[0_0_16px_rgba(54,104,255,0.12)]"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  
                  <div>
                    <div className={`font-bold text-sm sm:text-base ${isSelected ? "text-[#3668FF]" : "text-slate-800"}`}>
                      {language === "th" ? "รถตู้ VIP (Van)" : "Van"}
                    </div>
                    <div className={`text-xs mt-0.5 ${isSelected ? "text-[#3668FF]/70" : "text-slate-400"}`}>
                      {language === "th" ? "ผู้โดยสาร 4–6 ท่าน" : "5–9 passengers"}
                    </div>
                  </div>
                  {priceResult && (
                    <div className={`mt-1 px-3 py-1 rounded-full text-sm font-black shadow-sm border transition-all ${
                      isSelected
                        ? "bg-[#3668FF] text-white border-transparent"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                      ฿{priceResult.price.toLocaleString()}
                    </div>
                  )}
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    isSelected ? "border-[#3668FF] bg-[#3668FF]" : "border-slate-300"
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })()}
          </div>

          {/* Level 2: Sedan size picker — only shown when sedan category is active */}
          {(["sedan_s","sedan_m","sedan_l"].includes(form.vehicleType) && form.hasSelectedVehicle) && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-3"
            >
              <div className="grid grid-cols-3 gap-3">
                {(["sedan_s","sedan_m","sedan_l"] as const).map(sizeId => {
                  const sizeLabel = sizeId === "sedan_s" ? "S" : sizeId === "sedan_m" ? "M" : "L";
                  const sizeDesc = sizeId === "sedan_s"
                    ? (language === "th" ? "ประหยัด · 2 ใบ" : "Economy · 2 bags")
                    : sizeId === "sedan_m"
                    ? (language === "th" ? "คอมฟอร์ต · 3 ใบ" : "Comfort · 3 bags")
                    : (language === "th" ? "ผู้บริหาร · 3 ใบ" : "Executive · 3 bags");
                  const isSelected = form.vehicleType === sizeId;
                  const priceResult = getPrice(form.pickupRegion, form.dropoffRegion, form.pickupUpcountryCity, sizeId);
                  return (
                    <button
                      key={sizeId}
                      type="button"
                      onClick={() => setMany({ vehicleType: sizeId, hasSelectedVehicle: true })}
                      className={`flex flex-col items-center gap-1.5 p-3.5 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-white border-[#3668FF] shadow-[0_0_12px_rgba(54,104,255,0.12)]"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                        isSelected ? "bg-[#3668FF] text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        {sizeLabel}
                      </div>
                      <div className={`text-xs font-semibold leading-tight ${isSelected ? "text-[#3668FF]" : "text-slate-600"}`}>
                        {sizeDesc}
                      </div>
                      {priceResult ? (
                        <div className={`mt-1 px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-black border transition-all ${
                          isSelected
                            ? "bg-[#3668FF] text-white border-transparent"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                          ฿{priceResult.price.toLocaleString()}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 font-medium">— —</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

        </div>

        {/* Driver preference */}
        <div>
          <label className="block text-base font-semibold text-slate-700 mb-4">
            {language === "th" ? "ประเภทคนขับที่ต้องการ" : "Driver Preference"}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DRIVER_TYPES.map(d => {
              const selected = form.driverType === d.id;
              return (
                <button key={d.id} type="button"
                  onClick={() => set("driverType", d.id)}
                  className={cardCls(selected)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${selected ? "bg-blue-100 text-[#3668FF]" : "bg-slate-100 text-slate-500"}`}>
                      {d.id === "general" ? <UserCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className={`font-bold text-sm sm:text-base ${selected ? "text-[#3668FF]" : "text-slate-800"}`}>
                        {d.id === "general"
                          ? (language === "th" ? "คนขับทั่วไป" : "General Driver")
                          : (language === "th" ? "คนขับผู้หญิง" : "Women Driver")}
                      </span>
                      <span className={`text-xs mt-0.5 ${selected ? "text-[#3668FF]/85" : "text-slate-500"}`}>
                        {d.id === "general"
                          ? (language === "th" ? "คนขับรถมืออาชีพ (ชาย/หญิง)" : "Any professional driver")
                          : (language === "th" ? "เฉพาะคนขับผู้หญิงเท่านั้น" : "Female driver only")}
                      </span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${selected ? "border-[#3668FF] bg-[#3668FF]" : "border-slate-300 bg-transparent"
                    }`}>
                    {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Passengers Details */}
        <div className="space-y-4">
          <label className="block text-base font-semibold text-slate-700 mb-1.5">
            {language === "th" ? "จำนวนผู้โดยสาร" : "Number of Passengers"} <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="text-left">
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-500" />
                  {language === "th" ? "ผู้ใหญ่" : "Adults"}
                </span>
                
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => set("adults", Math.max(1, form.adults - 1))}
                  className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer select-none"
                >
                  -
                </button>
                <span className="text-sm font-bold w-4 text-center text-slate-800">{form.adults}</span>
                <button
                  type="button"
                  onClick={() => set("adults", form.adults + 1)}
                  className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer select-none"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="text-left">
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <Baby className="w-4 h-4 text-slate-500" />
                  {language === "th" ? "เด็ก" : "Children"}
                </span>
                
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => set("children", Math.max(0, form.children - 1))}
                  className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer select-none"
                >
                  -
                </button>
                <span className="text-sm font-bold w-4 text-center text-slate-800">{form.children}</span>
                <button
                  type="button"
                  onClick={() => set("children", form.children + 1)}
                  className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer select-none"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Luggage Details */}
        <div className="space-y-4">
          <label className="block text-base font-semibold text-slate-700 mb-1.5">
            {language === "th" ? "ข้อมูลกระเป๋าสัมภาระ" : "Luggage Information"} <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="text-left">
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  {language === "th" ? "กระเป๋าใบใหญ่" : "Large Luggage"}
                </span>
                <span className="text-xs text-slate-500 block">
                  {language === "th" ? "ขนาด 24 นิ้วขึ้นไป (เช่น กระเป๋าโหลดใต้เครื่อง)" : "24\" or larger (e.g. check-in bags)"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => set("largeLuggage", Math.max(0, form.largeLuggage - 1))}
                  className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer select-none"
                >
                  -
                </button>
                <span className="text-sm font-bold w-4 text-center text-slate-800">{form.largeLuggage}</span>
                <button
                  type="button"
                  onClick={() => set("largeLuggage", form.largeLuggage + 1)}
                  className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer select-none"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="text-left">
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  {language === "th" ? "กระเป๋าใบเล็ก" : "Small Luggage"}
                </span>
                <span className="text-xs text-slate-500 block">
                  {language === "th" ? "กระเป๋าถือขึ้นเครื่อง / เป้สะพายหลัง" : "Hand-carry / backpack"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => set("smallLuggage", Math.max(0, form.smallLuggage - 1))}
                  className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer select-none"
                >
                  -
                </button>
                <span className="text-sm font-bold w-4 text-center text-slate-800">{form.smallLuggage}</span>
                <button
                  type="button"
                  onClick={() => set("smallLuggage", form.smallLuggage + 1)}
                  className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer select-none"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          {errors.luggage && <p className="text-sm text-red-500">{errors.luggage}</p>}
        </div>

        {/* Flight Number — below luggage */}
        {hasAirport && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <label className="block text-base font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <Plane className="w-4 h-4 text-slate-500" />
              {language === "th" ? "หมายเลขเที่ยวบิน (Flight Number)" : "Flight Number"}{" "}
              <span className="text-slate-400 text-sm font-normal">
                {language === "th" ? "(ไม่บังคับ แต่แนะนำเป็นอย่างยิ่ง)" : "(optional but highly recommended)"}
              </span>
            </label>
            <div className="relative">
              <Plane className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={form.flightNumber}
                onChange={e => set("flightNumber", e.target.value.toUpperCase())}
                placeholder={language === "th" ? "เช่น TG 413, FD 3201" : "e.g., TG 413, FD 3201"}
                className={`${inputCls()} pl-11`}
              />
            </div>
            <p className="text-xs text-slate-500">
              {language === "th" ? "ช่วยให้คนขับรถของเราสามารถตรวจสอบสถานะเที่ยวบินของคุณในกรณีที่เครื่องบินล่าช้าได้" : "Helps our driver monitor your flight status in case of delays."}
            </p>
          </motion.div>
        )}

        {/* Additional Notes */}
        <div>
          <label className="block text-base font-semibold text-slate-700 mb-4 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-500" />
            {language === "th" ? "ข้อมูลเพิ่มเติม / คำขอพิเศษ" : "Additional Notes / Requests"}{" "}
            <span className="text-slate-400 text-sm font-normal">
              {language === "th" ? "(ไม่บังคับ)" : "(optional)"}
            </span>
          </label>
          <textarea
            value={form.additionalDetails}
            onChange={e => set("additionalDetails", e.target.value)}
            rows={3}
            placeholder={language === "th" ? "ระบุอาคารผู้โดยสาร, คำแนะนำเกี่ยวกับรถยนต์ หรือสิ่งอื่น ๆ ที่ต้องการ..." : "Flight terminal, specific vehicle instructions, or anything else..."}
            className={inputCls()}
          />
        </div>
      </div>
    );
  };

  const renderStep4 = () => {
    // ── Price calculator (all supported routes) ─────────────────────────────
    const priceResult = getPrice(form.pickupRegion, form.dropoffRegion, form.pickupUpcountryCity, form.vehicleType);
    const vehicleLabelMap: Record<VehicleType, string> = {
      sedan_s: "Sedan S", sedan_m: "Sedan M", sedan_l: "Sedan L", suv: "SUV", van: "Van",
    };

    return (
      <div className="space-y-6 py-4">
        {/* Price card — shown for any route that has a fixed price */}
        {priceResult !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#3668FF]/10 to-[#3668FF]/5 border border-[#3668FF]/25 rounded-2xl p-5"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#3668FF] mb-3">
              {language === "th" ? "ราคาประเมิน" : "Estimated Price"}
            </p>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-slate-600 text-sm mb-0.5">
                  {ROUTE_LABELS[priceResult.routeKey].from} → {ROUTE_LABELS[priceResult.routeKey].to}
                </p>
                <p className="text-slate-500 text-sm">
                  {language === "th" ? "ประเภทรถ: " : "Vehicle: "}<span className="font-bold text-slate-700">{vehicleLabelMap[form.vehicleType]}</span>
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-3xl font-black text-[#3668FF]">฿{priceResult.price.toLocaleString()}</p>
                <p className="text-xs text-slate-400">
                  {language === "th" ? "รวมค่าทางด่วนแล้ว" : "All tolls included"}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* WhatsApp success */}
        {submitType === "whatsapp" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-4 text-slate-800">
            <p className="font-bold text-base mb-1.5 text-green-800">
              {language === "th" ? "✅ เริ่มต้นการส่งข้อมูลการจองผ่าน WhatsApp" : "✅ WhatsApp Booking Initiated"}
            </p>
            <p className="text-slate-500 text-sm mb-3">
              {language === "th" ? "หากแอปพลิเคชันไม่เปิดขึ้นมา กรุณากดปุ่มด้านล่างเพื่อลองใหม่อีกครั้ง" : "If the app did not open, use the button below to retry."}
            </p>
            <div className="flex gap-2">
              <a href={`https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(compileMessage())}`}
                target="_blank" rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors">
                {language === "th" ? "ลองส่ง WhatsApp อีกครั้ง" : "Retry WhatsApp"}
              </a>
              <button type="button" onClick={() => setSubmitType(null)}
                className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer">
                {language === "th" ? "ปิด" : "Dismiss"}
              </button>
            </div>
          </motion.div>
        )}

        {/* Booking channel buttons */}
        <div>
          <p className="text-left text-sm font-semibold  tracking-wider text-slate-500 mb-4">
            {language === "th" ? "เลือกช่องทางการส่งข้อมูลการจอง" : "Select a booking channel"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button type="button" onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 rounded-xl font-bold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.003 2.667C8.636 2.667 2.667 8.636 2.667 16.003c0 2.358.638 4.614 1.807 6.56L2.667 29.333l6.96-1.784a13.29 13.29 0 0 0 6.376 1.624c7.367 0 13.336-5.969 13.336-13.337 0-7.367-5.969-13.336-13.336-13.169zM22.88 20.88c-.27.757-1.587 1.448-2.16 1.488-.573.04-1.12.27-3.776-.787-3.2-1.28-5.227-4.507-5.387-4.72-.16-.213-1.28-1.707-1.28-3.253 0-1.547.81-2.307 1.097-2.613.287-.307.627-.384.836-.384.21 0 .42.002.603.01.193.01.453-.073.707.54.267.64.907 2.21.987 2.37.08.16.133.347.027.56-.107.213-.16.347-.32.533-.16.187-.337.418-.48.56-.16.16-.327.333-.14.653.187.32.83 1.373 1.787 2.227 1.227 1.093 2.267 1.44 2.587 1.6.32.16.507.133.693-.08.187-.213.8-.933 1.013-1.253.213-.32.427-.267.72-.16.293.107 1.853.875 2.173 1.035.32.16.533.24.613.373.08.133.08.76-.187 1.52z" />
              </svg>
              {language === "th" ? "จองผ่าน WhatsApp" : "WhatsApp Booking"}
            </button>
            <button type="button" onClick={handleEmail}
              className="w-full flex items-center justify-center gap-2.5 bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl font-bold transition-all cursor-pointer hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              {language === "th" ? "จองผ่าน Email" : "Email Booking"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSuccessScreen = () => (
    <div className="text-center py-10 px-4 space-y-6">
      {/* Premium checkmark success animation */}
      <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(16,185,129,0.08)]">
        <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-slate-900">
            {language === "th" ? "ส่งคำขอจองรถเรียบร้อยแล้ว!" : "Booking Request Forwarded!"}
          </h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
            {language === "th"
              ? "รายละเอียดการจองของคุณได้รับการจัดเตรียมและส่งผ่านช่องทางที่คุณเลือกแล้ว ทีมงานของเราจะทำการตรวจสอบเส้นทางและติดต่อคุณกลับโดยเร็วที่สุดเพื่อยืนยันการจัดหารถและสรุปราคา"
              : "Your booking details have been prepared and sent via your selected channel. Our team will verify the travel route and contact you shortly to confirm driver allocation and pricing."}
          </p>
        </div>

        <div className="inline-flex flex-col items-center justify-center bg-blue-50/50 border border-blue-100 rounded-2xl px-5 py-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest">
            {language === "th" ? "เบอร์ติดต่อบริษัท" : "Company Contact"}
          </span>
          <a
            href="tel:+66624494253"
            className="flex items-center gap-2 text-lg font-extrabold text-[#3668FF] hover:text-[#2a56e0] transition-colors"
          >
            <svg className="w-5 h-5 text-[#3668FF]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            +66 62 449 4253
          </a>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2">
        <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block">
          {language === "th" ? "ขั้นตอนถัดไป:" : "Next Steps:"}
        </span>
        <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
          <li>
            {language === "th" ? "กรุณาเปิดแอปพลิเคชัน WhatsApp หรือกล่องข้อความอีเมลของคุณไว้" : "Keep your WhatsApp application or email inbox open."}
          </li>
          <li>
            {language === "th" ? "หากต้องการความช่วยเหลือด่วน กรุณาโทรหาเราโดยตรงหรือติดต่อตามข้อมูลติดต่อ" : "For immediate assistance, call us or use the floating contact details."}
          </li>
          <li>
            {language === "th" ? "รายละเอียดใบเสร็จสรุปการจองจะยังคงแสดงอยู่บนหน้านี้" : "Your receipt details will remain visible on this page."}
          </li>
          <li>
            {language === "th" ? "ดาวน์โหลดใบเสร็จ หรือส่งข้อมูลโดยตรงเข้าอีเมลหรือ WhatsApp" : "Download your receipt, or send it directly to your email or WhatsApp."}
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <button
          type="button"
          onClick={() => {
            // Reset form
            setForm(DEFAULT_FORM);
            setStep(0);
            setBookingStatus("filling");
            setErrors({});
            // Clear localStorage
            try {
              localStorage.removeItem(STORAGE_KEY_FORM);
              localStorage.removeItem(STORAGE_KEY_STEP);
            } catch (e) {
              console.error(e);
            }
          }}
          className="px-6 py-3 rounded-xl bg-[#3668FF] hover:bg-[#2a56e0] text-white font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {language === "th" ? "จองรถบริการคันอื่นเพิ่ม" : "Book Another Ride"}
        </button>
        <button
          type="button"
          onClick={() => {
            setBookingStatus("filling");
            setSubmitType(null);
            setStep(4);
          }}
          className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-800 hover:bg-slate-50 font-bold text-sm transition-all flex items-center justify-center cursor-pointer"
        >
          {language === "th" ? "ยกเลิก" : "Cancel"}
        </button>
      </div>
    </div>
  );

  const stepRenderers = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4];

  // ── Main render ─────────────────────────────────────────────────────────
  return (
    <section id="booking" className="relative w-full bg-transparent overflow-hidden scroll-mt-20">
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16 py-8 md:py-12 xl:py-14">
        {/* Section Header */}
        <div className="mb-12">

          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight text-white">{t.bookYourRide}</h1>
          <span className="text-white/50">{t.fillFormBelow}</span>
        </div>


        <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-8 items-start">

          {/* ── LEFT: info panel (sticky on desktop) ───────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[38%] text-white lg:sticky lg:top-28"
          >
            {/* Live booking summary (receipt style) */}

            {(form.customerName || form.phone || form.email || form.travelDate || form.travelTime || form.pickupRegion || form.additionalDetails) ? (
              <motion.div
                ref={receiptRef}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-white text-slate-900 rounded-2xl p-5 shadow-2xl overflow-hidden font-sans border-t-[8px] border-[#3668FF] pb-7"
              >
                {/* Serrated edge pattern at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-repeat-x pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpolygon points='0,6 5,0 10,6' fill='%231DA58C'/%3E%3C/svg%3E")`,
                    backgroundSize: '10px 6px',
                    transform: 'rotate(180deg)'
                  }}
                />

                {/* Header */}
                <div className="text-center pb-4 border-b border-dashed border-slate-300">
                  <p className=" font-black uppercase  text-[#3668FF]">{t.bookingSummary}</p>
                  <p className="text-sm font-mono text-slate-400 mt-1">NO: TST-{new Date(form.travelDate || Date.now()).getFullYear() || 2026}{String(form.phone || '').slice(-4).padStart(4, '0')}</p>
                </div>

                {/* Receipt Details */}
                <div className="py-4 space-y-3 text-sm">
                  {form.customerName && (
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">
                        {language === "th" ? "ผู้โดยสาร" : "Passenger"}
                      </span>
                      <span className="font-bold text-right text-slate-800">{form.customerName}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">
                      {language === "th" ? "จำนวนผู้โดยสาร" : "Passengers"}
                    </span>
                    <span className="font-bold text-slate-800">
                      {language === "th"
                        ? `ผู้ใหญ่ ${form.adults} ท่าน`
                        : `${form.adults} Adult${form.adults > 1 ? 's' : ''}`
                      }
                      {form.children > 0 && `, ${
                        language === "th"
                          ? `เด็ก ${form.children} ท่าน`
                          : `${form.children} Child${form.children > 1 ? 'ren' : ''}`
                      }`}
                    </span>
                  </div>
                  {form.phone && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">
                        {language === "th" ? "เบอร์โทรศัพท์" : "Phone"}
                      </span>
                      <span className="font-bold text-slate-800">{form.phoneCountryCode} {form.phone}</span>
                    </div>
                  )}
                  {form.email && (
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">
                        {language === "th" ? "อีเมล" : "Email"}
                      </span>
                      <span className="font-semibold text-slate-800  text-right break-all">{form.email}</span>
                    </div>
                  )}

                  <div className="h-px border-t border-dashed border-slate-200 my-2" />

                  {form.travelDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">
                        {language === "th" ? "วันที่เดินทาง" : "Date"}
                      </span>
                      <span className="font-bold text-slate-800">{form.travelDate}</span>
                    </div>
                  )}
                  {form.travelTime && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">
                        {language === "th" ? "เวลาเข้ารับ" : "Time"}
                      </span>
                      <span className="font-bold text-slate-800">{form.travelTime}</span>
                    </div>
                  )}

                  <div className="h-px border-t border-dashed border-slate-200 my-2" />

                  {pickupLabel && (
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">
                        {language === "th" ? "ต้นทาง (จุดรับ)" : "From (Pick-up)"}
                      </span>
                      <span className="font-bold text-slate-800 pl-2 border-l-2 border-[#1DA58C] leading-snug">{pickupLabel}</span>
                    </div>
                  )}

                  {dropoffLabel && (
                    <div className="flex flex-col gap-1 text-left mt-2">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">
                        {language === "th" ? "ปลายทาง (จุดส่ง)" : "To (Drop-off)"}
                      </span>
                      <span className="font-bold text-slate-800 pl-2 border-l-2 border-red-400 leading-snug">{dropoffLabel}</span>
                    </div>
                  )}

                  {(form.flightNumber || form.largeLuggage > 0 || form.smallLuggage > 0 || form.vehicleType || form.driverType !== "general") && (
                    <>
                      <div className="h-px border-t border-dashed border-slate-200 my-2" />

                      {hasAirport && form.flightNumber && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">
                            {language === "th" ? "เที่ยวบิน" : "Flight No."}
                          </span>
                          <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-sm">{form.flightNumber}</span>
                        </div>
                      )}

                      {form.hasSelectedVehicle && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">
                            {language === "th" ? "รถยนต์" : "Vehicle"}
                          </span>
                          <span className="font-bold text-slate-800 uppercase text-sm">{
                            ({ sedan_s: "Sedan S", sedan_m: "Sedan M", sedan_l: "Sedan L", suv: "SUV", van: "Van" } as Record<string, string>)[form.vehicleType] ?? form.vehicleType
                          }</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">
                          {language === "th" ? "คนขับรถ" : "Driver"}
                        </span>
                        <span className="font-bold text-slate-800 text-sm">
                          {form.driverType === "women"
                            ? (language === "th" ? "ผู้หญิง" : "Female")
                            : (language === "th" ? "ทั่วไป" : "Standard")
                          }
                        </span>
                      </div>

                      {(form.largeLuggage > 0 || form.smallLuggage > 0) && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">
                            {language === "th" ? "สัมภาระ" : "Luggage"}
                          </span>
                          <span className="font-bold text-slate-800">
                            {language === "th"
                              ? `ใบใหญ่ ${form.largeLuggage} ใบ, ใบเล็ก ${form.smallLuggage} ใบ`
                              : `${form.largeLuggage} Large, ${form.smallLuggage} Small`
                            }
                          </span>
                        </div>
                      )}

                      {form.hasSelectedVehicle && (() => {
                        const receiptPrice = getPrice(form.pickupRegion, form.dropoffRegion, form.pickupUpcountryCity, form.vehicleType);
                        return receiptPrice ? (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">
                              {language === "th" ? "ราคาประเมิน" : "Est. Price"}
                            </span>
                            <span className="font-extrabold text-[#3668FF] text-sm">฿{receiptPrice.price.toLocaleString()}</span>
                          </div>
                        ) : null;
                      })()}
                    </>
                  )}

                  {(form.hasGolfBag || form.hasSurfboard || form.hasStroller || form.hasWheelchair || form.hasBabySeat || form.hasElderlyCare || form.hasStopover) && (
                    <>
                      <div className="h-px border-t border-dashed border-slate-200 my-2" />
                      <div className="flex flex-col gap-1 text-left">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">
                          {language === "th" ? "บริการเสริม" : "Add-ons & Requests"}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {form.hasGolfBag && <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-md text-xs">{language === "th" ? "ถุงกอล์ฟ" : "Golf Bag"}</span>}
                          {form.hasSurfboard && <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-md text-xs">{language === "th" ? "กระดานโต้คลื่น" : "Surfboard"}</span>}
                          {form.hasStroller && <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-md text-xs">{language === "th" ? "รถเข็นเด็ก" : "Stroller"}</span>}
                          {form.hasWheelchair && <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-md text-xs">{language === "th" ? "รถเข็นผู้ป่วย" : "Wheelchair"}</span>}
                          {form.hasBabySeat && <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-md text-xs">{language === "th" ? `เบาะเด็กอ่อน (${form.babySeatCount})` : `Baby Seat (${form.babySeatCount})`}</span>}
                          {form.hasElderlyCare && <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-md text-xs">{language === "th" ? "ดูแลผู้สูงอายุ" : "Elderly Care"}</span>}
                          {form.hasStopover && <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-md text-xs">{language === "th" ? "จุดแวะพัก" : "Stopover"}</span>}
                        </div>
                      </div>
                    </>
                  )}

                  {form.additionalDetails && form.additionalDetails.trim() && (
                    <>
                      <div className="h-px border-t border-dashed border-slate-200 my-2" />
                      <div className="flex flex-col gap-1 text-left">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                          {language === "th" ? "บันทึกเพิ่มเติม" : "Notes / Requests"}
                        </span>
                        <span className="font-semibold text-slate-700 leading-snug break-words pl-2 border-l-2 border-[#3668FF]/30">{form.additionalDetails.trim()}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Total price block — shown above barcode when price is known */}
                {form.hasSelectedVehicle && (() => {
                  const receiptPrice = getPrice(form.pickupRegion, form.dropoffRegion, form.pickupUpcountryCity, form.vehicleType);
                  return receiptPrice ? (
                    <div className="mx-[-20px] mb-0 mt-4 px-5 py-3.5 bg-[#3668FF] flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">
                          {language === "th" ? "ราคาสุทธิ" : "Total Fare"}
                        </p>
                        <p className="text-[10px] text-white/80 font-medium">
                          {ROUTE_LABELS[receiptPrice.routeKey].from} → {ROUTE_LABELS[receiptPrice.routeKey].to}
                        </p>
                      </div>
                      <p className="text-2xl font-black text-white">฿{receiptPrice.price.toLocaleString()}</p>
                    </div>
                  ) : null;
                })()}

                {/* Barcode representation */}
                <div className="pt-4 border-t border-dashed border-slate-300 flex flex-col items-center gap-1.5">
                  {/* Barcode lines */}
                  <div className="flex items-stretch h-8 gap-[1.5px] opacity-75">
                    <div className="w-[1px] bg-slate-900" />
                    <div className="w-[2px] bg-slate-900" />
                    <div className="w-[1px] bg-slate-900" />
                    <div className="w-[3px] bg-slate-900" />
                    <div className="w-[1px] bg-slate-900" />
                    <div className="w-[4px] bg-slate-900" />
                    <div className="w-[2px] bg-slate-900" />
                    <div className="w-[1px] bg-slate-900" />
                    <div className="w-[3px] bg-slate-900" />
                    <div className="w-[1px] bg-slate-900" />
                    <div className="w-[2px] bg-slate-900" />
                    <div className="w-[4px] bg-slate-900" />
                    <div className="w-[1px] bg-slate-900" />
                    <div className="w-[3px] bg-slate-900" />
                    <div className="w-[1px] bg-slate-900" />
                    <div className="w-[2px] bg-slate-900" />
                    <div className="w-[1px] bg-slate-900" />
                    <div className="w-[4px] bg-slate-900" />
                    <div className="w-[2px] bg-slate-900" />
                    <div className="w-[1px] bg-slate-900" />
                    <div className="w-[3px] bg-slate-900" />
                    <div className="w-[1px] bg-slate-900" />
                    <div className="w-[2px] bg-slate-900" />
                    <div className="w-[4px] bg-slate-900" />
                    <div className="w-[1px] bg-slate-900" />
                  </div>
                  <p className="text-xs font-mono tracking-widest text-slate-400">TAXISAVERTHAILAND</p>
                </div>
              </motion.div>

            ) : (
              <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-2xl p-8 text-center text-white/40 text-sm">
                {language === "th"
                  ? "รายละเอียดใบเสร็จสรุปการจองของคุณจะถูกแสดงที่นี่แบบเรียลไทม์เมื่อคุณกรอกข้อมูลในแบบฟอร์ม"
                  : "Your booking summary receipt will be generated here in real-time as you fill out the form."}
              </div>
            )}

            {/* Action buttons under receipt */}
            {(form.customerName || form.phone || form.email || form.travelDate || form.travelTime || form.pickupRegion || form.additionalDetails) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  className="text-xs bg-white text-[#3668FF] hover:text-blue-400 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:border-white/30 bg-white"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  {language === "th" ? "ดาวน์โหลดใบเสร็จ" : "Download Receipt"}
                </button>

                {isFormDirty && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-white bg-red-500 hover:text-red-300 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500 hover:border-red-500 bg-red-500 hover:bg-red-500"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {language === "th" ? "ล้างข้อมูล" : "Clear Details"}
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* ── RIGHT: form card ────────────────────────────────────────── */}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[62%] bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden"
          >

            {bookingStatus === "success" ? (
              <div className="p-6 sm:p-8 md:p-10">
                {renderSuccessScreen()}
              </div>
            ) : (
              <>
                {/* Step progress header */}
                <div className="px-6 sm:px-8 md:px-10 pt-8 pb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Left side: Step text */}
                  <div>
                    <p className="text-[#3668FF] font-semibold text-xs tracking-wider uppercase mb-1">
                      {language === "th"
                        ? `ขั้นตอนที่ ${step + 1} จาก ${STEPS.length}`
                        : `Step ${step + 1} of ${STEPS.length}`
                      }
                    </p>
                    <h3 className="text-slate-900 text-xl font-bold">{STEP_INFO[step].title}</h3>
                  </div>

                  {/* Right side: Progress indicator circles */}
                  <div className="flex items-center">
                    {STEPS.map((_, i) => (
                      <div key={i} className="flex items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-300 ${i < step ? "bg-emerald-500 border-emerald-500 text-white"
                            : i === step ? "bg-[#3668FF] border-[#3668FF] text-white shadow-lg shadow-blue-500/15"
                              : "bg-transparent border-slate-200 text-slate-300"
                          }`}>
                          {i < step ? "✓" : i + 1}
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className={`h-[1px] w-6 transition-all duration-300 ${i < step ? "bg-emerald-500" : "bg-slate-100"}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step content with animated transition */}
                <div className="p-6 sm:p-8 md:p-10">
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{STEP_INFO[step].body}</p>

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
                  <div className={`flex mt-8 pt-6 border-t border-slate-100 ${step > 0 ? "justify-between" : "justify-end"}`}>
                    {step > 0 && (
                      <button type="button" onClick={goBack}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 text-sm font-semibold transition-all cursor-pointer">
                        {language === "th" ? "← ย้อนกลับ" : "← Back"}
                      </button>
                    )}
                    {step < STEPS.length - 1 && (
                      <button type="button" onClick={goNext}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3668FF] hover:bg-[#2a56e0] text-white text-sm font-bold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]">
                        {language === "th" ? "ดำเนินการต่อ →" : "Continue →"}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>

        </div>
      </div>
      <EmailModal />
      <ClearConfirmModal />

      {/* Dynamic Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 right-6 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-sm font-semibold select-none bg-slate-900 border-slate-800 text-white"
          >
            <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
