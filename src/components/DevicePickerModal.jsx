import React from 'react';
import { X, Laptop, Smartphone, Speaker, Headphones, Check } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

const DEVICES = [
  { id: 'dev-browser', name: 'Web Browser (Current device)', type: 'computer', icon: Laptop },
  { id: 'dev-soundbar', name: 'Living Room Sonos Arc', type: 'speaker', icon: Speaker },
  { id: 'dev-macbook', name: 'MacBook Pro', type: 'computer', icon: Laptop },
  { id: 'dev-iphone', name: 'iPhone 15 Pro', type: 'phone', icon: Smartphone },
  { id: 'dev-airpods', name: 'AirPods Max (Spatial Audio)', type: 'headphones', icon: Headphones },
];

export default function DevicePickerModal() {
  const { 
    isDeviceModalOpen, 
    setIsDeviceModalOpen, 
    activeDevice, 
    setActiveDevice,
    showToast 
  } = useMusic();

  if (!isDeviceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm select-none p-4 sm:items-center">
      <div className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-xl border border-white/5 bg-[#282828] p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Speaker className="w-5 h-5 text-[#1ed760]" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Connect to a device
            </h3>
          </div>
          <button
            onClick={() => setIsDeviceModalOpen(false)}
            className="text-[#a7a7a7] hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#b3b3b3]">
          playmusic Connect lets you listen to music on any of your speakers, TVs, and other devices.
        </p>

        <div className="space-y-2">
          {DEVICES.map((dev) => {
            const Icon = dev.icon;
            const isCurrent = activeDevice.includes(dev.name) || (dev.id === 'dev-browser' && activeDevice.includes('Web'));

            return (
              <div
                key={dev.id}
                onClick={() => {
                  setActiveDevice(dev.name);
                  showToast(`Connected to ${dev.name}`);
                  setIsDeviceModalOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                  isCurrent 
                    ? 'bg-[#1ed760]/10 border border-[#1ed760]/30' 
                    : 'hover:bg-[#333333]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isCurrent ? 'text-[#1ed760]' : 'text-[#a7a7a7]'}`} />
                  <div>
                    <h4 className={`text-sm font-semibold ${isCurrent ? 'text-[#1ed760]' : 'text-white'}`}>
                      {dev.name}
                    </h4>
                    <span className="text-[11px] text-[#a7a7a7]">
                      {isCurrent ? 'Listening on this device' : 'playmusic Connect'}
                    </span>
                  </div>
                </div>

                {isCurrent && (
                  <Check className="w-5 h-5 text-[#1ed760]" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
