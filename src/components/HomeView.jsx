import React from 'react';
import { Play, Pause, Heart, Sparkles, Flame, Disc, ChevronRight, Cloud, Dumbbell, Moon, Target, Zap, MoreHorizontal } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { ALL_SONGS, ARTISTS_DATA } from '../data/musicData';
import SongOptionsMenu from './SongOptionsMenu';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const LANGUAGES = ['All', 'Telugu', 'Hindi', 'English', 'Kannada'];

export default function HomeView() {
  const { 
    playTrack, 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    navigate, 
    recentlyPlayed,
    activeMood,
    setActiveMood,
    getSongsByMood,
    selectedMusicLanguage,
    setSelectedMusicLanguage,
    t 
  } = useMusic();

  const activeLang = selectedMusicLanguage || 'All';
  const greeting = t(getGreeting());
  const moodOptions = [
    { id: 'cyber', label: 'Energy', icon: Zap, color: '#f6a723' },
    { id: 'chill', label: 'Chill', icon: Cloud, color: '#36c9ed' },
    { id: 'workout', label: 'Workout', icon: Dumbbell, color: '#15d6b1' },
    { id: 'drive', label: 'Drive', icon: Moon, color: '#9e62f5' },
    { id: 'romance', label: 'Romantic', icon: Heart, color: '#f044a5' },
    { id: 'focus', label: 'Focus', icon: Target, color: '#5275ff' },
  ];

  // Spotlight Track (featured blockbuster)
  const spotlightTrack = ALL_SONGS.find(s => s.id === 's-te-1') || ALL_SONGS[0];
  const isSpotlightPlaying = currentTrack?.id === spotlightTrack.id && isPlaying;

  // Language filtered pools
  const teluguSongs = ALL_SONGS.filter(s => s.language === 'Telugu');
  const hindiSongs = ALL_SONGS.filter(s => s.language === 'Hindi');
  const kannadaSongs = ALL_SONGS.filter(s => s.language === 'Kannada');
  const englishSongs = ALL_SONGS.filter(s => s.language === 'English');

  const filteredPool = activeLang === 'All' 
    ? ALL_SONGS 
    : ALL_SONGS.filter(s => s.language === activeLang);

  const renderSongCard = (song, trackList) => {
    const isThisPlaying = currentTrack?.id === song.id && isPlaying;

    return (
      <div
        key={song.id}
        onClick={() => playTrack(song, trackList)}
        className="app-track-card glass-card group p-3.5 rounded-2xl cursor-pointer flex flex-col relative"
      >
        {/* Cover Art Box */}
        <div className="relative mb-3 aspect-square w-full rounded-xl overflow-hidden shadow-md">
          <img 
            src={song.coverArt} 
            alt={song.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Equalizer Indicator when currently playing */}
          {isThisPlaying && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
              <div className="flex items-end gap-1 h-6">
                <span className="w-1.5 bg-[#1ed760] rounded-full eq-bar-1 shadow-[0_0_8px_#1ed760]"></span>
                <span className="w-1.5 bg-[#1ed760] rounded-full eq-bar-2 shadow-[0_0_8px_#1ed760]"></span>
                <span className="w-1.5 bg-[#1ed760] rounded-full eq-bar-3 shadow-[0_0_8px_#1ed760]"></span>
                <span className="w-1.5 bg-[#1ed760] rounded-full eq-bar-4 shadow-[0_0_8px_#1ed760]"></span>
              </div>
            </div>
          )}

          {/* Floating Hover Play Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isThisPlaying) {
                togglePlay();
              } else {
                playTrack(song, trackList);
              }
            }}
            className={`absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-[0_0_15px_rgba(30,215,96,0.4)] transition-all duration-300 ${
              isThisPlaying 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-110 active:scale-95'
            }`}
          >
            {isThisPlaying ? (
              <Pause className="w-5 h-5 fill-black" />
            ) : (
              <Play className="w-5 h-5 fill-black translate-x-0.5" />
            )}
          </button>
        </div>

        {/* Info */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <h3 className={`font-bold text-sm truncate transition-colors ${
            currentTrack?.id === song.id ? 'text-[#1ed760]' : 'text-white group-hover:text-white'
          }`}>
            {song.title}
          </h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/70 flex-shrink-0 font-medium">
            {song.language}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-auto">
          <p 
            onClick={(e) => {
              e.stopPropagation();
              navigate('artist', song.artistId);
            }}
            className="text-xs text-[#9ca3af] hover:underline hover:text-white truncate"
          >
            {song.artist}
          </p>
          <SongOptionsMenu song={song} />
        </div>
      </div>
    );
  };

  const renderLanguageFilters = () => (
    <div className="home-language-filters" aria-label="Filter music by language">
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          onClick={() => setSelectedMusicLanguage(lang)}
          className={`home-language-filter ${activeLang === lang ? 'is-active' : ''}`}
          aria-pressed={activeLang === lang}
        >
          {lang === 'All' && <Sparkles className="w-3 h-3" />}
          {lang === 'Telugu' && <Flame className="w-3 h-3" />}
          {lang === 'Hindi' && <Flame className="w-3 h-3" />}
          {lang === 'Kannada' && <Flame className="w-3 h-3" />}
          {lang === 'English' && <Disc className="w-3 h-3" />}
          <span>{lang}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="playmusic-home select-none">
      <div className="playmusic-home-grid">
        <div className="playmusic-home-main space-y-5">
      {/* 1. CINEMATIC SPOTLIGHT HERO BANNER */}
      {spotlightTrack && activeLang === 'All' && (
        <div
          onClick={() => playTrack(spotlightTrack, ALL_SONGS)}
          className="playmusic-spotlight relative overflow-hidden rounded-2xl cursor-pointer group"
        >
          <div
            className="spotlight-backdrop absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${spotlightTrack.coverArt})` }}
          />

          <div className="spotlight-content relative z-10 items-center">
            <div className="spotlight-copy flex flex-col items-start gap-2">
              <p className="spotlight-greeting">{greeting} <span aria-hidden="true">👋</span></p>
              <h1 className="spotlight-title">
                Let the Music<br />Move You
              </h1>

              <div className="spotlight-description">
                <span>Discover new sounds, create your vibes,</span>
                <span>and enjoy your favorite tracks anytime.</span>
              </div>

              <div className="spotlight-actions flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isSpotlightPlaying) {
                      togglePlay();
                    } else {
                      playTrack(spotlightTrack, ALL_SONGS);
                    }
                  }}
                  className="spotlight-play-button flex items-center gap-2 px-5 py-2 rounded-full text-xs hover:scale-105 active:scale-95 transition-all"
                >
                  {isSpotlightPlaying ? (
                    <>
                      <Pause className="w-5 h-5 fill-black" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-black" />
                      <span>Play Now</span>
                    </>
                  )}
                </button>

                <button
                  className="rounded-full border border-white/30 bg-black/15 px-5 py-2.5 text-xs font-bold text-white/90 backdrop-blur-md transition-colors hover:bg-white/[0.14]"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('search');
                  }}
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content sections */}
      {/* If language filter is active (not All) */}
      {activeLang !== 'All' ? (
        <section className="space-y-4">
          <div className="home-filtered-heading">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {activeLang} Master Tracks
            </h3>
            {renderLanguageFilters()}
            <span className="text-xs text-[#9ca3af]">
              {filteredPool.length} songs
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredPool.map(song => renderSongCard(song, filteredPool))}
          </div>
        </section>
      ) : (
        <>
          {/* SECTION: TRENDING CHARTS */}
          <section className="home-trending-section space-y-3">
            <div className="home-trending-heading">
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-500" />
                  Trending Now
                </h3>
              </div>
              <div className="home-trending-tools">
                {renderLanguageFilters()}
                <button
                  onClick={() => navigate('search')}
                  className="home-trending-see-all"
                >
                  See all <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="home-trending-row">
              {ALL_SONGS.slice(0, 5).map(song => renderSongCard(song, ALL_SONGS))}
            </div>
          </section>

          {/* SECTION: FEATURED ARTISTS */}
          <section className="home-artists-section space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">Featured Artists</h3>
              <button
                onClick={() => navigate('search')}
                className="text-xs font-bold text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1"
              >
                See all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="home-artists-row">
              {ARTISTS_DATA.slice(0, 6).map(art => (
                <button
                  type="button"
                  key={art.id}
                  onClick={() => navigate('artist', art.id)}
                  className="home-artist"
                >
                  <span className="home-artist-avatar">
                    <img src={art.avatar} alt="" loading="lazy" />
                  </span>
                  <span className="home-artist-name">{art.name}</span>
                  <span className="home-artist-caption">Artist</span>
                </button>
              ))}
            </div>
          </section>

          {/* SECTION: TELUGU SUPERHITS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Tollywood Hits
                </h3>
                <p className="text-xs text-[#9ca3af]">High-voltage tracks from RRR, Devara, Pushpa & AVPL</p>
              </div>
              <button 
                onClick={() => setSelectedMusicLanguage('Telugu')}
                className="text-xs font-bold text-[#1ed760] hover:underline flex items-center gap-1"
              >
                See all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {teluguSongs.slice(0, 6).map(song => renderSongCard(song, teluguSongs))}
            </div>
          </section>

          {/* SECTION: BOLLYWOOD CENTRAL */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Bollywood Central
                </h3>
                <p className="text-xs text-[#9ca3af]">Soulful melodies & party bangers by Arijit Singh & Pritam</p>
              </div>
              <button 
                onClick={() => setSelectedMusicLanguage('Hindi')}
                className="text-xs font-bold text-[#1ed760] hover:underline flex items-center gap-1"
              >
                See all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {hindiSongs.slice(0, 6).map(song => renderSongCard(song, hindiSongs))}
            </div>
          </section>

          {/* SECTION: SANDALWOOD ANTHEMS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Sandalwood Anthems
                </h3>
                <p className="text-xs text-[#9ca3af]">Iconic soundscapes from Kantara, KGF & Raajakumara</p>
              </div>
              <button 
                onClick={() => setSelectedMusicLanguage('Kannada')}
                className="text-xs font-bold text-[#1ed760] hover:underline flex items-center gap-1"
              >
                See all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {kannadaSongs.slice(0, 6).map(song => renderSongCard(song, kannadaSongs))}
            </div>
          </section>

          {/* SECTION: GLOBAL HITS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Global Pop & Hip-Hop
                </h3>
                <p className="text-xs text-[#9ca3af]">Taylor Swift, The Weeknd, Kendrick Lamar & Sabrina Carpenter</p>
              </div>
              <button 
                onClick={() => setSelectedMusicLanguage('English')}
                className="text-xs font-bold text-[#1ed760] hover:underline flex items-center gap-1"
              >
                See all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {englishSongs.slice(0, 6).map(song => renderSongCard(song, englishSongs))}
            </div>
          </section>

        </>
      )}
        </div>

        <aside className="playmusic-home-rail" aria-label="Your music dashboard">
          <section className="dashboard-panel mood-panel">
            <div className="dashboard-panel-heading">
              <h2>Your Mood</h2>
              <p>Pick a vibe, find your next favorite.</p>
            </div>
            <div className="mood-grid">
              {moodOptions.map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveMood(id)}
                  className={`mood-chip ${activeMood === id ? 'is-active' : ''}`}
                  style={{ '--mood-color': color }}
                  aria-pressed={activeMood === id}
                >
                  <span className="mood-chip-icon"><Icon size={17} /></span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
            {activeMood !== 'all' && (
              <button
                type="button"
                className="mood-recommendation"
                onClick={() => {
                  const moodSongs = getSongsByMood(activeMood);
                  if (moodSongs.length) playTrack(moodSongs[0], moodSongs);
                }}
              >
                <span>Play your {moodOptions.find(mood => mood.id === activeMood)?.label.toLowerCase()} mix</span>
                <Play size={14} fill="currentColor" />
              </button>
            )}
          </section>

          <section className="dashboard-panel recent-panel">
            <div className="dashboard-panel-heading recent-heading">
              <div>
                <h2>Recently Played</h2>
                <p>Your recent favorites, right here.</p>
              </div>
              <button
                type="button"
                className="dashboard-more"
                onClick={() => navigate('library')}
                aria-label="Open your library"
                title="Open your library"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>
            <div className="recent-track-list">
              {recentlyPlayed.slice(0, 5).map((song) => {
                const isThisPlaying = currentTrack?.id === song.id && isPlaying;
                return (
                  <button
                    key={song.id}
                    type="button"
                    className={`recent-track ${isThisPlaying ? 'is-playing' : ''}`}
                    onClick={() => playTrack(song, recentlyPlayed)}
                  >
                    <img src={song.coverArt} alt="" loading="lazy" />
                    <span className="recent-track-copy">
                      <span className="recent-track-title">{song.title}</span>
                      <span className="recent-track-artist">{song.artist}</span>
                    </span>
                    {isThisPlaying ? (
                      <span className="recent-playing-bars" aria-label="Now playing"><i /><i /><i /></span>
                    ) : (
                      <Play className="recent-track-play" size={14} fill="currentColor" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

        </aside>
      </div>
    </div>
  );
}
