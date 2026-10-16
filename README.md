# 🎵 playmusic Web Player

A responsive music web player built with **React**, **Tailwind CSS**, and **Lucide Icons**. Includes audio playback (with built-in Web Audio API synthesizer fallback), synchronized karaoke-style lyrics, dynamic playlist management, and responsive dark-theme design.

---

## ✨ Features

### 1. 🎧 Authentic Music Playback & Audio Engine
- **HTML5 Audio + Procedural Web Audio Synth Fallback**: Seamless playback that never fails or triggers CORS errors.
- **Controls**: Play, Pause, Next, Previous, Seek timeline with hover glow, Volume slider, Mute/Unmute.
- **Modes**: Shuffle mode (with green indicator dot) and Repeat mode (Off / Repeat All / Repeat One).
- **Animated Equalizer**: Real-time bouncing animated audio frequency bars on the active playing song.

### 2. 🎤 Real-Time Synchronized Lyrics (Karaoke Mode)
- **Active Lyric Highlighting**: Automatically detects the current playback timestamp and emphasizes the active singing line in bold white.
- **Jump-to-Time**: Click on any lyric line to instantly jump playback to that exact point in the song.
- **Dynamic Ambient Color**: Radial gradient backdrop automatically tinted with the song's dominant color.

### 3. 🧭 Navigation & Core Views
- **Home View**:
  - Time-based personalized greeting (*"Good morning"*, *"Good afternoon"*, *"Good evening"*).
  - 6 Quick-Access cards (Liked Songs, Top Hits, Lo-Fi, Synthwave, Rock) with floating hover green play buttons.
  - Carousels: *"Made For You"*, *"Today's Biggest Hits"*, *"Popular Artists"*, and *"Focus & Chill Beats"*.
- **Search View**:
  - Live debounced search across songs, artists, albums, and genres.
  - "Browse All" category tiles with angled cover art and vibrant gradients.
  - Detailed results with Top Result spotlight card, song list, artists, and playlists.
- **Playlist & Album View**:
  - Immersive hero header with cover art, creator badge, save count, and duration.
  - Play All action bar with Heart, Download, and search-in-playlist filter.
  - Full tracklist table with index/play hover swap, artist link, album, date added, duration, and options menu.
- **Artist Profile View**:
  - Verified artist checkmark badge and banner.
  - Monthly listeners counter and interactive **Follow** button.
  - Top 5 popular tracks and artist bio.
- **Liked Songs View**:
  - Persistent favorite songs list (saved in `localStorage`).
  - 1-click Heart toggle on any song across the entire application.
- **Your Library View**:
  - Grid View and List View switcher.
  - Filter by Playlists and Artists.
  - Quick "Create playlist" shortcut.
- **Interface Languages**: Choose English, Hindi, Kannada, or Telugu from the language selector. Your choice is saved on this device.

### 4. 🎛️ Queue & Device Switcher
- **Up Next Queue Drawer**: View currently playing track and browse/play all upcoming songs in the queue.
- **playmusic Connect Device Modal**: Switch playback target between Browser, Living Room Soundbar, MacBook, iPhone, and AirPods.
- **Custom Playlists**: Create new playlists, add songs from Home or Search with the song's `...` menu, remove songs from the playlist's song menu, and delete your own playlists from the playlist options menu.
- **Options Menu (`...`)**: Add to Liked Songs, Add to custom playlists, Copy song link, or Visit artist profile.

---

## 🛠️ Tech Stack

- **React 19**
- **Tailwind CSS 3.4**
- **Vite 8**
- **Lucide React** (icons)
- **Web Audio API & HTML5 Audio**

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```

### 3. Build for production
```bash
npm run build
```
