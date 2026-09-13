"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { User, Baby, Briefcase, Plane, FileText, UserCheck } from "lucide-react";
import routeData from "../route.json";

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
  dropoffRegion: DropoffKey | null;
  dropoffAddress: string;
  vehicleType: VehicleType;
  driverType: DriverType;
  additionalDetails: string;
  hasSelectedVehicle: boolean;
  adults: number;
  children: number;
  flightNumber: string;
  largeLuggage: number;
  smallLuggage: number;
}

// ── Static data ──────────────────────────────────────────────────────────────
const PICKUP_KEYS: PickupKey[] = ["don_mueang", "suvarnabhumi", "upcountry", "hotel_bkk"];

const UPCOUNTRY_CITIES: { id: UpcountryCity; name: string }[] = [
  { id: "pattaya", name: "Pattaya" },
  { id: "hua_hin", name: "Hua Hin" },
];

const DROPOFF_MAP: Record<PickupKey, DropoffKey[]> = {
  don_mueang: ["hotel_bkk", "pattaya", "hua_hin"],
  suvarnabhumi: ["hotel_bkk", "pattaya", "hua_hin"],
  upcountry: ["bkk_area", "don_mueang", "suvarnabhumi"],
  hotel_bkk: ["pattaya", "hua_hin"],
};

const DROPOFF_NEEDS_ADDRESS: Record<DropoffKey, boolean> = {
  don_mueang: false,
  suvarnabhumi: false,
  hotel_bkk: true,
  bkk_area: true,
  pattaya: true,
  hua_hin: true,
};

const LOCATION_TEXT: Record<string, { th: { name: string; desc: string }; en: { name: string; desc: string } }> = {
  don_mueang: { th: { name: "สนามบินดอนเมือง", desc: "สนามบินดอนเมือง (DMK)" }, en: { name: "Don Mueang Airport", desc: "International Airport (DMK)" } },
  suvarnabhumi: { th: { name: "สนามบินสุวรรณภูมิ", desc: "สนามบินสุวรรณภูมิ (BKK)" }, en: { name: "Suvarnabhumi Airport", desc: "International Airport (BKK)" } },
  upcountry: { th: { name: "ต่างจังหวัด", desc: "พัทยา · หัวหิน" }, en: { name: "Upcountry", desc: "Pattaya · Hua Hin" } },
  hotel_bkk: { th: { name: "กรุงเทพฯ (ตัวเมือง)", desc: "ระบุชื่อโรงแรมหรือสถานที่ส่ง" }, en: { name: "Bangkok City", desc: "Any hotel or location in Bangkok" } },
  bkk_area: { th: { name: "กรุงเทพฯ (ตัวเมือง)", desc: "โรงแรมหรือสถานที่ส่งในกรุงเทพฯ" }, en: { name: "Bangkok Area", desc: "Hotel or area in Bangkok" } },
  pattaya: { th: { name: "พัทยา", desc: "โรงแรมหรือสถานที่ส่งในพัทยา" }, en: { name: "Pattaya", desc: "Hotel or address in Pattaya" } },
  hua_hin: { th: { name: "หัวหิน", desc: "โรงแรมหรือสถานที่ส่งในหัวหิน" }, en: { name: "Hua Hin", desc: "Hotel or address in Hua Hin" } },
};

const DRIVER_TYPES: { id: DriverType; nameTh: string; nameEn: string; descTh: string; descEn: string }[] = [
  { id: "general", nameTh: "คนขับทั่วไป", nameEn: "General Driver", descTh: "คนขับรถมืออาชีพ (ชาย/หญิง)", descEn: "Any professional driver" },
  { id: "women", nameTh: "คนขับผู้หญิง", nameEn: "Women Driver", descTh: "เฉพาะคนขับผู้หญิงเท่านั้น", descEn: "Female driver only" },
];

const FLEET_CATEGORIES = [
  { id: "sedan_s" as VehicleType, nameTh: "รถเก๋ง (Sedan)", nameEn: "Sedan", capTh: "ผู้โดยสาร 1–3 ท่าน", capEn: "1–3 passengers", isMatch: (v: VehicleType) => ["sedan_s", "sedan_m", "sedan_l"].includes(v) },
  { id: "suv" as VehicleType, nameTh: "รถอเนกประสงค์ (SUV)", nameEn: "SUV", capTh: "ผู้โดยสาร 1–4 ท่าน", capEn: "1–4 passengers", isMatch: (v: VehicleType) => v === "suv" },
  { id: "van" as VehicleType, nameTh: "รถตู้ VIP (Van)", nameEn: "Van", capTh: "ผู้โดยสาร 4–6 ท่าน", capEn: "4–6 passengers", isMatch: (v: VehicleType) => v === "van" },
];

const SEDAN_SIZES: { id: VehicleType; label: string; descTh: string; descEn: string }[] = [
  { id: "sedan_s", label: "S", descTh: "ประหยัด · 2 ใบ", descEn: "Economy · 2 bags" },
  { id: "sedan_m", label: "M", descTh: "คอมฟอร์ต · 3 ใบ", descEn: "Comfort · 3 bags" },
  { id: "sedan_l", label: "L", descTh: "ผู้บริหาร · 3 ใบ", descEn: "Executive · 3 bags" },
];

const PREDEFINED_COUNTRY_CODES = [
  { code: "+66", label: "TH +66" },
  { code: "+65", label: "SG +65" },
  { code: "+60", label: "MY +60" },
  { code: "+62", label: "ID +62" },
  { code: "+63", label: "PH +63" },
  { code: "+84", label: "VN +84" },
  { code: "+86", label: "CN +86" },
  { code: "+852", label: "HK +852" },
  { code: "+886", label: "TW +886" },
  { code: "+81", label: "JP +81" },
  { code: "+82", label: "KR +82" },
  { code: "+91", label: "IN +91" },
  { code: "+61", label: "AU +61" },
  { code: "+44", label: "GB +44" },
  { code: "+1", label: "US +1" },
  { code: "+49", label: "DE +49" },
  { code: "+33", label: "FR +33" },
  { code: "+7", label: "RU +7" },
];

// ── Route Pricing Table ─────────────────────────────────────────────────────
type RouteKey =
  | "pattaya_bkk_airport"
  | "pattaya_bkk_city"
  | "pattaya_dmk"
  | "bkk_airport_huahin"
  | "pattaya_huahin"
  | "dmk_huahin"
  | "bkk_city_huahin"
  | "dmk_bkk_city"
  | "bkk_airport_city";

const ROUTE_PRICES: Record<VehicleType, Record<RouteKey, number>> = {} as any;
const ROUTE_LABELS: Record<RouteKey, { from: string; to: string }> = {} as any;

