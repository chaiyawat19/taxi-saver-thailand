"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, X, Info } from "lucide-react";
import routeData from "../route.json";
import { useLanguage } from "../../public/context/LanguageContext";

// ── Data ──────────────────────────────────────────────────────────────────────

type VehicleId = "sedan_s" | "sedan_m" | "sedan_l" | "suv" | "van";

const VEHICLES: { id: VehicleId; name: string; capacity: string; color: string }[] = [
  { id: "sedan_s", name: "Sedan S", capacity: "1–3 pax", color: "#3668FF" },
  { id: "sedan_m", name: "Sedan M", capacity: "1–3 pax", color: "#6C47FF" },
  { id: "sedan_l", name: "Sedan L", capacity: "1–3 pax", color: "#9333ea" },
  { id: "suv", name: "SUV", capacity: "3–4 pax", color: "#1DA58C" },
  { id: "van", name: "Van", capacity: "3–4 pax", color: "#F59E0B" },
];

interface RouteItem {
  id: string;
  from: string;
  to: string;
  fromTag?: string;
  toTag?: string;
  group: string;
  groupIcon: string;
  prices: Record<VehicleId, number>;
}

const getGroupInfo = (fromLocation: string): { group: string; groupIcon: string } => {
  const locLower = fromLocation.toLowerCase();
  if (locLower.includes("pattaya")) {
    return { group: "Pattaya Routes", groupIcon: "" };
  }
  if (locLower.includes("suvarnabhumi") || locLower.includes("bkk")) {
    return { group: "Bangkok (BKK) Routes", groupIcon: "" };
  }
  if (locLower.includes("don mueang") || locLower.includes("dmk")) {
    return { group: "Don Mueang (DMK) Routes", groupIcon: "" };
  }
  if (locLower.includes("bangkok")) {
    return { group: "Bangkok City Routes", groupIcon: "" };
  }
  if (locLower.includes("hua hin")) {
    return { group: "Hua Hin Routes", groupIcon: "" };
  }
  return { group: "Other Routes", groupIcon: "" };
};

// ── Thai location name map ────────────────────────────────────────────────────
const TH_LOCATION: Record<string, string> = {
  "Pattaya": "พัทยา",
  "Suvarnabhumi (BKK)": "สนามบินสุวรรณภูมิ (BKK)",
  "Suvarnabhumi Airport": "สนามบินสุวรรณภูมิ",
  "Don Mueang (DMK)": "สนามบินดอนเมือง (DMK)",
  "Don Mueang Airport": "สนามบินดอนเมือง",
  "Bangkok City": "ตัวเมืองกรุงเทพ",
  "Bangkok Area": "เขตกรุงเทพฯ",
  "Hua Hin": "หัวหิน",
};
const thLoc = (name: string) => TH_LOCATION[name] ?? name;

const ALL_BIDIRECTIONAL_ROUTES: RouteItem[] = [];

routeData.routes.forEach((r: any) => {
  // 1. Forward direction
  const fInfo = getGroupInfo(r.from);
  ALL_BIDIRECTIONAL_ROUTES.push({
    id: `${r.id}_forward`,
    from: r.from,
    to: r.to,
    fromTag: r.fromTag || "",
    toTag: r.toTag || "",
    group: fInfo.group,
    groupIcon: fInfo.groupIcon,
    prices: r.prices,
  });

  // 2. Backward direction
  const bInfo = getGroupInfo(r.to);
  ALL_BIDIRECTIONAL_ROUTES.push({
    id: `${r.id}_backward`,
    from: r.to,
    to: r.from,
    fromTag: r.toTag || "",
    toTag: r.fromTag || "",
    group: bInfo.group,
    groupIcon: bInfo.groupIcon,
    prices: r.prices,
  });
});

// Group dynamically
const groupsMap: Record<string, { groupIcon: string; routes: RouteItem[] }> = {};
ALL_BIDIRECTIONAL_ROUTES.forEach((r: RouteItem) => {
  if (!groupsMap[r.group]) {
    groupsMap[r.group] = { groupIcon: r.groupIcon, routes: [] };
  }
  groupsMap[r.group].routes.push(r);
});

// Sort the tabs in a logical order
const PREFERRED_GROUP_ORDER = [
  "Bangkok (BKK) Routes",
  "Don Mueang (DMK) Routes",
  "Bangkok City Routes",
  "Pattaya Routes",
  "Hua Hin Routes",
];

