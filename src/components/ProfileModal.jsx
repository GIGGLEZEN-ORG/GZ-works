import React, { useEffect, useState } from 'react';
import { X, UserRound, Mail, Phone, MapPin, Save } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function ProfileModal() {
  const { profileModalOpen, setProfileModalOpen, userProfile, setUserProfile } = useBooking();
  const [form, setForm] = useState(userProfile);

  useEffect(() => {
    if (profileModalOpen) {
      setForm(userProfile);
    }
  }, [profileModalOpen, userProfile]);

  if (!profileModalOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setUserProfile({
      ...form,
      fullName: form.fullName.trim() || 'Traveler',
      email: form.email.trim() || 'traveler@example.com',
      city: form.city.trim() || 'Bengaluru'
    });
    setProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-4">
      <div className="my-auto w-full max-w-lg overflow-y-auto rounded-[28px] border border-gray-100 bg-white shadow-2xl sm:max-h-[90dvh]">
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-300">Account</p>
            <h2 className="text-2xl font-black font-['Montserrat']">Profile</h2>
          </div>
          <button
            type="button"
            onClick={() => setProfileModalOpen(false)}
            className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-4 sm:p-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Full name</label>
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-[#087e8b] focus-within:bg-white transition">
              <UserRound className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Email</label>
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-[#087e8b] focus-within:bg-white transition">
              <Mail className="w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Phone</label>
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-[#087e8b] focus-within:bg-white transition">
                <Phone className="w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-gray-500">City</label>
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-[#087e8b] focus-within:bg-white transition">
                <MapPin className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#087e8b] text-white font-bold px-4 py-3 shadow-lg shadow-sky-500/20 hover:bg-[#1e4d6b] transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save profile</span>
          </button>
        </form>
      </div>
    </div>
  );
}