routeData.routes.forEach((r: any) => {
  const key = r.id as RouteKey;
  ROUTE_LABELS[key] = { from: r.from, to: r.to };
  Object.keys(r.prices).forEach((vType) => {
    const vt = vType as VehicleType;
    if (!ROUTE_PRICES[vt]) ROUTE_PRICES[vt] = {} as any;
    ROUTE_PRICES[vt][key] = r.prices[vType];
  });
});

function getRouteKey(pickup: string | null, dropoff: string | null): RouteKey | null {
  if (!pickup || !dropoff) return null;
  const p = pickup;
  const d = dropoff;

  if (p === "don_mueang" && (d === "hotel_bkk" || d === "bkk_area")) return "dmk_bkk_city";
  if (p === "suvarnabhumi" && (d === "hotel_bkk" || d === "bkk_area")) return "bkk_airport_city";
  if ((p === "upcountry" && d === "suvarnabhumi") || (p === "suvarnabhumi" && d === "pattaya")) return "pattaya_bkk_airport";
  if ((p === "upcountry" && d === "don_mueang") || (p === "don_mueang" && d === "pattaya")) return "pattaya_dmk";
  if ((p === "upcountry" && (d === "hotel_bkk" || d === "bkk_area")) || (p === "hotel_bkk" && d === "pattaya")) return "pattaya_bkk_city";

  if (d === "hua_hin" || p === "upcountry") {
    if (p === "suvarnabhumi" && d === "hua_hin") return "bkk_airport_huahin";
    if (p === "don_mueang" && d === "hua_hin") return "dmk_huahin";
    if (p === "hotel_bkk" && d === "hua_hin") return "bkk_city_huahin";
    if (p === "upcountry" && d === "hua_hin") return "pattaya_huahin";
  }
  if (p === "suvarnabhumi" && d === "hua_hin") return "bkk_airport_huahin";
  if (p === "don_mueang" && d === "hua_hin") return "dmk_huahin";
  if ((p === "hotel_bkk" || p === "bkk_area") && d === "hua_hin") return "bkk_city_huahin";

  return null;
}

function getPrice(pickup: string | null, dropoff: string | null, pickupCity: string | null, vehicle: VehicleType): { routeKey: RouteKey; price: number } | null {
  const key = getRouteKey(pickup === "upcountry" && pickupCity === "hua_hin" ? "upcountry_huahin" : pickup, dropoff);
  if (!key || !ROUTE_PRICES[vehicle]?.[key]) return null;
  return { routeKey: key, price: ROUTE_PRICES[vehicle][key] };
}

// ── Helpers ─────────────────────────────────────────────────────────────────
const inputCls = (err?: string) =>
  `w-full bg-slate-50 border ${err ? "border-red-500" : "border-slate-200"} text-slate-900 rounded-xl px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:border-[#3668FF] focus:ring-2 focus:ring-[#3668FF]/15 transition-all text-sm`;

const cardCls = (selected: boolean) =>
  `flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
    selected
      ? "bg-blue-50/50 border-[#3668FF] shadow-[0_0_12px_rgba(54,104,255,0.08)] text-[#3668FF]"
      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
  }`;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
  exit: (dir: number) => ({ x: dir < 0 ? 48 : -48, opacity: 0, transition: { duration: 0.2 } }),
};

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
  dropoffRegion: null,
  dropoffAddress: "",
  vehicleType: "sedan_s",
  driverType: "general",
  additionalDetails: "",
  hasSelectedVehicle: false,
  adults: 1,
  children: 0,
  flightNumber: "",
  largeLuggage: 0,
  smallLuggage: 0,
};

