import React from 'react';
import { Shield, Heart, Award, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-700 bg-gradient-to-br from-[#031317] via-[#102b32] to-[#071d25] text-gray-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-gray-800 text-xs">
          
          {/* Col 1: Brand & Intro */}
          <div className="lg:col-span-2 pr-4">
            <div className="flex items-center gap-2 mb-4">
              <img src="/brand-logo.png" alt="" className="h-9 w-9 rounded-lg object-cover" />
              <span className="text-2xl font-black text-white font-['Montserrat'] tracking-tight">
                My Bus <span className="text-[#087e8b]">Booking</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              My Bus Booking is a trusted bus ticket booking platform for comfortable, affordable, and reliable journeys across major routes in India.
            </p>
            <div className="flex items-center gap-2 text-gray-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>100% Secure SSL Payment & Safe Travel Network</span>
            </div>
          </div>

          {/* Col 2: Top Bus Routes */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3 font-['Montserrat']">
              Top Bus Routes
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><span className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-sky-300">Bengaluru to Hyderabad</span></li>
              <li><span className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-sky-300">Hyderabad to Bengaluru</span></li>
              <li><span className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-sky-300">Delhi to Jaipur</span></li>
              <li><span className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-sky-300">Mumbai to Pune</span></li>
              <li><span className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-sky-300">Chennai to Coimbatore</span></li>
              <li><span className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-sky-300">Kolkata to Digha</span></li>
            </ul>
          </div>

          {/* Col 3: Top Bus Operators */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3 font-['Montserrat']">
              Top Bus Operators
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><span className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-sky-300">IntrCity SmartBus</span></li>
              <li><span className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-sky-300">Orange Travels</span></li>
              <li><span className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-sky-300">VRL Travels</span></li>
              <li><span className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-sky-300">SRS Travels</span></li>
              <li><span className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-sky-300">Zingbus Plus</span></li>
              <li><span className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-sky-300">Greenline Travels</span></li>
            </ul>
          </div>

          {/* Col 4: State RTCs & About */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3 font-['Montserrat']">
              Official RTCs
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><span className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-sky-300">KSRTC Karnataka</span></li>
              <li><span className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-sky-300">APSRTC Andhra</span></li>
              <li><span className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-sky-300">TSRTC Telangana</span></li>
              <li><span className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-sky-300">MSRTC Maharashtra</span></li>
              <li><span className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-sky-300">GSRTC Gujarat</span></li>
              <li><span className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-sky-300">UPSRTC Uttar Pradesh</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div className="flex flex-wrap items-center justify-center gap-1 text-center">
            <span>© 2026 My Bus Booking. Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-sky-500 fill-sky-500 mx-0.5 inline" />
            <span>for seamless bus journeys.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <span className="hover:text-gray-400 transition cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-gray-400 transition cursor-pointer">Terms & Conditions</span>
            <span>•</span>
            <span className="hover:text-gray-400 transition cursor-pointer">User Agreement</span>
            
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-gradient-to-br from-slate-800 to-[#102b32] text-gray-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:from-sky-600 hover:to-cyan-800 hover:text-white hover:shadow-lg hover:shadow-sky-900/30 cursor-pointer sm:ml-2"
              title="Scroll to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