const ROUTE_GROUPS = PREFERRED_GROUP_ORDER
  .filter(groupName => groupsMap[groupName])
  .map(groupName => ({
    groupName,
    groupIcon: groupsMap[groupName].groupIcon,
    routes: groupsMap[groupName].routes,
  }));

Object.keys(groupsMap).forEach(groupName => {
  if (!PREFERRED_GROUP_ORDER.includes(groupName)) {
    ROUTE_GROUPS.push({
      groupName,
      groupIcon: groupsMap[groupName].groupIcon,
      routes: groupsMap[groupName].routes,
    });
  }
});

const LOCATIONS = [
  { id: "Bangkok City", label: "Bangkok City / ตัวเมืองกรุงเทพ", aliases: ["bangkok city"] },
  { id: "Suvarnabhumi Airport", label: "Suvarnabhumi Airport (BKK) / สนามบินสุวรรณภูมิ", aliases: ["suvarnabhumi (bkk)", "suvarnabhumi airport"] },
  { id: "Don Mueang Airport", label: "Don Mueang Airport (DMK) / สนามบินดอนเมือง", aliases: ["don mueang (dmk)", "don mueang airport"] },
  { id: "Pattaya", label: "Pattaya / พัทยา", aliases: ["pattaya"] },
  { id: "Hua Hin", label: "Hua Hin / หัวหิน", aliases: ["hua hin"] },
];