// ── Subcomponent: Counter ───────────────────────────────────────────────────
function CounterRow({ icon, title, desc, value, onMinus, onPlus }: { icon: React.ReactNode; title: string; desc?: string; value: number; onMinus: () => void; onPlus: () => void }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl">
      <div className="text-left">
        <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          {icon}
          {title}
        </span>
        {desc && <span className="text-xs text-slate-500 block">{desc}</span>}
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMinus} className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer select-none">-</button>
        <span className="text-sm font-bold w-4 text-center text-slate-800">{value}</span>
        <button type="button" onClick={onPlus} className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer select-none">+</button>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [isLoaded, setIsLoaded] = useState(false);
  const [todayStr, setTodayStr] = useState("");
  const [isCustomCc, setIsCustomCc] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const hasAirport =
    form.pickupRegion === "don_mueang" ||
    form.pickupRegion === "suvarnabhumi" ||
    form.dropoffRegion === "don_mueang" ||
    form.dropoffRegion === "suvarnabhumi";

  // Load from localStorage
  useEffect(() => {
    try {
      const savedForm = localStorage.getItem(STORAGE_KEY_FORM);
      if (savedForm) {
        const parsed = JSON.parse(savedForm);
        setForm({ ...DEFAULT_FORM, ...parsed });
        const isPredefined = PREDEFINED_COUNTRY_CODES.some(c => c.code === parsed.phoneCountryCode);
        if (parsed.phoneCountryCode && !isPredefined) setIsCustomCc(true);
      }
      const savedStep = localStorage.getItem(STORAGE_KEY_STEP);
      if (savedStep !== null) {
        const s = parseInt(savedStep, 10);
        if (!isNaN(s) && s >= 0 && s < 5) setStep(s);
      }
    } catch (e) {
      console.error(e);
    }
    const today = new Date();
    setTodayStr(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`);
    setIsLoaded(true);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_FORM, JSON.stringify(form));
    } catch (e) {
      console.error(e);
    }
  }, [form, isLoaded]);

  useEffect(() => {
    if (!hasAirport && form.flightNumber) set("flightNumber", "");
  }, [hasAirport, form.flightNumber]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_STEP, String(step));
    } catch (e) {
      console.error(e);
    }
  }, [step, isLoaded]);

  const confirmReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_FORM);
      localStorage.removeItem(STORAGE_KEY_STEP);
    } catch (e) {
      console.error(e);
    }
    setForm(DEFAULT_FORM);
    setStep(0);
    setErrors({});
    setShowClearModal(false);
  };

  const isFormDirty = Object.keys(form).some(k => {
    const key = k as keyof FormData;
    return form[key] !== DEFAULT_FORM[key];
  });

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => {
      const next = { ...prev, [key]: "" };
      if (key === "largeLuggage" || key === "smallLuggage") next.luggage = "";
      return next;
    });
  };

  const setMany = (updates: Partial<FormData>) => {
    setForm(prev => ({ ...prev, ...updates }));
    setErrors({});
  };

  // ── Labels & derived names ────────────────────────────────────────────────
  const locName = (id: string | null) => (id ? LOCATION_TEXT[id]?.[language === "th" ? "th" : "en"]?.name || id : "");
  const locDesc = (id: string | null) => (id ? LOCATION_TEXT[id]?.[language === "th" ? "th" : "en"]?.desc || "" : "");
  const cityName = (id: UpcountryCity | null) => (id === "pattaya" ? (language === "th" ? "พัทยา" : "Pattaya") : id === "hua_hin" ? (language === "th" ? "หัวหิน" : "Hua Hin") : "");

  const pickupLabel = (() => {
    if (!form.pickupRegion) return "";
    if (form.pickupRegion === "upcountry" && form.pickupUpcountryCity) {
      const c = cityName(form.pickupUpcountryCity);
      return form.pickupHotelName.trim() ? `${c} — ${form.pickupHotelName.trim()}` : c;
    }
    const r = locName(form.pickupRegion);
    return form.pickupRegion === "hotel_bkk" && form.pickupHotelName ? `${r} — ${form.pickupHotelName}` : r;
  })();

  const dropoffLabel = (() => {
    if (!form.dropoffRegion) return "";
    const name = locName(form.dropoffRegion);
    const needsAddress = DROPOFF_NEEDS_ADDRESS[form.dropoffRegion];
    return needsAddress && form.dropoffAddress ? `${name} — ${form.dropoffAddress}` : name;
  })();

  const vehicleNameMap: Record<VehicleType, { th: string; en: string }> = {
    sedan_s: { th: "Sedan S (1–3 ผู้โดยสาร)", en: "Sedan S (1–3 passengers)" },
    sedan_m: { th: "Sedan M (1–3 ผู้โดยสาร)", en: "Sedan M (1–3 passengers)" },
    sedan_l: { th: "Sedan L (1–3 ผู้โดยสาร)", en: "Sedan L (1–3 passengers)" },
    suv: { th: "SUV (1–4 ผู้โดยสาร)", en: "SUV (1–4 passengers)" },
    van: { th: "Van (4–6 ผู้โดยสาร)", en: "Van (4–6 passengers)" },
  };

  const compileMessage = () => {
    const isTh = language === "th";
    const vehicle = isTh ? vehicleNameMap[form.vehicleType].th : vehicleNameMap[form.vehicleType].en;
    const driver = isTh ? (form.driverType === "women" ? "คนขับหญิง" : "คนขับทั่วไป") : (form.driverType === "women" ? "Women Driver" : "General Driver");

    const luggageParts: string[] = [];
    if (form.largeLuggage > 0) luggageParts.push(`${form.largeLuggage} ${isTh ? "ใบใหญ่" : "Large"}`);
    if (form.smallLuggage > 0) luggageParts.push(`${form.smallLuggage} ${isTh ? "ใบเล็ก" : "Small"}`);
    const luggageStr = luggageParts.length > 0 ? luggageParts.join(", ") : (isTh ? "ไม่มี" : "None");

    const priceResult = getPrice(form.pickupRegion, form.dropoffRegion, form.pickupUpcountryCity, form.vehicleType);
    const priceStr = priceResult
      ? `฿${priceResult.price.toLocaleString()} (${ROUTE_LABELS[priceResult.routeKey].from} → ${ROUTE_LABELS[priceResult.routeKey].to}${isTh ? " รวมค่าทางด่วนทั้งหมด" : ", all tolls included"})`
      : (isTh ? "จะยืนยันภายหลัง" : "To be confirmed");

    if (isTh) {
      return `สวัสดีครับ/ค่ะ ต้องการจองรถแท็กซี่กับ Taxi Saver Thailand

👤 ชื่อ-นามสกุล: ${form.customerName}
📞 โทรศัพท์: ${form.phoneCountryCode} ${form.phone}${form.email ? `\n📧 อีเมล: ${form.email}` : ""}
📅 วันที่เดินทาง: ${form.travelDate || "ยังไม่ระบุ"}
⏰ เวลารับ: ${form.travelTime || "ยังไม่ระบุ"}
🧑‍🤝‍🧑 ผู้โดยสาร: ${form.adults} ผู้ใหญ่${form.children > 0 ? `, ${form.children} เด็ก` : ""}

📍 ต้นทาง: ${pickupLabel}
🏁 ปลายทาง: ${dropoffLabel}${hasAirport && form.flightNumber ? `\n✈️ เที่ยวบิน: ${form.flightNumber}` : ""}

🚗 รถ: ${vehicle}
🧑‍✈️ คนขับ: ${driver}
💼 สัมภาระ: ${luggageStr}
💰 ราคาประมาณ: ${priceStr}${form.additionalDetails ? `\n📝 หมายเหตุ: ${form.additionalDetails}` : ""}`;
    }

    return `Hello, I'd like to book a taxi with Taxi Saver Thailand.

👤 Name: ${form.customerName}
📞 Phone: ${form.phoneCountryCode} ${form.phone}${form.email ? `\n📧 Email: ${form.email}` : ""}
📅 Date: ${form.travelDate || "Not specified"}
⏰ Pick-up Time: ${form.travelTime || "Not specified"}
🧑‍🤝‍🧑 Passengers: ${form.adults} Adult${form.adults > 1 ? "s" : ""}${form.children > 0 ? `, ${form.children} Child${form.children > 1 ? "ren" : ""}` : ""}

📍 Pick-up: ${pickupLabel}
🏁 Drop-off: ${dropoffLabel}${hasAirport && form.flightNumber ? `\n✈️ Flight: ${form.flightNumber}` : ""}

🚗 Vehicle: ${vehicle}
🧑‍✈️ Driver: ${driver}
💼 Luggage: ${luggageStr}
💰 Est. Price: ${priceStr}${form.additionalDetails ? `\n📝 Notes: ${form.additionalDetails}` : ""}`;
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (s: number) => {
    const isTh = language === "th";
    const errs: Record<string, string> = {};
    if (s === 0) {
      if (!form.customerName.trim()) errs.customerName = isTh ? "กรุณากรอกชื่อ-นามสกุล" : "Name is required.";
      if (!form.phone.trim()) errs.phone = isTh ? "กรุณากรอกเบอร์โทรศัพท์" : "Phone number is required.";
      if (!form.travelDate) {
        errs.travelDate = isTh ? "กรุณาเลือกวันที่เดินทาง" : "Travel date is required.";
      } else if (todayStr && form.travelDate < todayStr) {
        errs.travelDate = isTh ? "วันที่เดินทางต้องไม่เป็นวันในอดีต" : "Travel date cannot be in the past.";
      }
      if (!form.travelTime) errs.travelTime = isTh ? "กรุณาระบุเวลาเข้ารับ" : "Pick-up time is required.";
    } else if (s === 1) {
      if (!form.pickupRegion) errs.pickupRegion = isTh ? "กรุณาเลือกสถานที่รับต้นทาง" : "Please select a pick-up location.";
      if (form.pickupRegion === "upcountry") {
        if (!form.pickupUpcountryCity) errs.pickupUpcountryCity = isTh ? "กรุณาเลือกเมือง" : "Please select a city.";
        else if (!form.pickupHotelName.trim()) errs.pickupHotelName = isTh ? "กรุณาระบุชื่อโรงแรมหรือที่อยู่ต้นทาง" : "Please specify the pick-up hotel or address.";
      }
      if (form.pickupRegion === "hotel_bkk" && !form.pickupHotelName.trim()) errs.pickupHotelName = isTh ? "กรุณาระบุชื่อโรงแรมหรือที่อยู่ต้นทาง" : "Please enter the hotel name or address.";
    } else if (s === 2) {
      if (!form.dropoffRegion) errs.dropoffRegion = isTh ? "กรุณาเลือกจุดส่งปลายทาง" : "Please select a drop-off location.";
      if (form.dropoffRegion && DROPOFF_NEEDS_ADDRESS[form.dropoffRegion] && !form.dropoffAddress.trim()) {
        errs.dropoffAddress = isTh ? "กรุณาระบุชื่อโรงแรมหรือที่อยู่ปลายทาง" : "Please specify the hotel name or address.";
      }
    } else if (s === 3) {
      if (form.largeLuggage === 0 && form.smallLuggage === 0) {
        errs.luggage = isTh ? "กรุณาระบุจำนวนสัมภาระ อย่างน้อย 1 ใบ" : "Please specify your luggage count (at least 1 luggage is required).";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => { if (!validate(step)) return; setDirection(1); setStep(s => s + 1); };
  const goBack = () => { setDirection(-1); setStep(s => s - 1); };

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleWhatsApp = () => {
    if (!validate(3)) return;
    window.open(`https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(compileMessage())}`, "_blank");
    setSubmitType("whatsapp");
    setBookingStatus("success");
  };

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(receiptRef.current, { cacheBust: true });
      const link = document.createElement("a");
      const safeName = form.customerName ? form.customerName.replace(/\s+/g, "-").toLowerCase() : "booking";
      link.download = `taxi-saver-receipt-${safeName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download receipt", err);
      alert("Unable to generate receipt image. Please try again.");
    }
  };

  const emailSubject = `Taxi Booking – ${form.customerName || "Customer"}`;
  const getGmailUrl = () => `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(compileMessage())}`;
  const getOutlookUrl = () => `https://outlook.live.com/default.aspx?rru=compose&to=${CONTACT_EMAIL}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(compileMessage())}`;

  // ── Step 0: Customer Info ─────────────────────────────────────────────────
  const renderStep0 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-base font-semibold text-slate-700 mb-2">
            {language === "th" ? "ชื่อ-นามสกุล" : "Full Name"} <span className="text-red-500">*</span>
          </label>
          <input suppressHydrationWarning type="text" value={form.customerName} onChange={e => set("customerName", e.target.value)}
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
                <input suppressHydrationWarning
                  type="text"
                  value={form.phoneCountryCode === "custom" ? "+" : form.phoneCountryCode}
                  onChange={e => {
                    let val = e.target.value;
                    if (!val.startsWith("+")) val = "+" + val.replace(/\+/g, "");
                    set("phoneCountryCode", "+" + val.slice(1).replace(/[^0-9]/g, ""));
                  }}
                  placeholder="+XX"
                  className="w-16 bg-transparent text-slate-800 text-sm font-semibold pl-3 pr-1 py-3 focus:outline-none text-center"
                />
                <button type="button" onClick={() => { setIsCustomCc(false); set("phoneCountryCode", "+66"); }} className="pr-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer select-none">✕</button>
              </div>
            ) : (
              <div className="relative border-r border-slate-200 bg-transparent flex items-center">
                <select suppressHydrationWarning
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
                  {PREDEFINED_COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                  <option value="custom">{language === "th" ? "อื่น ๆ (+)" : "Other (+)"}</option>
                </select>
                <div className="absolute right-2.5 pointer-events-none text-slate-500 flex items-center">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </div>
              </div>
            )}
            <input suppressHydrationWarning type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
              placeholder="081 234 5678" className="w-full bg-transparent px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none text-sm" />
          </div>
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-base font-semibold text-slate-700 mb-2">
          {language === "th" ? "อีเมล" : "Email Address"}{" "}
          <span className="text-slate-400 text-sm font-normal">({language === "th" ? "ไม่บังคับ" : "optional"})</span>
        </label>
        <input suppressHydrationWarning type="email" value={form.email} onChange={e => set("email", e.target.value)}
          placeholder="your.email@example.com" className={inputCls()} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-base font-semibold text-slate-700 mb-2">
            {language === "th" ? "วันที่เดินทาง" : "Travel Date"} <span className="text-red-500">*</span>
          </label>
          <input suppressHydrationWarning type="date" min={todayStr} value={form.travelDate} onChange={e => set("travelDate", e.target.value)}
            className={inputCls(errors.travelDate)} />
          {errors.travelDate && <p className="mt-1 text-sm text-red-500">{errors.travelDate}</p>}
        </div>
        <div>
          <label className="block text-base font-semibold text-slate-700 mb-2">
            {language === "th" ? "เวลาเข้ารับ" : "Pick-up Time"} <span className="text-red-500">*</span>
          </label>
          <input suppressHydrationWarning type="time" value={form.travelTime} onChange={e => set("travelTime", e.target.value)}
            className={inputCls(errors.travelTime)} />
          {errors.travelTime && <p className="mt-1 text-sm text-red-500">{errors.travelTime}</p>}
        </div>
      </div>
    </div>
  );

  // ── Step 1: Pick-up Location ──────────────────────────────────────────────
  const renderStep1 = () => (
    <div className="space-y-4">
      <p className="text-base text-slate-600">{language === "th" ? "คุณต้องการให้รถไปรับที่ไหน?" : "Where will you be picked up?"}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PICKUP_KEYS.map(id => {
          const selected = form.pickupRegion === id;
          return (
            <button key={id} type="button"
              onClick={() => setMany({ pickupRegion: id, pickupUpcountryCity: null, pickupHotelName: "", dropoffRegion: null, dropoffAddress: "" })}
              className={cardCls(selected)}>
              <div className="flex flex-col pr-2">
                <span className={`font-bold text-base ${selected ? "text-[#3668FF]" : "text-slate-800"}`}>{locName(id)}</span>
                <span className={`text-xs mt-1 ${selected ? "text-[#3668FF]/80" : "text-slate-500"}`}>{locDesc(id)}</span>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${selected ? "border-[#3668FF] bg-[#3668FF]" : "border-slate-300 bg-transparent"}`}>
                {selected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>
      {errors.pickupRegion && <p className="text-sm text-red-500">{errors.pickupRegion}</p>}

      {form.pickupRegion === "upcountry" && (
        <div className="space-y-2 pt-1">
          <p className="text-base font-semibold text-slate-700">{language === "th" ? "เมืองต้นทาง?" : "Which city?"}</p>
          <div className="grid grid-cols-2 gap-3">
            {UPCOUNTRY_CITIES.map(c => {
              const selected = form.pickupUpcountryCity === c.id;
              return (
                <button key={c.id} type="button" onClick={() => set("pickupUpcountryCity", c.id)}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${selected ? "bg-blue-50/50 border-[#3668FF] shadow-[0_0_12px_rgba(54,104,255,0.08)] text-[#3668FF]" : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"}`}>
                  <span className="text-sm font-bold">{cityName(c.id)}</span>
                </button>
              );
            })}
          </div>
          {errors.pickupUpcountryCity && <p className="text-sm text-red-500">{errors.pickupUpcountryCity}</p>}
        </div>
      )}

      {((form.pickupRegion === "upcountry" && form.pickupUpcountryCity) || form.pickupRegion === "hotel_bkk") && (
        <div className="pt-2">
          <label className="block text-base font-semibold text-slate-700 mb-2">
            {language === "th" ? "ชื่อโรงแรมหรือที่อยู่ต้นทาง" : "Hotel Name or Pick-up Address"} <span className="text-red-500">*</span>
          </label>
          <input suppressHydrationWarning type="text" value={form.pickupHotelName} onChange={e => set("pickupHotelName", e.target.value)}
            placeholder={language === "th" ? "เช่น Hilton Sukhumvit, บ้านเลขที่..." : "e.g. Hilton Sukhumvit, address..."}
            className={inputCls(errors.pickupHotelName)} />
          {errors.pickupHotelName && <p className="mt-1 text-sm text-red-500">{errors.pickupHotelName}</p>}
        </div>
      )}
    </div>
  );

  // ── Step 2: Drop-off Location ─────────────────────────────────────────────
  const dropoffKeys: DropoffKey[] = form.pickupRegion ? DROPOFF_MAP[form.pickupRegion] : [];
  const renderStep2 = () => (
    <div className="space-y-4">
      <p className="text-base text-slate-600">{language === "th" ? "คุณต้องการให้รถไปส่งที่ไหน?" : "Where is your destination?"}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {dropoffKeys.map(key => {
          const selected = form.dropoffRegion === key;
          return (
            <button key={key} type="button" onClick={() => setMany({ dropoffRegion: key, dropoffAddress: "" })} className={cardCls(selected)}>
              <div className="flex flex-col pr-2">
                <span className={`font-bold text-base ${selected ? "text-[#3668FF]" : "text-slate-800"}`}>{locName(key)}</span>
                <span className={`text-xs mt-1 ${selected ? "text-[#3668FF]/80" : "text-slate-500"}`}>{locDesc(key)}</span>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${selected ? "border-[#3668FF] bg-[#3668FF]" : "border-slate-300 bg-transparent"}`}>
                {selected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>
      {errors.dropoffRegion && <p className="text-sm text-red-500">{errors.dropoffRegion}</p>}

      {form.dropoffRegion && DROPOFF_NEEDS_ADDRESS[form.dropoffRegion] && (
        <div className="pt-2">
          <label className="block text-base font-semibold text-slate-700 mb-2">
            {language === "th" ? "ชื่อโรงแรมหรือที่อยู่ปลายทาง" : "Destination Hotel or Address"} <span className="text-red-500">*</span>
          </label>
          <input suppressHydrationWarning type="text" value={form.dropoffAddress} onChange={e => set("dropoffAddress", e.target.value)}
            placeholder={language === "th" ? "ชื่อโรงแรม หรือที่อยู่ในพื้นที่ปลายทาง" : "Hotel name or address"}
            className={inputCls(errors.dropoffAddress)} />
          {errors.dropoffAddress && <p className="mt-1 text-sm text-red-500">{errors.dropoffAddress}</p>}
        </div>
      )}
    </div>
  );

  // ── Step 3: Vehicle & Details ─────────────────────────────────────────────
  const renderStep3 = () => (
    <div className="space-y-8">
      {/* Fleet Type */}
      <div className="space-y-4">
        <label className="block text-base font-semibold text-slate-700 mb-1">{language === "th" ? "ประเภทรถยนต์" : "Fleet Type"}</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FLEET_CATEGORIES.map(cat => {
            const isSelected = cat.isMatch(form.vehicleType) && form.hasSelectedVehicle;
            const priceResult = getPrice(form.pickupRegion, form.dropoffRegion, form.pickupUpcountryCity, cat.id);
            return (
              <button key={cat.id} type="button" onClick={() => setMany({ vehicleType: cat.id, hasSelectedVehicle: true })}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer ${isSelected ? "bg-blue-50 border-[#3668FF] shadow-[0_0_16px_rgba(54,104,255,0.12)]" : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}>
                <div>
                  <div className={`font-bold text-sm sm:text-base ${isSelected ? "text-[#3668FF]" : "text-slate-800"}`}>{language === "th" ? cat.nameTh : cat.nameEn}</div>
                  <div className={`text-xs mt-0.5 ${isSelected ? "text-[#3668FF]/70" : "text-slate-400"}`}>{language === "th" ? cat.capTh : cat.capEn}</div>
                </div>
                {priceResult && (
                  <div className={`mt-1 px-3 py-1 rounded-full text-sm font-black shadow-sm border transition-all ${isSelected ? "bg-[#3668FF] text-white border-transparent" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                    ฿{priceResult.price.toLocaleString()}
                  </div>
                )}
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${isSelected ? "border-[#3668FF] bg-[#3668FF]" : "border-slate-300"}`}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {["sedan_s", "sedan_m", "sedan_l"].includes(form.vehicleType) && form.hasSelectedVehicle && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-3">
            <div className="grid grid-cols-3 gap-3">
              {SEDAN_SIZES.map(s => {
                const isSelected = form.vehicleType === s.id;
                const priceResult = getPrice(form.pickupRegion, form.dropoffRegion, form.pickupUpcountryCity, s.id);
                return (
                  <button key={s.id} type="button" onClick={() => setMany({ vehicleType: s.id, hasSelectedVehicle: true })}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all cursor-pointer ${isSelected ? "bg-white border-[#3668FF] shadow-[0_0_12px_rgba(54,104,255,0.12)]" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${isSelected ? "bg-[#3668FF] text-white" : "bg-slate-100 text-slate-600"}`}>{s.label}</div>
                    <div className={`text-xs font-semibold ${isSelected ? "text-[#3668FF]" : "text-slate-600"}`}>{language === "th" ? s.descTh : s.descEn}</div>
                    {priceResult && <div className="text-xs sm:text-sm font-bold text-emerald-700">฿{priceResult.price.toLocaleString()}</div>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Driver preference */}
      <div>
        <label className="block text-base font-semibold text-slate-700 mb-3">{language === "th" ? "ประเภทคนขับที่ต้องการ" : "Driver Preference"}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DRIVER_TYPES.map(d => {
            const selected = form.driverType === d.id;
            return (
              <button key={d.id} type="button" onClick={() => set("driverType", d.id)} className={cardCls(selected)}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${selected ? "bg-blue-100 text-[#3668FF]" : "bg-slate-100 text-slate-500"}`}>
                    {d.id === "general" ? <UserCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className={`font-bold text-sm sm:text-base ${selected ? "text-[#3668FF]" : "text-slate-800"}`}>{language === "th" ? d.nameTh : d.nameEn}</span>
                    <span className={`text-xs mt-0.5 ${selected ? "text-[#3668FF]/85" : "text-slate-500"}`}>{language === "th" ? d.descTh : d.descEn}</span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${selected ? "border-[#3668FF] bg-[#3668FF]" : "border-slate-300 bg-transparent"}`}>
                  {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Passengers & Luggage Counters */}
      <div className="space-y-4">
        <label className="block text-base font-semibold text-slate-700">{language === "th" ? "จำนวนผู้โดยสาร" : "Passengers"} <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CounterRow icon={<User className="w-4 h-4 text-slate-500" />} title={language === "th" ? "ผู้ใหญ่" : "Adults"} value={form.adults} onMinus={() => set("adults", Math.max(1, form.adults - 1))} onPlus={() => set("adults", form.adults + 1)} />
          <CounterRow icon={<Baby className="w-4 h-4 text-slate-500" />} title={language === "th" ? "เด็ก" : "Children"} value={form.children} onMinus={() => set("children", Math.max(0, form.children - 1))} onPlus={() => set("children", form.children + 1)} />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-base font-semibold text-slate-700">{language === "th" ? "ข้อมูลกระเป๋าสัมภาระ" : "Luggage"} <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CounterRow icon={<Briefcase className="w-4 h-4 text-slate-500" />} title={language === "th" ? "กระเป๋าใบใหญ่" : "Large Luggage"} desc={language === "th" ? "ขนาด 24 นิ้วขึ้นไป" : "24\" or larger"} value={form.largeLuggage} onMinus={() => set("largeLuggage", Math.max(0, form.largeLuggage - 1))} onPlus={() => set("largeLuggage", form.largeLuggage + 1)} />
          <CounterRow icon={<Briefcase className="w-4 h-4 text-slate-500" />} title={language === "th" ? "กระเป๋าใบเล็ก" : "Small Luggage"} desc={language === "th" ? "ถือขึ้นเครื่อง / เป้" : "Hand-carry"} value={form.smallLuggage} onMinus={() => set("smallLuggage", Math.max(0, form.smallLuggage - 1))} onPlus={() => set("smallLuggage", form.smallLuggage + 1)} />
        </div>
        {errors.luggage && <p className="text-sm text-red-500">{errors.luggage}</p>}
      </div>

      {/* Flight Number (if airport) */}
      {hasAirport && (
        <div className="space-y-2">
          <label className="block text-base font-semibold text-slate-700 flex items-center gap-1.5">
            <Plane className="w-4 h-4 text-slate-500" />
            {language === "th" ? "หมายเลขเที่ยวบิน" : "Flight Number"} <span className="text-slate-400 text-sm font-normal">({language === "th" ? "ไม่บังคับ" : "optional"})</span>
          </label>
          <div className="relative">
            <Plane className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input suppressHydrationWarning type="text" value={form.flightNumber} onChange={e => set("flightNumber", e.target.value.toUpperCase())}
              placeholder={language === "th" ? "เช่น TG 413, FD 3201" : "e.g., TG 413, FD 3201"} className={`${inputCls()} pl-11`} />
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-base font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-slate-500" />
          {language === "th" ? "ข้อมูลเพิ่มเติม / คำขอพิเศษ" : "Additional Notes / Requests"} <span className="text-slate-400 text-sm font-normal">({language === "th" ? "ไม่บังคับ" : "optional"})</span>
        </label>
        <textarea suppressHydrationWarning value={form.additionalDetails} onChange={e => set("additionalDetails", e.target.value)} rows={3}
          placeholder={language === "th" ? "ระบุอาคารผู้โดยสาร หรือคำแนะนำเพิ่มเติม..." : "Flight terminal, special instructions..."} className={inputCls()} />
      </div>
    </div>
  );

  // ── Step 4: Summary & Submit ──────────────────────────────────────────────
  const renderStep4 = () => {
    const priceResult = getPrice(form.pickupRegion, form.dropoffRegion, form.pickupUpcountryCity, form.vehicleType);
    return (
      <div className="space-y-6 py-4">
        {priceResult && (
          <div className="bg-gradient-to-br from-[#3668FF]/10 to-[#3668FF]/5 border border-[#3668FF]/25 rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#3668FF] mb-3">{language === "th" ? "ราคาประเมิน" : "Estimated Price"}</p>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-slate-600 text-sm mb-0.5">{ROUTE_LABELS[priceResult.routeKey].from} → {ROUTE_LABELS[priceResult.routeKey].to}</p>
                <p className="text-slate-500 text-sm">{language === "th" ? "ประเภทรถ: " : "Vehicle: "}<span className="font-bold text-slate-700">{form.vehicleType.toUpperCase()}</span></p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-3xl font-black text-[#3668FF]">฿{priceResult.price.toLocaleString()}</p>
                <p className="text-xs text-slate-400">{language === "th" ? "รวมค่าทางด่วนแล้ว" : "All tolls included"}</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <p className="text-left text-sm font-semibold tracking-wider text-slate-500 mb-4">{language === "th" ? "เลือกช่องทางการส่งข้อมูลการจอง" : "Select a booking channel"}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button type="button" onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 rounded-xl font-bold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 32 32"><path d="M16.003 2.667C8.636 2.667 2.667 8.636 2.667 16.003c0 2.358.638 4.614 1.807 6.56L2.667 29.333l6.96-1.784a13.29 13.29 0 0 0 6.376 1.624c7.367 0 13.336-5.969 13.336-13.337 0-7.367-5.969-13.336-13.336-13.169zM22.88 20.88c-.27.757-1.587 1.448-2.16 1.488-.573.04-1.12.27-3.776-.787-3.2-1.28-5.227-4.507-5.387-4.72-.16-.213-1.28-1.707-1.28-3.253 0-1.547.81-2.307 1.097-2.613.287-.307.627-.384.836-.384.21 0 .42.002.603.01.193.01.453-.073.707.54.267.64.907 2.21.987 2.37.08.16.133.347.027.56-.107.213-.16.347-.32.533-.16.187-.337.418-.48.56-.16.16-.327.333-.14.653.187.32.83 1.373 1.787 2.227 1.227 1.093 2.267 1.44 2.587 1.6.32.16.507.133.693-.08.187-.213.8-.933 1.013-1.253.213-.32.427-.267.72-.16.293.107 1.853.875 2.173 1.035.32.16.533.24.613.373.08.133.08.76-.187 1.52z" /></svg>
              {language === "th" ? "จองผ่าน WhatsApp" : "WhatsApp Booking"}
            </button>
            <button type="button" onClick={() => setShowEmailModal(true)}
              className="w-full flex items-center justify-center gap-2.5 bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl font-bold transition-all cursor-pointer hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
              {language === "th" ? "จองผ่าน Email" : "Email Booking"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSuccessScreen = () => (
    <div className="text-center py-10 px-4 space-y-6">
      <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(16,185,129,0.08)]">
        <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-slate-900">{language === "th" ? "ส่งคำขอจองรถเรียบร้อยแล้ว!" : "Booking Request Forwarded!"}</h3>
        <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
          {language === "th"
            ? "รายละเอียดการจองของคุณได้รับการจัดเตรียมแล้ว ทีมงานของเราจะติดต่อกลับเพื่อยืนยันการจัดหารถและสรุปราคาโดยเร็วที่สุด"
            : "Your booking details have been prepared. Our team will contact you shortly to confirm driver allocation and pricing."}
        </p>
      </div>
      <div className="inline-flex flex-col items-center justify-center bg-blue-50/50 border border-blue-100 rounded-2xl px-5 py-3.5 space-y-1">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest">{language === "th" ? "เบอร์ติดต่อบริษัท" : "Company Contact"}</span>
        <a href="tel:+66624494253" className="flex items-center gap-2 text-lg font-extrabold text-[#3668FF] hover:text-[#2a56e0] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
          +66 62 449 4253
        </a>
      </div>
      <div className="flex gap-3 justify-center pt-4">
        <button type="button" onClick={() => { setForm(DEFAULT_FORM); setStep(0); setBookingStatus("filling"); setErrors({}); }}
          className="px-6 py-3 rounded-xl bg-[#3668FF] hover:bg-[#2a56e0] text-white font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
          {language === "th" ? "จองรถบริการคันอื่นเพิ่ม" : "Book Another Ride"}
        </button>
      </div>
    </div>
  );

  const stepRenderers = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4];

  // ── Render Form ───────────────────────────────────────────────────────────
  return (
    <section id="booking" className="relative w-full bg-transparent overflow-hidden scroll-mt-20">
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16 py-8 md:py-12 xl:py-14">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight text-white">{t.bookYourRide}</h1>
          <span className="text-white/50">{t.fillFormBelow}</span>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-8 items-start">
          {/* ── LEFT: live receipt summary ── */}
          <div className="w-full lg:w-[38%] text-white lg:sticky lg:top-28">
            {(form.customerName || form.phone || form.travelDate || form.pickupRegion) ? (
              <div ref={receiptRef} className="relative bg-white text-slate-900 rounded-2xl p-5 shadow-2xl overflow-hidden font-sans border-t-[8px] border-[#3668FF] pb-7">
                <div className="text-center pb-4 border-b border-dashed border-slate-300">
                  <p className="font-black uppercase text-[#3668FF]">{t.bookingSummary}</p>
                  <p className="text-sm font-mono text-slate-400 mt-1">NO: TST-{new Date(form.travelDate || Date.now()).getFullYear() || 2026}{String(form.phone || "").slice(-4).padStart(4, "0")}</p>
                </div>

                <div className="py-4 space-y-3 text-sm">
                  {form.customerName && (
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">{language === "th" ? "ผู้โดยสาร" : "Passenger"}</span>
                      <span className="font-bold text-right text-slate-800">{form.customerName}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">{language === "th" ? "จำนวนผู้โดยสาร" : "Passengers"}</span>
                    <span className="font-bold text-slate-800">
                      {language === "th" ? `ผู้ใหญ่ ${form.adults} ท่าน` : `${form.adults} Adult${form.adults > 1 ? "s" : ""}`}
                      {form.children > 0 && `, ${language === "th" ? `เด็ก ${form.children} ท่าน` : `${form.children} Child${form.children > 1 ? "ren" : ""}`}`}
                    </span>
                  </div>
                  {form.phone && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">{language === "th" ? "เบอร์โทรศัพท์" : "Phone"}</span>
                      <span className="font-bold text-slate-800">{form.phoneCountryCode} {form.phone}</span>
                    </div>
                  )}
                  {form.email && (
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">{language === "th" ? "อีเมล" : "Email"}</span>
                      <span className="font-semibold text-slate-800 text-right break-all">{form.email}</span>
                    </div>
                  )}

                  <div className="h-px border-t border-dashed border-slate-200 my-2" />

                  {form.travelDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">{language === "th" ? "วันที่เดินทาง" : "Date"}</span>
                      <span className="font-bold text-slate-800">{form.travelDate}</span>
                    </div>
                  )}
                  {form.travelTime && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">{language === "th" ? "เวลาเข้ารับ" : "Time"}</span>
                      <span className="font-bold text-slate-800">{form.travelTime}</span>
                    </div>
                  )}

                  <div className="h-px border-t border-dashed border-slate-200 my-2" />

                  {pickupLabel && (
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">{language === "th" ? "ต้นทาง (จุดรับ)" : "From (Pick-up)"}</span>
                      <span className="font-bold text-slate-800 pl-2 border-l-2 border-[#1DA58C] leading-snug">{pickupLabel}</span>
                    </div>
                  )}
                  {dropoffLabel && (
                    <div className="flex flex-col gap-1 text-left mt-2">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">{language === "th" ? "ปลายทาง (จุดส่ง)" : "To (Drop-off)"}</span>
                      <span className="font-bold text-slate-800 pl-2 border-l-2 border-red-400 leading-snug">{dropoffLabel}</span>
                    </div>
                  )}

                  {form.hasSelectedVehicle && (
                    <>
                      <div className="h-px border-t border-dashed border-slate-200 my-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">{language === "th" ? "รถยนต์" : "Vehicle"}</span>
                        <span className="font-bold text-slate-800 uppercase text-sm">{form.vehicleType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">{language === "th" ? "คนขับรถ" : "Driver"}</span>
                        <span className="font-bold text-slate-800 text-sm">{form.driverType === "women" ? (language === "th" ? "ผู้หญิง" : "Female") : (language === "th" ? "ทั่วไป" : "Standard")}</span>
                      </div>
                      {(form.largeLuggage > 0 || form.smallLuggage > 0) && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">{language === "th" ? "สัมภาระ" : "Luggage"}</span>
                          <span className="font-bold text-slate-800">
                            {language === "th" ? `ใหญ่ ${form.largeLuggage}, เล็ก ${form.smallLuggage}` : `${form.largeLuggage} L, ${form.smallLuggage} S`}
                          </span>
                        </div>
                      )}
                      {(() => {
                        const p = getPrice(form.pickupRegion, form.dropoffRegion, form.pickupUpcountryCity, form.vehicleType);
                        return p ? (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">{language === "th" ? "ราคาประเมิน" : "Est. Price"}</span>
                            <span className="font-extrabold text-[#3668FF] text-sm">฿{p.price.toLocaleString()}</span>
                          </div>
                        ) : null;
                      })()}
                    </>
                  )}
                </div>

                {/* Barcode representation */}
                <div className="pt-4 border-t border-dashed border-slate-300 flex flex-col items-center gap-1.5">
                  <div className="flex items-stretch h-8 gap-[1.5px] opacity-75">
                    {[1, 2, 1, 3, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1].map((w, i) => (
                      <div key={i} className="bg-slate-900" style={{ width: `${w}px` }} />
                    ))}
                  </div>
                  <p className="text-xs font-mono tracking-widest text-slate-400">TAXISAVERTHAILAND</p>
                </div>
              </div>
            ) : (
              <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-2xl p-8 text-center text-white/40 text-sm">
                {language === "th" ? "รายละเอียดใบเสร็จสรุปการจองจะแสดงที่นี่แบบเรียลไทม์" : "Your booking receipt will appear here in real-time."}
              </div>
            )}

            {(form.customerName || form.phone || form.travelDate || form.pickupRegion) && (
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={handleDownloadReceipt}
                  className="text-xs text-[#3668FF] bg-white font-semibold transition-colors cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg shadow-sm">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  {language === "th" ? "ดาวน์โหลดใบเสร็จ" : "Download Receipt"}
                </button>
                {isFormDirty && (
                  <button type="button" onClick={() => setShowClearModal(true)}
                    className="text-xs text-white bg-red-500 hover:bg-red-600 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    {language === "th" ? "ล้างข้อมูล" : "Clear Details"}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT: form card ── */}
          <div className="w-full lg:w-[62%] bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden">
            {bookingStatus === "success" ? (
              <div className="p-6 sm:p-8 md:p-10">{renderSuccessScreen()}</div>
            ) : (
              <>
                <div className="px-6 sm:px-8 md:px-10 pt-8 pb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-[#3668FF] font-semibold text-xs tracking-wider uppercase mb-1">
                      {language === "th" ? `ขั้นตอนที่ ${step + 1} จาก ${STEPS.length}` : `Step ${step + 1} of ${STEPS.length}`}
                    </p>
                    <h3 className="text-slate-900 text-xl font-bold">{STEP_INFO[step].title}</h3>
                  </div>
                  <div className="flex items-center">
                    {STEPS.map((_, i) => (
                      <div key={i} className="flex items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-300 ${i < step ? "bg-emerald-500 border-emerald-500 text-white" : i === step ? "bg-[#3668FF] border-[#3668FF] text-white shadow-lg shadow-blue-500/15" : "bg-transparent border-slate-200 text-slate-300"}`}>
                          {i < step ? "✓" : i + 1}
                        </div>
                        {i < STEPS.length - 1 && <div className={`h-[1px] w-6 transition-all duration-300 ${i < step ? "bg-emerald-500" : "bg-slate-100"}`} />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 sm:p-8 md:p-10">
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{STEP_INFO[step].body}</p>

                  <AnimatePresence mode="wait" custom={direction} initial={false}>
                    <motion.div key={step} custom={direction} variants={slideVariants} initial={false} animate="center" exit="exit">
                      {stepRenderers[step]()}
                    </motion.div>
                  </AnimatePresence>

                  <div className={`flex mt-8 pt-6 border-t border-slate-100 ${step > 0 ? "justify-between" : "justify-end"}`}>
                    {step > 0 && (
                      <button type="button" onClick={goBack} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 text-sm font-semibold transition-all cursor-pointer">
                        {language === "th" ? "← ย้อนกลับ" : "← Back"}
                      </button>
                    )}
                    {step < STEPS.length - 1 && (
                      <button type="button" onClick={goNext} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3668FF] hover:bg-[#2a56e0] text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer">
                        {language === "th" ? "ถัดไป →" : "Next →"}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Clear confirmation modal ── */}
      <AnimatePresence>
        {showClearModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backdropFilter: "blur(12px)", backgroundColor: "rgba(0,0,0,0.55)" }} onClick={() => setShowClearModal(false)}>
            <div onClick={e => e.stopPropagation()} className="bg-white border border-slate-200 rounded-3xl p-7 w-full max-w-sm shadow-2xl text-center select-none">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{language === "th" ? "ล้างข้อมูลการจอง?" : "Clear Booking Details?"}</h3>
              <p className="text-slate-500 text-sm mb-6">{language === "th" ? "คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมด?" : "Are you sure you want to clear all entered details?"}</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowClearModal(false)} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm cursor-pointer">{language === "th" ? "ยกเลิก" : "Cancel"}</button>
                <button type="button" onClick={confirmReset} className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm cursor-pointer">{language === "th" ? "ล้างทั้งหมด" : "Clear All"}</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Email client modal ── */}
      <AnimatePresence>
        {showEmailModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{ backdropFilter: "blur(12px)", backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setShowEmailModal(false)}>
            <div onClick={e => e.stopPropagation()} className="bg-white border border-slate-200 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
              <h3 className="text-xl font-bold text-slate-900 text-center mb-1">{language === "th" ? "ส่งทางอีเมล" : "Send via Email"}</h3>
              <p className="text-slate-500 text-sm text-center mb-7">{language === "th" ? "เลือกผู้ให้บริการอีเมลของคุณ" : "Choose your email client."}</p>
              <div className="space-y-3">
                <a href={getGmailUrl()} target="_blank" rel="noopener noreferrer" onClick={() => { setShowEmailModal(false); setBookingStatus("success"); }}
                  className="flex items-center gap-4 w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-2xl px-5 py-4 transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-[#EA4335] flex items-center justify-center flex-shrink-0 text-white font-black text-lg">G</div>
                  <div className="text-left">
                    <div className="font-bold text-base">Gmail</div>
                    <div className="text-xs text-slate-500">{language === "th" ? "เปิดใน Gmail" : "Open in Gmail"}</div>
                  </div>
                </a>
                <a href={getOutlookUrl()} target="_blank" rel="noopener noreferrer" onClick={() => { setShowEmailModal(false); setBookingStatus("success"); }}
                  className="flex items-center gap-4 w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-2xl px-5 py-4 transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-[#0078d4] flex items-center justify-center flex-shrink-0 text-white font-black text-lg">O</div>
                  <div className="text-left">
                    <div className="font-bold text-base">Outlook</div>
                    <div className="text-xs text-slate-500">{language === "th" ? "เปิดใน Outlook" : "Open in Outlook"}</div>
                  </div>
                </a>
              </div>
              <button type="button" onClick={() => setShowEmailModal(false)} className="w-full mt-5 py-3 rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm font-semibold cursor-pointer">
                {language === "th" ? "ยกเลิก" : "Cancel"}
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
