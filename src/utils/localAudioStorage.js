const DATABASE_NAME = 'playmusic-local-audio';
const STORE_NAME = 'tracks';
const DATABASE_VERSION = 1;

const openAudioDatabase = () => new Promise((resolve, reject) => {
  if (!('indexedDB' in window)) {
    reject(new Error('This browser does not support local audio storage.'));
    return;
  }

  const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

  request.onupgradeneeded = () => {
    const database = request.result;
    if (!database.objectStoreNames.contains(STORE_NAME)) {
      database.createObjectStore(STORE_NAME, { keyPath: 'trackId' });
    }
  };

  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error || new Error('Unable to open local audio storage.'));
  request.onblocked = () => reject(new Error('Local audio storage is blocked by another tab.'));
});

export const getStoredAudioTracks = async () => {
  const database = await openAudioDatabase();

  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readonly');
      const request = transaction.objectStore(STORE_NAME).getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Unable to load stored audio tracks.'));
      transaction.onabort = () => reject(transaction.error || new Error('Loading stored audio tracks was interrupted.'));
    });
  } finally {
    database.close();
  }
};

export const saveStoredAudioTrack = async (trackId, file) => {
  const database = await openAudioDatabase();

  try {
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).put({
        trackId,
        blob: file,
        fileName: file.name,
        mimeType: file.type
      });

      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error('Unable to save this audio track.'));
      transaction.onabort = () => reject(transaction.error || new Error('Saving this audio track was interrupted.'));
    });
  } finally {
    database.close();
  }
};
