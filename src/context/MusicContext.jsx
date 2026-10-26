import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ALL_SONGS, INITIAL_PLAYLISTS, ARTISTS_DATA, TRENDING_ALBUMS, PERSONALIZED_PLAYLISTS, MOOD_CATEGORIES } from '../data/musicData';
import translations, { LANGUAGES } from '../data/translations';
import { audioEngine } from '../utils/audioEngine';
import { getStoredAudioTracks, saveStoredAudioTrack } from '../utils/localAudioStorage';

const MusicContext = createContext();
const DEFAULT_LANGUAGE = 'en';

export const MusicProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      const savedLanguage = localStorage.getItem('playmusic_language');
      return LANGUAGES.some(({ code }) => code === savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  });

  const t = (key) => translations[language][key] || key;

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem('playmusic_language', language);
    } catch (error) {
      console.error('Unable to save language preference', error);
    }
  }, [language]);

  // Playback state
  const [currentTrack, setCurrentTrack] = useState(() => {
    return ALL_SONGS[0];
  });
  const [recentlyPlayedIds, setRecentlyPlayedIds] = useState(() => {
    try {
      const savedTracks = JSON.parse(localStorage.getItem('playmusic_recent_tracks') || '[]');
      const validTracks = Array.isArray(savedTracks)
        ? savedTracks.filter(id => ALL_SONGS.some(track => track.id === id)).slice(0, 8)
        : [];
      return validTracks.length > 0 ? validTracks : [ALL_SONGS[0].id];
    } catch {
      return [ALL_SONGS[0].id];
    }
  });
  const recentlyPlayed = recentlyPlayedIds
    .map(id => ALL_SONGS.find(track => track.id === id))
    .filter(Boolean);

  const rememberTrack = (track) => {
    if (!track?.id) return;
    setRecentlyPlayedIds(previous => [
      track.id,
      ...previous.filter(id => id !== track.id)
    ].slice(0, 8));
  };

  useEffect(() => {
    try {
      localStorage.setItem('playmusic_recent_tracks', JSON.stringify(recentlyPlayedIds));
    } catch (error) {
      console.error('Unable to save recently played tracks', error);
    }
  }, [recentlyPlayedIds]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [duration, setDuration] = useState(ALL_SONGS[0].duration || 200);
  const [fullTrackSources, setFullTrackSources] = useState({});
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  const [isBuffering, setIsBuffering] = useState(false);

  // Queue state
  const [currentQueue, setCurrentQueue] = useState(ALL_SONGS);
  const [queueIndex, setQueueIndex] = useState(0);

  // Playlists and Liked Songs (persisted in localStorage)
  const [likedTrackIds, setLikedTrackIds] = useState(() => {
    try {
      const saved = localStorage.getItem('spotify_liked_tracks');
      return saved ? JSON.parse(saved) : ['s-1', 's-2', 's-4', 's-6'];
    } catch {
      return ['s-1', 's-2', 's-4', 's-6'];
    }
  });

  const [playlists, setPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem('spotify_custom_playlists');
      if (saved) {
        const parsed = JSON.parse(saved);
        const existingMap = new Map(parsed.map(p => [p.id, p]));
        const merged = INITIAL_PLAYLISTS.map(initPl => {
          if (existingMap.has(initPl.id)) {
            const existing = existingMap.get(initPl.id);
            const songIds = Array.from(new Set([...(existing.songIds || []), ...initPl.songIds]));
            const coverArt = (existing.coverArt && !existing.coverArt.includes('unsplash.com')) ? existing.coverArt : initPl.coverArt;
            return { ...existing, ...initPl, coverArt, songIds };
          }
          return initPl;
        });
        parsed.forEach(p => {
          if (!merged.some(m => m.id === p.id)) {
            merged.push(p);
          }
        });
        return merged;
      }
      return INITIAL_PLAYLISTS;
    } catch {
      return INITIAL_PLAYLISTS;
    }
  });

  // Navigation & View State
  const [history, setHistory] = useState([{ view: 'home', data: null }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentNav = history[historyIndex] || { view: 'home', data: null };
  const currentView = currentNav.view;
  const currentViewData = currentNav.data;

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  // Music Language Filter State ('All' | 'Telugu' | 'Hindi' | 'English' | 'Kannada')
  const [selectedMusicLanguage, setSelectedMusicLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('playmusic_selected_music_language');
      return saved || 'All';
    } catch {
      return 'All';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('playmusic_selected_music_language', selectedMusicLanguage);
    } catch (e) {
      console.error(e);
    }
  }, [selectedMusicLanguage]);

  // Panels & Modals & Visualizer
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [visualizerMode, setVisualizerMode] = useState('wave'); // 'wave' | 'bars' | 'radial' | 'matrix'
  const [activeMood, setActiveMood] = useState('all');
  const [activeDevice, setActiveDevice] = useState('Web Browser (Chrome)');
  const [toastMessage, setToastMessage] = useState(null);

  const toastTimerRef = useRef(null);
  const handleTrackEndedRef = useRef(null);
  const fullTrackSourcesRef = useRef({});

  // Save liked tracks
  useEffect(() => {
    try {
      localStorage.setItem('spotify_liked_tracks', JSON.stringify(likedTrackIds));
    } catch (e) {
      console.error(e);
    }
  }, [likedTrackIds]);

  // Save playlists
  useEffect(() => {
    try {
      localStorage.setItem('spotify_custom_playlists', JSON.stringify(playlists));
    } catch (e) {
      console.error(e);
    }
  }, [playlists]);

  // Toast Helper
  const showToast = (message) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const showToastRef = useRef(showToast);

  useEffect(() => {
    let isMounted = true;

    getStoredAudioTracks()
      .then((storedTracks) => {
        const sources = { ...fullTrackSourcesRef.current };
        storedTracks.forEach(({ trackId, blob }) => {
          if (!sources[trackId] && blob instanceof Blob) {
            sources[trackId] = URL.createObjectURL(blob);
          }
        });

        if (!isMounted) {
          Object.values(sources).forEach(URL.revokeObjectURL);
          return;
        }

        fullTrackSourcesRef.current = sources;
        setFullTrackSources(sources);
      })
      .catch((error) => {
        console.error('Unable to load locally stored audio tracks', error);
        if (isMounted) {
          showToastRef.current('Unable to load your locally stored audio tracks.');
        }
      });

    return () => {
      isMounted = false;
      Object.values(fullTrackSourcesRef.current).forEach(URL.revokeObjectURL);
      fullTrackSourcesRef.current = {};
    };
  }, []);

  // Setup AudioEngine callbacks
  useEffect(() => {
    audioEngine.onTimeUpdateCallback = (currentTime, totalDuration) => {
      setPlaybackProgress(currentTime);
      if (totalDuration > 0 && !isNaN(totalDuration)) {
        setDuration(totalDuration);
      }
    };

    audioEngine.onEndedCallback = () => {
      if (handleTrackEndedRef.current) {
        handleTrackEndedRef.current();
      }
    };

    audioEngine.onBufferingCallback = (buffering) => {
      setIsBuffering(buffering);
    };

    audioEngine.onErrorCallback = (error) => {
      setIsPlaying(false);
      setIsBuffering(false);
      const unsupportedSource = error?.code === 4 || error?.name === 'NotSupportedError';
      showToastRef.current(unsupportedSource
        ? 'This preview cannot play in your browser. Upload a full-length audio file using the button on the cover.'
        : 'Could not load this audio. Check your connection or upload a full-length audio file.');
    };

    return () => {
      audioEngine.onTimeUpdateCallback = null;
      audioEngine.onEndedCallback = null;
      audioEngine.onBufferingCallback = null;
      audioEngine.onErrorCallback = null;
      audioEngine.stop();
    };
  }, []);

  // Navigation Helper
  const navigate = (view, data = null) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ view, data });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Play a track
  const getPlayableTrack = (track) => {
    const audioSrc = fullTrackSourcesRef.current[track.id];
    return audioSrc ? { ...track, audioSrc } : track;
  };

  const saveFullTrackAudio = async (trackId, file) => {
    const supportedAudioType = file?.type.startsWith('audio/') ||
      /\.(aac|flac|m4a|mp3|ogg|opus|wav|webm)$/i.test(file?.name || '');

    if (!file || file.size === 0 || !supportedAudioType) {
      showToast('Choose a supported audio file to load a full track.');
      return false;
    }

    try {
      await saveStoredAudioTrack(trackId, file);
    } catch (error) {
      console.error('Unable to save full-track audio', error);
      showToast('Unable to save this audio file in your browser.');
      return false;
    }

    const audioSrc = URL.createObjectURL(file);
    const previousSource = fullTrackSourcesRef.current[trackId];
    const nextSources = { ...fullTrackSourcesRef.current, [trackId]: audioSrc };
    fullTrackSourcesRef.current = nextSources;
    setFullTrackSources(nextSources);

    if (currentTrack?.id === trackId) {
      setPlaybackProgress(0);
      setIsPlaying(true);
      audioEngine.playTrack({ ...currentTrack, audioSrc }, 0);
    }

    if (previousSource) {
      URL.revokeObjectURL(previousSource);
    }

    showToast(`Full-length audio loaded for "${currentTrack?.id === trackId ? currentTrack.title : 'track'}".`);
    return true;
  };

  const playTrack = (track, newQueue = null) => {
    if (!track) return;
    rememberTrack(track);

    if (newQueue && Array.isArray(newQueue) && newQueue.length > 0) {
      setCurrentQueue(newQueue);
      const idx = newQueue.findIndex(t => t.id === track.id);
      setQueueIndex(idx !== -1 ? idx : 0);
    } else {
      const idx = currentQueue.findIndex(t => t.id === track.id);
      if (idx !== -1) {
        setQueueIndex(idx);
      } else {
        setCurrentQueue([track, ...currentQueue]);
        setQueueIndex(0);
      }
    }

    setCurrentTrack(track);
    setPlaybackProgress(0);
    setDuration(track.duration || 200);
    setIsPlaying(true);
    audioEngine.playTrack(getPlayableTrack(track), 0);
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    if (!currentTrack) {
      if (ALL_SONGS.length > 0) {
        playTrack(ALL_SONGS[0]);
      }
      return;
    }

    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.resume(getPlayableTrack(currentTrack), playbackProgress);
      setIsPlaying(true);
    }
  };

  // Next Track
  const playNextTrack = () => {
    if (currentQueue.length === 0) return;

    if (repeatMode === 'one' && currentTrack) {
      audioEngine.seek(0);
      setPlaybackProgress(0);
      audioEngine.resume(getPlayableTrack(currentTrack), 0);
      return;
    }

    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * currentQueue.length);
    } else {
      nextIndex = queueIndex + 1;
      if (nextIndex >= currentQueue.length) {
        if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          setIsPlaying(false);
          audioEngine.pause();
          return;
        }
      }
    }

    const nextTrack = currentQueue[nextIndex];
    if (nextTrack) {
      rememberTrack(nextTrack);
      setQueueIndex(nextIndex);
      setCurrentTrack(nextTrack);
      setPlaybackProgress(0);
      setDuration(nextTrack.duration || 200);
      setIsPlaying(true);
      audioEngine.playTrack(getPlayableTrack(nextTrack), 0);
    }
  };

  // Previous Track
  const playPreviousTrack = () => {
    // If more than 3 seconds in, restart track
    if (playbackProgress > 3) {
      audioEngine.seek(0);
      setPlaybackProgress(0);
      return;
    }

    if (currentQueue.length === 0) return;

    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      prevIndex = currentQueue.length - 1;
    }

    const prevTrack = currentQueue[prevIndex];
    if (prevTrack) {
      rememberTrack(prevTrack);
      setQueueIndex(prevIndex);
      setCurrentTrack(prevTrack);
      setPlaybackProgress(0);
      setDuration(prevTrack.duration || 200);
      setIsPlaying(true);
      audioEngine.playTrack(getPlayableTrack(prevTrack), 0);
    }
  };

  const handleTrackEnded = () => {
    playNextTrack();
  };

  useEffect(() => {
    handleTrackEndedRef.current = handleTrackEnded;
  });

  // Seek
  const seekTo = (seconds) => {
    const s = Math.max(0, Math.min(duration, seconds));
    setPlaybackProgress(s);
    audioEngine.seek(s);
  };

  // Volume
  const changeVolume = (val) => {
    const v = Math.max(0, Math.min(1, val));
    setVolume(v);
    if (isMuted && v > 0) setIsMuted(false);
    audioEngine.setVolume(v);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setVolume(volume || 0.5);
    } else {
      setIsMuted(true);
      audioEngine.setVolume(0);
    }
  };

  // Shuffle & Repeat
  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    showToast(!isShuffle ? "Shuffle enabled" : "Shuffle disabled");
  };

  const toggleRepeat = () => {
    const nextModes = { off: 'all', all: 'one', one: 'off' };
    const nextMode = nextModes[repeatMode];
    setRepeatMode(nextMode);
    const messages = { off: 'Repeat off', all: 'Repeat all', one: 'Repeat track' };
    showToast(messages[nextMode]);
  };

  // Liked Songs
  const isTrackLiked = (trackId) => likedTrackIds.includes(trackId);

  const toggleLikeTrack = (trackId) => {
    if (likedTrackIds.includes(trackId)) {
      setLikedTrackIds(likedTrackIds.filter(id => id !== trackId));
      showToast("Removed from Liked Songs");
    } else {
      setLikedTrackIds([...likedTrackIds, trackId]);
      showToast("Added to Liked Songs");
    }
  };

  // Playlist Management
  const createNewPlaylist = (title, description = '') => {
    const newPlaylist = {
      id: 'pl-' + Date.now(),
      title: title || `My Playlist #${playlists.length + 1}`,
      description: description || 'Created by you',
      coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      gradientColor: '#284b63',
      owner: 'You',
      likesCount: '1 save',
      songIds: []
    };
    setPlaylists([newPlaylist, ...playlists]);
    showToast(`Created playlist "${newPlaylist.title}"`);
    navigate('playlist', newPlaylist.id);
  };

  const addSongToPlaylist = (playlistId, songId) => {
    setPlaylists(playlists.map(pl => {
      if (pl.id === playlistId) {
        if (!pl.songIds.includes(songId)) {
          return { ...pl, songIds: [...pl.songIds, songId] };
        }
      }
      return pl;
    }));
    showToast("Added to playlist");
  };

  const removeSongFromPlaylist = (playlistId, songId) => {
    setPlaylists(playlists.map(pl => {
      if (pl.id === playlistId) {
        return { ...pl, songIds: pl.songIds.filter(id => id !== songId) };
      }
      return pl;
    }));
    showToast("Removed from playlist");
  };

  const deletePlaylist = (playlistId) => {
    const playlist = playlists.find(pl => pl.id === playlistId);
    if (!playlist || playlist.owner !== 'You') {
      showToast('Only playlists you created can be deleted');
      return false;
    }

    setPlaylists(currentPlaylists => currentPlaylists.filter(pl => pl.id !== playlistId));
    navigate('library');
    showToast(`Deleted playlist "${playlist.title}"`);
    return true;
  };

  // Helper getters
  const getLikedSongs = () => {
    return ALL_SONGS.filter(s => likedTrackIds.includes(s.id));
  };

  const getPlaylistById = (id) => {
    // 1. Direct playlist match
    const existing = playlists.find(p => p.id === id);
    if (existing) return existing;

    // 2. Personalized playlist match
    const pers = PERSONALIZED_PLAYLISTS.find(p => p.id === id);
    if (pers) {
      return {
        id: pers.id,
        title: pers.title,
        description: pers.subtitle,
        coverArt: pers.coverArt,
        gradientColor: pers.accentColor || '#00f0ff',
        owner: 'PlayMusic AI',
        likesCount: '2,481,200',
        songIds: pers.songIds
      };
    }

    // 3. Trending Album match
    const alb = TRENDING_ALBUMS.find(a => a.id === id);
    if (alb) {
      const albumSongs = ALL_SONGS.filter(s => s.albumId === id || s.album === alb.title);
      return {
        id: alb.id,
        title: alb.fullTitle || alb.title,
        description: `Official Album by ${alb.artist} • Released in ${alb.year} • ${alb.genre}`,
        coverArt: alb.coverArt,
        gradientColor: alb.dominantColor || '#00f0ff',
        owner: alb.artist,
        likesCount: '15,820,400',
        isAlbum: true,
        songIds: albumSongs.length > 0 ? albumSongs.map(s => s.id) : ALL_SONGS.slice(0, 6).map(s => s.id)
      };
    }

    // 4. Any album match in ALL_SONGS
    const albumSongs = ALL_SONGS.filter(s => s.albumId === id || s.album === id);
    if (albumSongs.length > 0) {
      const first = albumSongs[0];
      return {
        id,
        title: first.album,
        description: `Official Album by ${first.artist} • Released in ${first.releaseDate || '2024'} • ${first.language} Master Recording`,
        coverArt: first.coverArt,
        gradientColor: first.dominantColor || '#8b5cf6',
        owner: first.artist,
        isAlbum: true,
        songIds: albumSongs.map(s => s.id)
      };
    }

    return null;
  };

  const getSongsByMood = (mood) => {
    if (!mood || mood === 'all') return ALL_SONGS;

    const moodMap = {
      cyber: ['Electronic', 'Dance / Party', 'Item / Dance', 'Heavy Anthem', 'Hip-Hop', 'Punjabi-Hindi Hip-Hop'],
      chill: ['Lo-Fi', 'Psychedelic Indie', 'Classical Pop', 'Divine Classical', 'Focus'],
      drive: ['Pop / Melodic', 'Melody', 'Pop', 'Soulful Melody', 'R&B'],
      workout: ['Heavy Rock', 'Rock', 'Mass / Folk', 'Folk / Dance', 'Item / Dance', 'Dance / Party', 'Heavy Anthem'],
      romance: ['Romance', 'Romantic', 'Romantic Melody', 'Soulful Melody', 'Pop / Romantic', 'Classic Ballad', 'Folk Romance', 'Emotive Melody'],
      focus: ['Focus', 'Lo-Fi', 'Electronic', 'Divine Classical']
    };

    const targetGenres = moodMap[mood] || [];
    const matched = ALL_SONGS.filter(s => targetGenres.includes(s.genre));
    return matched.length > 0 ? matched : ALL_SONGS.slice(0, 8);
  };

  const getArtistById = (id) => {
    return ARTISTS_DATA.find(a => a.id === id);
  };

  return (
    <MusicContext.Provider
      value={{
        // Playback
        language,
        setLanguage,
        t,
        currentTrack,
        recentlyPlayed,
        isPlaying,
        playbackProgress,
        duration,
        hasFullTrackAudio: Boolean(fullTrackSources[currentTrack?.id]),
        volume: isMuted ? 0 : volume,
        rawVolume: volume,
        isMuted,
        isShuffle,
        repeatMode,
        isBuffering,
        currentQueue,
        queueIndex,

        // Actions
        playTrack,
        saveFullTrackAudio,
        togglePlay,
        playNextTrack,
        playPreviousTrack,
        seekTo,
        changeVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,

        // Liked & Playlists
        likedTrackIds,
        playlists,
        isTrackLiked,
        toggleLikeTrack,
        createNewPlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        deletePlaylist,
        getLikedSongs,
        getPlaylistById,
        getArtistById,
        getSongsByMood,

        // Navigation
        currentView,
        currentViewData,
        navigate,
        goBack,
        goForward,
        canGoBack: historyIndex > 0,
        canGoForward: historyIndex < history.length - 1,

        // Search & Category & Language & Mood
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        selectedMusicLanguage,
        setSelectedMusicLanguage,
        activeMood,
        setActiveMood,

        // Modals & Panels & Visualizer
        isLyricsOpen,
        setIsLyricsOpen,
        isQueueOpen,
        setIsQueueOpen,
        isDeviceModalOpen,
        setIsDeviceModalOpen,
        activeDevice,
        setActiveDevice,
        isCreatePlaylistOpen,
        setIsCreatePlaylistOpen,
        isVisualizerOpen,
        setIsVisualizerOpen,
        visualizerMode,
        setVisualizerMode,

        // Toasts
        toastMessage,
        showToast,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
