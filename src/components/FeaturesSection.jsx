import React from 'react';
import { Award, Clock, MapPin, Headphones, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Award,
      title: 'Primo by My Bus Booking',
      desc: 'Top-rated buses with 4.5+ customer ratings, clean vehicles, and courteous drivers.',
      badge: 'HIGH RATED',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Clock,
      title: 'On-Time Guarantee',
      desc: 'Get 25% refund if your bus is delayed by more than 30 minutes at boarding point.',
      badge: 'PUNCTUAL',
      color: 'from-sky-500 to-rose-600'
    },
    {
      icon: MapPin,
      title: 'Live Bus Tracking',
      desc: 'Share live GPS location with family members and track your bus on real-time maps.',
      badge: 'GPS LIVE',
      color: 'from-cyan-500 to-teal-700'
    },
    {
      icon: Headphones,
      title: '24/7 Customer Care',
      desc: 'Round the clock assistance via chat, phone, and email for all your travel inquiries.',
      badge: 'ALWAYS ON',
      color: 'from-emerald-500 to-teal-600'
    }
  ];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold text-[#087e8b] uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full">
          The My Bus Booking Promise
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-3 font-['Montserrat']">
          Why Travelers Choose My Bus Booking
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Experience stress-free travel with guaranteed safety, comfort, and best-in-class service.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-white to-sky-50/70 p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_18px_36px_rgba(8,126,139,0.14)]"
            >
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${f.color} opacity-[0.08] blur-2xl transition-all duration-300 group-hover:scale-150 group-hover:opacity-20`}
              />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white shadow-md shadow-sky-500/20 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`rounded bg-gradient-to-r ${f.color} bg-clip-text px-2 py-0.5 text-[10px] font-bold tracking-wider text-transparent`}>
                    {f.badge}
                  </span>
                </div>
                <h3 className="relative mb-2 text-lg font-bold text-gray-900 transition-colors duration-200 group-hover:text-[#087e8b]">
                  {f.title}
                </h3>
                <p className="relative text-xs leading-relaxed text-gray-500">
                  {f.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs font-semibold text-[#087e8b]">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Standard</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