const matchesLocation = (routeValue: string, selectedId: string) => {
  if (selectedId === "all") return true;
  const loc = LOCATIONS.find(l => l.id === selectedId);
  if (!loc) return false;
  const normalizedRoute = routeValue.toLowerCase().trim();
  return loc.aliases.some(alias => normalizedRoute.includes(alias) || alias.includes(normalizedRoute));
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function PricingTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPickup, setFilterPickup] = useState("all");
  const [filterDropoff, setFilterDropoff] = useState("all");
  const { language, t } = useLanguage();

  const isTh = language === "th";

  // ── Responsive page size ─────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const PAGE_SIZE = isMobile ? 5 : 10;

  // ── Pagination state ─────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);

  const handleClearSearch = () => { setSearchQuery(""); setCurrentPage(1); };

  // Filter routes based on search query
  const query = searchQuery.toLowerCase().trim();
  const searchResults = query
    ? ALL_BIDIRECTIONAL_ROUTES.filter((r: any) => {
      const thFrom = thLoc(r.from).toLowerCase();
      const thTo = thLoc(r.to).toLowerCase();
      return (
        r.from.toLowerCase().includes(query) ||
        r.to.toLowerCase().includes(query) ||
        thFrom.includes(query) ||
        thTo.includes(query) ||
        r.group.toLowerCase().includes(query) ||
        (r.fromTag && r.fromTag.toLowerCase().includes(query)) ||
        (r.toTag && r.toTag.toLowerCase().includes(query))
      );
    })
    : [];

  const isSearching = query.length > 0;

  // Filter routes based on dropdown selections
  const displayedRoutes = isSearching
    ? searchResults
    : ALL_BIDIRECTIONAL_ROUTES.filter((route: any) => {
      if (filterPickup !== "all" && filterDropoff !== "all") {
        return (
          matchesLocation(route.from, filterPickup) &&
          matchesLocation(route.to, filterDropoff)
        );
      }
      if (filterPickup !== "all") return matchesLocation(route.from, filterPickup);
      if (filterDropoff !== "all") return matchesLocation(route.to, filterDropoff);
      return true;
    });

  // Pagination
  const totalPages = Math.ceil(displayedRoutes.length / PAGE_SIZE);
  const pagedRoutes = displayedRoutes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <section id="pricing" className="relative w-full bg-[#1DA58C] overflow-hidden">
      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 py-16 md:py-20 xl:py-24">

        {/* Section title */}
        <div className="text-center w-full mb-10">
          <h2 className={`text-white text-3xl sm:text-4xl md:text-5xl mb-3 ${isTh ? "font-semibold" : "font-bold"}`}>
            {t.faresTitle}
          </h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-1.5 w-24 bg-white/35 mx-auto rounded-full mb-6 origin-center"
          />
          <p className="text-white/80 text-sm sm:text-base max-w-lg mx-auto">
            {t.faresSub}
          </p>
        </div>

        {/* ── LIVE SEARCH BAR ── */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="relative bg-white border border-slate-200 shadow-xl rounded-2xl p-2 flex items-center">
            <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setFilterPickup("all");
                setFilterDropoff("all");
                setCurrentPage(1);
              }}
              placeholder={t.searchPlaceholder}
              className="w-full bg-transparent border-0 outline-none text-slate-800 placeholder-slate-400 font-medium text-sm sm:text-base px-3 py-1.5 focus:ring-0"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors mr-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── PICKUP / DROPOFF SELECTORS ── */}
        <div className="max-w-7xl mx-auto mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pickup Selector */}
          <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-3 flex flex-col gap-1">
            <label className={`text-[10px] text-slate-400 uppercase tracking-widest pl-1 ${isTh ? "font-medium" : "font-black"}`}>
              {t.pickupLabel}
            </label>
            <select
              value={filterPickup}
              onChange={(e) => { setFilterPickup(e.target.value); setSearchQuery(""); setCurrentPage(1); }}
              className={`bg-transparent border-0 outline-none text-slate-800 text-sm sm:text-base cursor-pointer focus:ring-0 w-full ${isTh ? "font-medium" : "font-bold"}`}
            >
              <option value="all">{t.allLocations}</option>
              {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {isTh ? loc.label.split(" / ")[1] : loc.label.split(" / ")[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Dropoff Selector */}
          <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-3 flex flex-col gap-1">
            <label className={`text-[10px] text-slate-400 uppercase tracking-widest pl-1 ${isTh ? "font-medium" : "font-black"}`}>
              {t.dropoffLabel}
            </label>
            <select
              value={filterDropoff}
              onChange={(e) => { setFilterDropoff(e.target.value); setSearchQuery(""); setCurrentPage(1); }}
              className={`bg-transparent border-0 outline-none text-slate-800 text-sm sm:text-base cursor-pointer focus:ring-0 w-full ${isTh ? "font-medium" : "font-bold"}`}
            >
              <option value="all">{t.allLocations}</option>
              {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {isTh ? loc.label.split(" / ")[1] : loc.label.split(" / ")[0]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Pricing Table Container ── */}
        <div className="max-w-7xl mx-auto">
          {/* Search Results Label */}
          {isSearching && (
            <div className="mb-4 text-sm text-white font-semibold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              {isTh
                ? `พบ ${displayedRoutes.length} เส้นทางที่ตรงกับ "${searchQuery}"`
                : `Found ${displayedRoutes.length} matching routes for "${searchQuery}"`}
            </div>
          )}

          {displayedRoutes.length === 0 ? (
            <div className="rounded-3xl border border-white/20 bg-white/10 p-12 text-center flex flex-col items-center justify-center backdrop-blur-md">
              <Info className="w-12 h-12 text-white mb-3" />
              <p className={`text-lg text-white ${isTh ? "font-medium" : "font-bold"}`}>
                {isTh ? "ไม่พบเส้นทางที่ตรงกับคำค้นหา" : "No destinations found matching your search"}
              </p>
              <p className="text-sm text-white/80 mt-1">
                {isTh
                  ? "ลองพิมพ์ชื่อสถานที่ เช่น สนามบิน, พัทยา, หัวหิน"
                  : `Try spelling with keywords like "Airport", "Pattaya", or "Hua Hin"`}
              </p>
              <button
                onClick={handleClearSearch}
                className={`mt-4 text-xs text-slate-800 hover:text-black transition-colors bg-white px-4 py-2 rounded-lg cursor-pointer ${isTh ? "font-medium" : "font-bold"}`}
              >
                {isTh ? "ล้างคำค้นหา" : "Clear Search"}
              </button>
            </div>
          ) : (
            <>
              {/* ── Mobile: Card Grid (< md) ── */}
              <div className="block lg:hidden space-y-3">
                <AnimatePresence mode="wait">
                  {pagedRoutes.map((route, rowIdx) => {
                    const allPrices = Object.values(route.prices);
                    const minPrice = Math.min(...allPrices);
                    return (
                      <motion.div
                        key={route.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(rowIdx * 0.03, 0.3), duration: 0.2 }}
                        className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100"
                      >
                        {/* Route header */}
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-center gap-2">
                          <span className={`text-slate-800 text-sm truncate text-right ${isTh ? "font-medium" : "font-extrabold"}`}>
                            {isTh ? thLoc(route.from) : route.from}
                          </span>
                          <span className="text-[#3668FF] font-black flex-shrink-0">→</span>
                          <span className={`text-slate-800 text-sm truncate text-left ${isTh ? "font-medium" : "font-extrabold"}`}>
                            {isTh ? thLoc(route.to) : route.to}
                          </span>
                        </div>

                        {/* Price rows */}
                        <div className="divide-y divide-slate-100">
                          {VEHICLES.map((v) => {
                            const price = route.prices[v.id];
                            const isCheapest = price === minPrice;
                            return (
                              <div key={v.id} className="flex items-center justify-between px-4 py-3">
                                <div>
                                  <span className={`text-slate-700 text-sm ${isTh ? "font-medium" : "font-bold"}`}>{v.name}</span>
                                  <span className={`ml-2 text-[11px] text-slate-400 ${isTh ? "font-normal" : "font-medium"}`}>{v.capacity}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isCheapest && (
                                    <span className={`text-[9px] uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 ${isTh ? "font-medium" : "font-black"}`}>
                                      {isTh ? "ราคาถูกสุด" : "Best"}
                                    </span>
                                  )}
                                  <span className={`text-base ${isCheapest ? "text-emerald-600" : "text-slate-800"} ${isTh ? "font-semibold" : "font-black"}`}>
                                    ฿{price.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* ── Desktop: Horizontal Table (≥ md) ── */}
              <div className="hidden lg:block rounded-3xl border border-white/10 overflow-hidden bg-white shadow-2xl">
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    {/* Table header */}
                    <div
                      className="grid border-b border-slate-200 bg-slate-50 backdrop-blur-sm"
                      style={{ gridTemplateColumns: "2fr repeat(5, minmax(0,1fr))" }}
                    >
                      <div className={`px-6 py-4 text-slate-400 text-xs uppercase tracking-widest flex items-center ${isTh ? "font-medium" : "font-bold"}`}>
                        {isTh ? "เส้นทาง" : "Route"}
                      </div>
                      {VEHICLES.map((v) => (
                        <div key={v.id} className="px-3 py-4 text-center">
                          <div className={`text-xs text-slate-700 leading-tight ${isTh ? "font-medium" : "font-extrabold"}`}>{v.name}</div>
                          <div className={`text-[10px] text-slate-400 leading-tight mt-0.5 ${isTh ? "font-normal" : "font-semibold"}`}>{v.capacity}</div>
                        </div>
                      ))}
                    </div>

                    {/* Table rows */}
                    <AnimatePresence mode="wait">
                      {pagedRoutes.map((route, rowIdx) => {
                        const allPrices = Object.values(route.prices);
                        const minPrice = Math.min(...allPrices);
                        return (
                          <motion.div
                            key={route.id}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(rowIdx * 0.02, 0.3), duration: 0.2 }}
                            className="grid border-b border-slate-100 last:border-b-0 hover:bg-slate-50/40 transition-colors bg-white text-slate-800"
                            style={{ gridTemplateColumns: "2fr repeat(5, minmax(0,1fr))" }}
                          >
                            {/* Route label */}
                            <div className="px-6 py-5 flex flex-col justify-center gap-1">
                              <div className={`flex items-center gap-1.5 text-slate-800 text-sm sm:text-base leading-none ${isTh ? "font-medium" : "font-extrabold"}`}>
                                <span>{isTh ? thLoc(route.from) : route.from}</span>
                                <span className="text-[#3668FF] text-lg font-black leading-none select-none px-0.5">→</span>
                                <span>{isTh ? thLoc(route.to) : route.to}</span>
                              </div>
                            </div>

                            {/* Price cells */}
                            {VEHICLES.map((v) => {
                              const price = route.prices[v.id];
                              const isCheapest = price === minPrice;
                              return (
                                <div key={v.id} className="flex flex-col items-center justify-center px-3 py-5 text-center">
                                  <span className={`text-base ${isCheapest ? "text-emerald-600" : "text-slate-800"} ${isTh ? "font-semibold" : "font-black"}`}>
                                    ฿{price.toLocaleString()}
                                  </span>
                                  {isCheapest && (
                                    <span className={`mt-1 text-[8px] uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 ${isTh ? "font-medium" : "font-black"}`}>
                                      {isTh ? "ราคาถูกสุด" : "Best Value"}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center text-sm transition-all cursor-pointer ${currentPage === 1
                        ? "border-white/20 text-white/30 cursor-not-allowed"
                        : "border-white/50 text-white hover:bg-white/10"
                      }`}
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${currentPage === page
                          ? "bg-white text-[#1DA58C] border-white shadow-md"
                          : "border-white/40 text-white hover:bg-white/10"
                        }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center text-sm transition-all cursor-pointer ${currentPage === totalPages
                        ? "border-white/20 text-white/30 cursor-not-allowed"
                        : "border-white/50 text-white hover:bg-white/10"
                      }`}
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
