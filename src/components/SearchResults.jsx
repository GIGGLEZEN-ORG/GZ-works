import { useMusic } from '../context/MusicContext';
import SearchSongList from './SearchSongList';
import SearchEntityResults from './SearchEntityResults';

export default function SearchResults({
  searchQuery,
  matchedSongs,
  matchedArtists,
  matchedPlaylists,
}) {
  const { t } = useMusic();

  if (matchedSongs.length === 0 && matchedArtists.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-bold text-white mb-2">
          {t('No results found for')} "{searchQuery}"
        </h3>
        <p className="text-sm text-[#a7a7a7]">
          {t('Please make sure your words are spelled correctly, or use fewer or different keywords.')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SearchSongList songs={matchedSongs} />

      {matchedArtists.length > 0 && (
        <SearchEntityResults
          title="Artists"
          items={matchedArtists}
          type="artist"
        />
      )}

      {matchedPlaylists.length > 0 && (
        <SearchEntityResults
          title="Playlists"
          items={matchedPlaylists}
          type="playlist"
        />
      )}
    </div>
  );
}
