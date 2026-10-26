import { useMusic } from '../context/MusicContext';

export default function SearchBrowseCategories({
  categories,
  playlists,
  navigate,
  setSearchQuery,
}) {
  const { t } = useMusic();

  const handleCategoryClick = (category) => {
    const playlist = playlists.find(item =>
      item.id.includes(category.title.toLowerCase()) ||
      item.title.toLowerCase().includes(category.title.toLowerCase()) ||
      item.description.toLowerCase().includes(category.title.toLowerCase())
    );

    if (playlist) {
      navigate('playlist', playlist.id);
    } else {
      setSearchQuery(category.title);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-5 tracking-tight">
        {t('Browse all')}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {categories.map(category => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className={`music-card relative h-44 rounded-lg p-4 overflow-hidden cursor-pointer bg-gradient-to-br ${category.color} hover:brightness-105 transition-transform duration-200 hover:scale-[1.02] shadow-md`}
          >
            <h3 className="text-xl font-bold text-white tracking-tight break-words max-w-[80%]">
              {category.title}
            </h3>
            <img
              src={category.image}
              alt={category.title}
              className="absolute -bottom-2 -right-3 w-24 h-24 object-cover rounded shadow-2xl rotate-[25deg] transform translate-x-2 translate-y-2 pointer-events-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
