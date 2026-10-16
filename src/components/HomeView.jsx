import React from 'react';
import { Play, Pause, Heart, Sparkles, ArrowLeft } from 'lucide-react';
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
    playlists,
    likedTrackIds,
    selectedMusicLanguage,
    setSelectedMusicLanguage,
    t 
  } = useMusic();

  const activeLang = selectedMusicLanguage || 'All';
  const greeting = t(getGreeting());

  // Quick items
  const quickCards = [
    {
      id: 'liked-quick',
      title: t('Liked Songs'),
      type: 'liked',
      gradient: 'from-indigo-700 via-purple-700 to-emerald-400',
      icon: Heart,
      action: () => navigate('liked')
    },
    ...playlists.slice(0, 5).map(pl => ({
      id: pl.id,
      title: pl.title,
      type: 'playlist',
      image: pl.coverArt,
      action: () => navigate('playlist', pl.id),
      songs: ALL_SONGS.filter(s => pl.songIds.includes(s.id))
    }))
  ];

  const handlePlayQuickItem = (e, item) => {
    e.stopPropagation();
    if (item.type === 'liked') {
      const likedSongs = ALL_SONGS.filter(s => likedTrackIds.includes(s.id));
      if (likedSongs.length > 0) {
        if (currentTrack && likedSongs.some(s => s.id === currentTrack.id) && isPlaying) {
          togglePlay();
        } else {
          playTrack(likedSongs[0], likedSongs);
        }
      }
    } else if (item.songs && item.songs.length > 0) {
      if (currentTrack && item.songs.some(s => s.id === currentTrack.id) && isPlaying) {
        togglePlay();
      } else {
        playTrack(item.songs[0], item.songs);
      }
    }
  };

  const renderSongCard = (song, trackList) => {
    const isThisPlaying = currentTrack?.id === song.id && isPlaying;

    return (
      <div
        key={song.id}
        onClick={() => playTrack(song, trackList)}
        className="music-card group p-4 bg-[#181818] hover:bg-[#282828] rounded-lg cursor-pointer transition-all duration-300 flex flex-col relative"
      >
        <div className="relative mb-4 aspect-square w-full rounded-md overflow-hidden shadow-lg">
          <img 
            src={song.coverArt} 
            alt={song.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isThisPlaying) {
                togglePlay();
              } else {
                playTrack(song, trackList);
              }
            }}
            className={`absolute bottom-2 right-2 w-12 h-12 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-spotify-green transition-all duration-200 ${
              isThisPlaying 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105 active:scale-95'
            }`}
          >
            {isThisPlaying ? (
              <Pause className="w-5 h-5 fill-black" />
            ) : (
              <Play className="w-5 h-5 fill-black translate-x-0.5" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between gap-1 mb-1">
          <h3 className={`font-bold text-sm truncate ${
            currentTrack?.id === song.id ? 'text-[#1ed760]' : 'text-white'
          }`}>
            {song.title}
          </h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/70 flex-shrink-0 font-medium">
            {song.language}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p 
            onClick={(e) => {
              e.stopPropagation();
              navigate('artist', song.artistId);
            }}
            className="text-xs text-[#a7a7a7] hover:underline hover:text-white truncate"
          >
            {song.artist}
          </p>
          <SongOptionsMenu song={song} />
        </div>
      </div>
    );
  };

  // Language filtered pools
  const teluguSongs = ALL_SONGS.filter(s => s.language === 'Telugu');
  const hindiSongs = ALL_SONGS.filter(s => s.language === 'Hindi');
  const kannadaSongs = ALL_SONGS.filter(s => s.language === 'Kannada');
  const englishSongs = ALL_SONGS.filter(s => s.language === 'English');

  // Active language pool
  const currentLangSongs = activeLang === 'All' ? ALL_SONGS : ALL_SONGS.filter(s => s.language === activeLang);
  const currentLangSongIds = new Set(currentLangSongs.map(s => s.id));
  const currentLangPlaylists = playlists.filter(p => p.songIds.some(id => currentLangSongIds.has(id)));
  const currentLangArtists = ARTISTS_DATA.filter(a => {
    const aSongs = ALL_SONGS.filter(s => s.artistId === a.id);
    return aSongs.some(s => s.language === activeLang);
  });

  const isCurrentLangPlaying = currentTrack && currentLangSongs.some(s => s.id === currentTrack.id) && isPlaying;

  const handlePlayCurrentLang = () => {
    if (isCurrentLangPlaying) {
      togglePlay();
    } else if (currentLangSongs.length > 0) {
      playTrack(currentLangSongs[0], currentLangSongs);
    }
  };

  // Curated lists for 'All'
  const todayTopHits = ALL_SONGS.filter(s => 
    ['s-te-1', 's-hi-1', 's-ka-1', 's-13', 's-te-2', 's-hi-2'].includes(s.id)
  );

  return (
    <div className="p-6 md:p-8 space-y-8 select-none">
      {/* Top Greeting & Language Filter Tabs */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-4">
          {greeting}
        </h1>

        {/* Language Selection Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {LANGUAGES.map((lang) => {
            const isSelected = activeLang === lang;
            const count = lang === 'All' ? ALL_SONGS.length : ALL_SONGS.filter(s => s.language === lang).length;
            return (
              <button
                key={lang}
                onClick={() => setSelectedMusicLanguage(lang)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex-shrink-0 flex items-center gap-1.5 ${
                  isSelected 
                    ? 'bg-white text-black scale-105 shadow-md' 
                    : 'bg-[#232323] text-white hover:bg-[#2e2e2e]'
                }`}
              >
                <span>{t(lang)}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/10 text-black font-extrabold' : 'bg-white/10 text-[#a7a7a7]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Access Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {quickCards.map((item) => (
            <div
              key={item.id}
              onClick={item.action}
              className="music-card group relative flex items-center bg-[#282828]/50 hover:bg-[#323232] rounded-md overflow-hidden cursor-pointer transition-all duration-200 shadow-sm"
            >
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-16 h-16 md:w-20 md:h-20 object-cover flex-shrink-0 shadow-md"
                />
              ) : (
                <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <Heart className="w-7 h-7 fill-white text-white" />
                </div>
              )}

              <span className="font-bold text-sm md:text-base text-white px-4 truncate flex-1">
                {item.title}
              </span>

              <button
                onClick={(e) => handlePlayQuickItem(e, item)}
                className="mr-4 w-11 h-11 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-spotify-green opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Play className="w-5 h-5 fill-black translate-x-0.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FILTER VIEW: When a specific language is selected (e.g. Telugu, Hindi, Kannada, English) */}
      {activeLang !== 'All' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Hero Banner for Selected Language */}
          <div className="p-6 md:p-8 rounded-xl bg-gradient-to-r from-[#202020] via-[#181818] to-[#121212] border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1ed760] tracking-wider uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Selected Language Filter</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                {activeLang} Music Hub
              </h2>
              <p className="text-sm text-[#b3b3b3] max-w-xl">
                Showing all {currentLangSongs.length} songs, dedicated playlists, and celebrated artists in {activeLang}.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handlePlayCurrentLang}
                className="flex items-center gap-2.5 bg-[#1ed760] text-black font-extrabold text-sm px-6 py-3.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-spotify-green cursor-pointer"
              >
                {isCurrentLangPlaying ? (
                  <Pause className="w-5 h-5 fill-black" />
                ) : (
                  <Play className="w-5 h-5 fill-black translate-x-0.5" />
                )}
                <span>{isCurrentLangPlaying ? 'Pause' : `Play All ${activeLang} Songs`}</span>
              </button>

              <button
                onClick={() => setSelectedMusicLanguage('All')}
                className="flex items-center gap-1.5 px-4 py-3 rounded-full text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Show All Languages</span>
              </button>
            </div>
          </div>

          {/* All Songs in Selected Language */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {activeLang} Songs ({currentLangSongs.length})
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {currentLangSongs.map((song) => renderSongCard(song, currentLangSongs))}
            </div>
          </section>

          {/* Curated Playlists for Selected Language */}
          {currentLangPlaylists.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {activeLang} Playlists
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {currentLangPlaylists.map((pl) => {
                  const isThisPlPlaying = currentTrack && pl.songIds.includes(currentTrack.id) && isPlaying;
                  const plSongs = ALL_SONGS.filter(s => pl.songIds.includes(s.id));

                  return (
                    <div
                      key={pl.id}
                      onClick={() => navigate('playlist', pl.id)}
                      className="music-card group p-4 bg-[#181818] hover:bg-[#282828] rounded-lg cursor-pointer transition-all duration-300 flex flex-col relative"
                    >
                      <div className="relative mb-4 aspect-square w-full rounded-md overflow-hidden shadow-lg">
                        <img 
                          src={pl.coverArt} 
                          alt={pl.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isThisPlPlaying) {
                              togglePlay();
                            } else if (plSongs.length > 0) {
                              playTrack(plSongs[0], plSongs);
                            }
                          }}
                          className={`absolute bottom-2 right-2 w-12 h-12 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-spotify-green transition-all duration-200 ${
                            isThisPlPlaying 
                              ? 'opacity-100 translate-y-0' 
                              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105'
                          }`}
                        >
                          {isThisPlPlaying ? (
                            <Pause className="w-5 h-5 fill-black" />
                          ) : (
                            <Play className="w-5 h-5 fill-black translate-x-0.5" />
                          )}
                        </button>
                      </div>

                      <h4 className="font-bold text-sm text-white truncate mb-1">
                        {pl.title}
                      </h4>
                      <p className="text-xs text-[#a7a7a7] line-clamp-2 leading-relaxed">
                        {pl.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Top Artists for Selected Language */}
          {currentLangArtists.length > 0 && (
            <section className="pb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Featured {activeLang} Artists
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {currentLangArtists.map((artist) => {
                  const artistSongs = ALL_SONGS.filter(s => s.artistId === artist.id);

                  return (
                    <div
                      key={artist.id}
                      onClick={() => navigate('artist', artist.id)}
                      className="music-card group p-4 bg-[#181818] hover:bg-[#282828] rounded-lg cursor-pointer transition-all duration-300 flex flex-col relative"
                    >
                      <div className="relative mb-4 aspect-square w-full rounded-full overflow-hidden shadow-xl">
                        <img 
                          src={artist.avatar} 
                          alt={artist.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (artistSongs.length > 0) {
                              playTrack(artistSongs[0], artistSongs);
                            }
                          }}
                          className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-spotify-green opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105 transition-all duration-200"
                        >
                          <Play className="w-5 h-5 fill-black translate-x-0.5" />
                        </button>
                      </div>

                      <h4 className="font-bold text-sm text-white truncate mb-1">
                        {artist.name}
                      </h4>
                      <p className="text-xs text-[#a7a7a7]">
                        Artist
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}

      {/* DEFAULT VIEW: If 'All' is selected */}
      {activeLang === 'All' && (
        <>
          {/* SECTION: Today's Biggest Hits */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white tracking-tight hover:underline cursor-pointer">
                {t("Today's Biggest Hits")}
              </h2>
              <span 
                onClick={() => navigate('playlist', 'pl-today-top-hits')}
                className="text-xs font-bold text-[#b3b3b3] hover:underline cursor-pointer"
              >
                {t('Show all')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {todayTopHits.map((song) => renderSongCard(song, todayTopHits))}
            </div>
          </section>

          {/* SECTION: Telugu Superhits */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedMusicLanguage('Telugu')}>
                <span className="text-lg">🔥</span>
                <h2 className="text-2xl font-bold text-white tracking-tight hover:underline">
                  {t('Telugu Superhits')}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white font-medium ml-1">
                  Telugu
                </span>
              </div>
              <button 
                onClick={() => setSelectedMusicLanguage('Telugu')}
                className="text-xs font-bold text-[#b3b3b3] hover:underline hover:text-white cursor-pointer"
              >
                View all Telugu ({teluguSongs.length})
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {teluguSongs.slice(0, 6).map((song) => renderSongCard(song, teluguSongs))}
            </div>
          </section>

          {/* SECTION: Bollywood & Hindi Hits */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedMusicLanguage('Hindi')}>
                <span className="text-lg">✨</span>
                <h2 className="text-2xl font-bold text-white tracking-tight hover:underline">
                  {t('Bollywood & Hindi Hits')}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white font-medium ml-1">
                  Hindi
                </span>
              </div>
              <button 
                onClick={() => setSelectedMusicLanguage('Hindi')}
                className="text-xs font-bold text-[#b3b3b3] hover:underline hover:text-white cursor-pointer"
              >
                View all Hindi ({hindiSongs.length})
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {hindiSongs.slice(0, 6).map((song) => renderSongCard(song, hindiSongs))}
            </div>
          </section>

          {/* SECTION: Kannada Sandalwood Anthems */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedMusicLanguage('Kannada')}>
                <span className="text-lg">🌟</span>
                <h2 className="text-2xl font-bold text-white tracking-tight hover:underline">
                  {t('Kannada Sandalwood Anthems')}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white font-medium ml-1">
                  Kannada
                </span>
              </div>
              <button 
                onClick={() => setSelectedMusicLanguage('Kannada')}
                className="text-xs font-bold text-[#b3b3b3] hover:underline hover:text-white cursor-pointer"
              >
                View all Kannada ({kannadaSongs.length})
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {kannadaSongs.slice(0, 6).map((song) => renderSongCard(song, kannadaSongs))}
            </div>
          </section>

          {/* SECTION: Global English Hits */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedMusicLanguage('English')}>
                <span className="text-lg">🌍</span>
                <h2 className="text-2xl font-bold text-white tracking-tight hover:underline">
                  {t('Global English Hits')}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white font-medium ml-1">
                  English
                </span>
              </div>
              <button 
                onClick={() => setSelectedMusicLanguage('English')}
                className="text-xs font-bold text-[#b3b3b3] hover:underline hover:text-white cursor-pointer"
              >
                View all English ({englishSongs.length})
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {englishSongs.slice(0, 6).map((song) => renderSongCard(song, englishSongs))}
            </div>
          </section>

          {/* SECTION: Made For You (Playlists) */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white tracking-tight hover:underline cursor-pointer">
                {t('Made For You')}
              </h2>
              <span 
                onClick={() => navigate('library')}
                className="text-xs font-bold text-[#b3b3b3] hover:underline cursor-pointer"
              >
                {t('Show all')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {playlists.map((pl) => {
                const isThisPlaylistPlaying = currentTrack && pl.songIds.includes(currentTrack.id) && isPlaying;
                const plSongs = ALL_SONGS.filter(s => pl.songIds.includes(s.id));

                return (
                  <div
                    key={pl.id}
                    onClick={() => navigate('playlist', pl.id)}
                    className="music-card group p-4 bg-[#181818] hover:bg-[#282828] rounded-lg cursor-pointer transition-all duration-300 flex flex-col relative"
                  >
                    <div className="relative mb-4 aspect-square w-full rounded-md overflow-hidden shadow-lg">
                      <img 
                        src={pl.coverArt} 
                        alt={pl.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isThisPlaylistPlaying) {
                            togglePlay();
                          } else if (plSongs.length > 0) {
                            playTrack(plSongs[0], plSongs);
                          }
                        }}
                        className={`absolute bottom-2 right-2 w-12 h-12 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-spotify-green transition-all duration-200 ${
                          isThisPlaylistPlaying 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105'
                        }`}
                      >
                        {isThisPlaylistPlaying ? (
                          <Pause className="w-5 h-5 fill-black" />
                        ) : (
                          <Play className="w-5 h-5 fill-black translate-x-0.5" />
                        )}
                      </button>
                    </div>

                    <h3 className="font-bold text-sm text-white truncate mb-1">
                      {pl.title}
                    </h3>
                    <p className="text-xs text-[#a7a7a7] line-clamp-2 leading-relaxed">
                      {pl.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION: Featured Artists */}
          <section className="pb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white tracking-tight hover:underline cursor-pointer">
                {t('Popular Artists')}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4">
              {ARTISTS_DATA.slice(0, 6).map((artist) => {
                const artistSongs = ALL_SONGS.filter(s => s.artistId === artist.id);

                return (
                  <div
                    key={artist.id}
                    onClick={() => navigate('artist', artist.id)}
                    className="music-card group p-4 bg-[#181818] hover:bg-[#282828] rounded-lg cursor-pointer transition-all duration-300 flex flex-col relative"
                  >
                    <div className="relative mb-4 aspect-square w-full rounded-full overflow-hidden shadow-xl">
                      <img 
                        src={artist.avatar} 
                        alt={artist.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (artistSongs.length > 0) {
                            playTrack(artistSongs[0], artistSongs);
                          }
                        }}
                        className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-spotify-green opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105 transition-all duration-200"
                      >
                        <Play className="w-5 h-5 fill-black translate-x-0.5" />
                      </button>
                    </div>

                    <h3 className="font-bold text-sm text-white truncate mb-1">
                      {artist.name}
                    </h3>
                    <p className="text-xs text-[#a7a7a7]">
                      {t('Artists')}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
