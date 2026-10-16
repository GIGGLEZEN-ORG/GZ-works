import { useMusic } from '../context/MusicContext';
import { ALL_SONGS, MUSIC_CATEGORIES, ARTISTS_DATA, INITIAL_PLAYLISTS } from '../data/musicData';
import SearchBrowseCategories from './SearchBrowseCategories';
import SearchResults from './SearchResults';

export default function SearchView() {
  const { searchQuery, setSearchQuery, navigate } = useMusic();
  const query = searchQuery.trim().toLowerCase();

  const matchedSongs = ALL_SONGS.filter(song =>
    song.title.toLowerCase().includes(query) ||
    song.artist.toLowerCase().includes(query) ||
    song.album.toLowerCase().includes(query) ||
    song.genre.toLowerCase().includes(query) ||
    (song.language && song.language.toLowerCase().includes(query))
  );

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
      />
    </div>
  );
}
