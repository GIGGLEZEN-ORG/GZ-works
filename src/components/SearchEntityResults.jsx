import { useMusic } from '../context/MusicContext';

export default function SearchEntityResults({ title, items, type }) {
  const { navigate } = useMusic();
  const isArtist = type === 'artist';

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => navigate(isArtist ? 'artist' : 'playlist', item.id)}
            className="music-card group p-4 bg-[#181818] hover:bg-[#282828] rounded-lg cursor-pointer transition-all duration-300 flex flex-col"
          >
            <div className={`relative mb-4 aspect-square w-full overflow-hidden shadow-xl ${
              isArtist ? 'rounded-full' : 'rounded-md'
            }`}>
              <img
                src={isArtist ? item.avatar : item.coverArt}
                alt={isArtist ? item.name : item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-bold text-sm text-white truncate mb-1">
              {isArtist ? item.name : item.title}
            </h3>
            <p className={`text-xs text-[#a7a7a7] ${isArtist ? '' : 'line-clamp-2'}`}>
              {isArtist ? 'Artist' : `By ${item.owner}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
