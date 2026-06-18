"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MapPickerModalProps {
  onClose: () => void;
  onSelect: (address: string) => void;
  title: string;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

export default function MapPickerModal({ onClose, onSelect, title }: MapPickerModalProps) {
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("Loading map...");
  const [isGeocoding, setIsGeocoding] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);

  // Coordinates of selected location
  const coordsRef = useRef<{ lat: number; lng: number }>({ lat: 13.7367, lng: 100.5231 });

  // 1. Programmatically load Leaflet CSS & JS
  useEffect(() => {
    if ((window as any).L) {
      setIsSdkLoaded(true);
      return;
    }

    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.onload = () => {
      setIsSdkLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      // Clean up script/link if component unmounts before load
      try {
        if (document.head.contains(link)) document.head.removeChild(link);
        if (document.body.contains(script)) document.body.removeChild(script);
      } catch (e) {}
    };
  }, []);

  // 2. Initialize Map
  useEffect(() => {
    if (!isSdkLoaded || !mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Custom marker pin
    const customPinIcon = L.divIcon({
      className: "custom-leaflet-pin",
      html: `
        <div class="flex flex-col items-center" style="transform: translate(0, -10px);">
          <div class="w-9 h-9 rounded-full bg-[#3668FF] border-2 border-white flex items-center justify-center shadow-lg shadow-blue-500/40">
            <span style="font-size: 16px;">📍</span>
          </div>
          <div class="w-2 h-2 bg-[#3668FF] rounded-full mt-0.5 border border-white"></div>
        </div>
      `,
      iconSize: [36, 46],
      iconAnchor: [18, 46],
    });

    // Initialize Map
    const map = L.map(mapContainerRef.current, {
      zoomControl: false, // will place custom zoom UI or let default
    }).setView([coordsRef.current.lat, coordsRef.current.lng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Zoom control at bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Add draggable marker
    const marker = L.marker([coordsRef.current.lat, coordsRef.current.lng], {
      icon: customPinIcon,
      draggable: true,
    }).addTo(map);

    mapInstanceRef.current = map;
    markerInstanceRef.current = marker;

    // Perform initial reverse geocode
    reverseGeocode(coordsRef.current.lat, coordsRef.current.lng);

    // Handle marker drag end
    marker.on("dragend", () => {
      const newPos = marker.getLatLng();
      coordsRef.current = { lat: newPos.lat, lng: newPos.lng };
      reverseGeocode(newPos.lat, newPos.lng);
    });

    // Handle map click
    map.on("click", (e: any) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      coordsRef.current = { lat, lng };
      reverseGeocode(lat, lng);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isSdkLoaded]);

  // 3. Reverse Geocode (Coordinates -> Address)
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en-US,en;q=0.9", // Ensure English address
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        // Clean display name or custom formatted address
        setSelectedAddress(data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      } else {
        setSelectedAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      }
    } catch (error) {
      setSelectedAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setIsGeocoding(false);
    }
  };

  // 4. Location Search (Nominatim API)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=th&limit=5`,
        {
          headers: {
            "Accept-Language": "en-US,en;q=0.9",
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (e) {
      console.error("Search failed", e);
    } finally {
      setIsSearching(false);
    }
  };

  // 5. Select Search Result
  const selectResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    coordsRef.current = { lat, lng: lon };
    setSelectedAddress(result.display_name);
    setSearchResults([]);
    setSearchQuery("");

    if (mapInstanceRef.current && markerInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lon], 15);
      markerInstanceRef.current.setLatLng([lat, lon]);
    }
  };

  const handleConfirm = () => {
    onSelect(selectedAddress);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-3xl bg-[#0d0d14]/90 border border-white/10 rounded-none sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[100dvh] sm:h-[75vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="p-5 border-b border-white/10 flex items-center justify-between flex-shrink-0 bg-black/20"
          onMouseDown={e => e.stopPropagation()}
          onMouseUp={e => e.stopPropagation()}
          onPointerDown={e => e.stopPropagation()}
          onPointerUp={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
          onTouchEnd={e => e.stopPropagation()}
          onClick={e => e.stopPropagation()}
        >
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-xs text-white/50 mt-0.5">Drag the marker or click on the map to pin the exact location</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Search Bar */}
        <div 
          className="p-4 border-b border-white/10 bg-black/10 flex-shrink-0 relative z-20"
          onMouseDown={e => e.stopPropagation()}
          onMouseUp={e => e.stopPropagation()}
          onPointerDown={e => e.stopPropagation()}
          onPointerUp={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
          onTouchEnd={e => e.stopPropagation()}
          onClick={e => e.stopPropagation()}
        >
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search hotel, street, or landmark in Thailand..."
                className="w-full bg-black/30 border border-white/10 focus:border-blue-500 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-base">🔍</span>
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 flex-shrink-0"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute left-4 right-4 mt-2 bg-[#14141e] border border-white/15 rounded-xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto z-50 divide-y divide-white/5"
              >
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectResult(result)}
                    className="w-full text-left px-4 py-3 text-xs text-white/80 hover:bg-white/5 transition-colors block leading-relaxed"
                  >
                    📍 {result.display_name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Map / Loading State */}
        <div className="flex-1 relative bg-black/40 min-h-0">
          {!isSdkLoaded ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/50 text-sm">
              <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
              <span>Loading maps and libraries...</span>
            </div>
          ) : (
            <div ref={mapContainerRef} className="w-full h-full relative z-10" />
          )}
        </div>

        {/* Bottom Panel */}
        <div 
          className="p-5 border-t border-white/10 bg-black/25 flex-shrink-0 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between"
          onMouseDown={e => e.stopPropagation()}
          onMouseUp={e => e.stopPropagation()}
          onPointerDown={e => e.stopPropagation()}
          onPointerUp={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
          onTouchEnd={e => e.stopPropagation()}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">
              {isGeocoding ? "📍 Updating Address..." : "📍 Selected Location Address"}
            </span>
            <p className="text-sm font-medium text-white/90 truncate leading-snug">
              {isGeocoding ? "Locating on map..." : selectedAddress}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/5 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isGeocoding || !isSdkLoaded || selectedAddress === "Loading map..."}
              className="px-6 py-2.5 bg-[#3668FF] hover:bg-[#2a56e0] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              Confirm Location
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
