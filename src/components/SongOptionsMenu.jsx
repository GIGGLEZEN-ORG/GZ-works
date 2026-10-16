import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Heart, Plus, Copy, User, Check } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export default function SongOptionsMenu({ song }) {
  const { 
    isTrackLiked, 
    toggleLikeTrack, 
    playlists, 
    addSongToPlaylist, 
    navigate, 
    showToast 
  } = useMusic();

  const [isOpen, setIsOpen] = useState(false);
  const [showPlaylistSubmenu, setShowPlaylistSubmenu] = useState(false);
  const menuRef = useRef(null);

  const isLiked = isTrackLiked(song.id);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
        setShowPlaylistSubmenu(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleCopyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText?.(window.location.href);
    showToast(`Copied link to "${song.title}"`);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1 text-[#a7a7a7] hover:text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
        title="More options"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 bottom-6 w-48 bg-[#282828] rounded-md shadow-2xl p-1 z-50 text-xs border border-white/5 animate-in fade-in zoom-in-95"
        >
          {/* Like / Unlike */}
          <button
            onClick={() => {
              toggleLikeTrack(song.id);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-white hover:bg-[#3e3e3e] rounded text-left transition-colors"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#1ed760] text-[#1ed760]' : ''}`} />
            <span>{isLiked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}</span>
          </button>

          {/* Add to Playlist Submenu toggle */}
          <div className="relative">
            <button
              onClick={() => setShowPlaylistSubmenu(!showPlaylistSubmenu)}
              className="w-full flex items-center justify-between px-3 py-2 text-white hover:bg-[#3e3e3e] rounded text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Add to playlist</span>
              </div>
              <span className="text-[10px] text-[#a7a7a7]">▶</span>
            </button>

            {showPlaylistSubmenu && (
              <div className="absolute right-full bottom-0 mr-1 w-44 bg-[#282828] rounded-md shadow-2xl p-1 z-50 border border-white/5 max-h-48 overflow-y-auto">
                {playlists.map((pl) => {
                  const alreadyIn = pl.songIds.includes(song.id);
                  return (
                    <button
                      key={pl.id}
                      onClick={() => {
                        addSongToPlaylist(pl.id, song.id);
                        setIsOpen(false);
                        setShowPlaylistSubmenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-white hover:bg-[#3e3e3e] rounded text-left transition-colors truncate"
                    >
                      <span className="truncate">{pl.title}</span>
                      {alreadyIn && <Check className="w-3 h-3 text-[#1ed760]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Go to Artist */}
          <button
            onClick={() => {
              navigate('artist', song.artistId);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-white hover:bg-[#3e3e3e] rounded text-left transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            <span>Go to artist</span>
          </button>

          <div className="h-px bg-white/10 my-1"></div>

          {/* Copy link */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-white hover:bg-[#3e3e3e] rounded text-left transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy song link</span>
          </button>
        </div>
      )}
    </div>
  );
}
