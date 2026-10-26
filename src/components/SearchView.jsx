import { useState, useEffect } from 'react';
import { useMusic } from '../context/MusicContext';
import { ALL_SONGS, MUSIC_CATEGORIES, ARTISTS_DATA, INITIAL_PLAYLISTS } from '../data/musicData';
import SearchBrowseCategories from './SearchBrowseCategories';
import SearchResults from './SearchResults';

export default function SearchView() {
  const { searchQuery, setSearchQuery, navigate } = useMusic();
  const query = searchQuery.trim().toLowerCase();
  const [onlineSongs, setOnlineSongs] = useState([]);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setOnlineSongs([]);
      setIsSearchingOnline(false);
      return;
    }

    let isCancelled = false;
    const timer = setTimeout(async () => {
      setIsSearchingOnline(true);
      try {
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=15`);
        const data = await res.json();
        if (!isCancelled && data.results) {
          const songs = data.results
            .filter(tr => tr.previewUrl)
            .map(tr => {
              const durationSec = tr.trackTimeMillis ? Math.round(tr.trackTimeMillis / 1000) : 180;
              const mins = Math.floor(durationSec / 60);
              const secs = durationSec % 60;
              let artwork = tr.artworkUrl100 || '';
              if (artwork) artwork = artwork.replace('100x100bb', '600x600bb');

              return {
                id: `online-${tr.trackId}`,
                title: tr.trackName,
                artist: tr.artistName,
                album: tr.collectionName || tr.trackName,
                duration: durationSec,
                durationFormatted: `${mins}:${secs < 10 ? '0' : ''}${secs}`,
                coverArt: artwork,
                audioSrc: tr.previewUrl,
                dominantColor: '#1db954',
                genre: tr.primaryGenreName || 'Pop',
                releaseDate: tr.releaseDate ? tr.releaseDate.substring(0, 4) : '2024',
                streams: '10,000,000+'
              };
            });
          setOnlineSongs(songs);
        }
      } catch (err) {
        console.warn('Online song search failed:', err);
      } finally {
        if (!isCancelled) setIsSearchingOnline(false);
      }
    }, 350);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const localSongs = ALL_SONGS.filter(song =>
    song.title.toLowerCase().includes(query) ||
    song.artist.toLowerCase().includes(query) ||
    song.album.toLowerCase().includes(query) ||
    song.genre.toLowerCase().includes(query) ||
    (song.language && song.language.toLowerCase().includes(query))
  );

  const filteredOnline = onlineSongs.filter(
    os => !localSongs.some(ls => ls.title.toLowerCase() === os.title.toLowerCase())
  );

  const matchedSongs = [...localSongs, ...filteredOnline];

  const matchedArtists = ARTISTS_DATA.filter(artist =>
    artist.name.toLowerCase().includes(query)
  );

  const matchedPlaylists = INITIAL_PLAYLISTS.filter(playlist =>
    playlist.title.toLowerCase().includes(query) ||
    playlist.description.toLowerCase().includes(query)
  );

  if (!query) {
    return (
      <div className="p-6 md:p-8 space-y-8 select-none">
        <SearchBrowseCategories
          categories={MUSIC_CATEGORIES}
          playlists={INITIAL_PLAYLISTS}
          navigate={navigate}
          setSearchQuery={setSearchQuery}
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 select-none">
      <SearchResults
        searchQuery={searchQuery}
        matchedSongs={matchedSongs}
        matchedArtists={matchedArtists}
        matchedPlaylists={matchedPlaylists}
        isLoading={isSearchingOnline && matchedSongs.length === 0}
      />
    </div>
  );
}
