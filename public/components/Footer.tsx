import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-black/30 backdrop-blur-md border-t border-white/10 text-white/60 py-12 select-none">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <a href="/#homepage" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1DA58C] to-[#12806d] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <span className="text-white font-bold tracking-tight text-base md:text-lg">
              Taxi Saver<span className="text-[#4adebc] ml-0.5">.</span>
            </span>
          </a>
          <p className="text-xs text-white/45 mt-1 text-center md:text-left">
            Affordable and reliable transport services across Thailand. No deposit required.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-medium">
          <a href="/#homepage" className="hover:text-white transition-colors duration-200">Homepage</a>
          <a href="/#explore" className="hover:text-white transition-colors duration-200">Services</a>
          <a href="/#why" className="hover:text-white transition-colors duration-200">Why Us</a>
          <a href="/booking" className="hover:text-white transition-colors duration-200">Book Ride</a>
        </div>
        <div className="text-xs text-white/30 text-center md:text-right">
          &copy; {new Date().getFullYear()} Taxi Saver Thailand. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
