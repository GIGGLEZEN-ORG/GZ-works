import React, { useState } from 'react';
import { X, Music } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export default function CreatePlaylistModal() {
  const { 
    isCreatePlaylistOpen, 
    setIsCreatePlaylistOpen, 
    createNewPlaylist 
  } = useMusic();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isCreatePlaylistOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    createNewPlaylist(name.trim(), description.trim());
    setName('');
    setDescription('');
    setIsCreatePlaylistOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm select-none p-4">
      <div className="bg-[#282828] w-full max-w-md rounded-xl p-6 shadow-2xl border border-white/5 space-y-6 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white tracking-tight">
            Create Playlist
          </h3>
          <button
            onClick={() => setIsCreatePlaylistOpen(false)}
            className="text-[#a7a7a7] hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#b3b3b3] mb-1.5 uppercase tracking-wider">
              Playlist Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My awesome playlist"
              required
              autoFocus
              className="w-full bg-[#3e3e3e] text-sm text-white px-3.5 py-2.5 rounded-md placeholder-[#727272] focus:outline-none focus:ring-2 focus:ring-[#1ed760] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#b3b3b3] mb-1.5 uppercase tracking-wider">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give your playlist a catchy description"
              rows="3"
              className="w-full bg-[#3e3e3e] text-sm text-white px-3.5 py-2.5 rounded-md placeholder-[#727272] focus:outline-none focus:ring-2 focus:ring-[#1ed760] transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatePlaylistOpen(false)}
              className="px-4 py-2 text-xs font-bold text-[#b3b3b3] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="music-control bg-[#1ed760] hover:bg-[#1fdf64] disabled:opacity-50 text-black font-bold text-xs px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
