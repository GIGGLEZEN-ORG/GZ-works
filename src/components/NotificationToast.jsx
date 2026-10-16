import React from 'react';
import { useMusic } from '../context/MusicContext';
import { CheckCircle2 } from 'lucide-react';

export default function NotificationToast() {
  const { toastMessage } = useMusic();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-[#1e3264] text-white text-xs font-semibold px-4 py-2.5 rounded-md shadow-2xl flex items-center gap-2 border border-white/10">
        <CheckCircle2 className="w-4 h-4 text-[#1ed760]" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
