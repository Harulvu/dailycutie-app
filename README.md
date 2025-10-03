# 💖 Dailycutie - Daily Reminder & Music App

A beautiful Progressive Web App (PWA) that combines daily reminders and music playback in one adorable kawaii package!

## ✨ Features

### 📅 Daily Reminders
- **Add custom reminders** with date, time, and descriptions
- **Recurring reminders** (daily, weekly, once)
- **Real-time notifications** when reminders are due
- **Edit and manage** existing reminders
- **Mark as complete** or delete reminders
- **Persistent storage** - reminders saved locally

### 🎵 Music Player
- **Upload and play audio files** (MP3, WAV, OGG, AAC, M4A, FLAC)
- **Create playlists** with custom titles and artists
- **Playback controls** (play, pause, next, previous, loop)
- **Real-time progress bar** with progress tracking
- **Visual playlist** with easy navigation
- **Multiple file upload** with progress indicators

## 🚀 Installation

### Option 1: Install as PWA (Recommended)
1. Open `index.html` in a web browser
2. Click the **"Install App"** button in the top-right corner
3. The app will be installed on your device home screen
4. Works like a native app with offline support!

### Option 2: Run Locally
1. Open `index.html` directly in your browser
2. All features work without installation
3. Perfect for testing and development

### Option 3: Local Server (Best for Development)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Then visit: http://localhost:8000
```

## 🎨 Design Features

- **Beautiful gradient backgrounds** in pink/coral theme
- **Responsive design** - works on phone, tablet, and desktop
- **Smooth animations** and hover effects
- **Modern card-based layout**
- **Accessible color scheme** with good contrast
- **Mobile-first design** with touch-friendly buttons

## 💾 Data Storage

- **Local Storage** - All data saved in your browser
- **No external dependencies** - works completely offline
- **Privacy-focused** - data stays on your device
- **Persistent** - data survives browser restarts

## 🛠️ Technical Details

### Files Structure
```
Dailycutie/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── app.js             # JavaScript functionality
├── manifest.json      # PWA configuration
└── README.md          # This file
```

### Technologies Used
- **HTML5** - Modern semantic markup
- **CSS3** - Flexbox, Grid, animations
- **Vanilla JavaScript** - No external libraries
- **PWA APIs** - Service Worker, Manifest, Installation
- **Local Storage API** - Data persistence

### Browser Compatibility
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari (iOS 11.3+)
- ✅ Mobile browsers

## 🎯 How to Use

### Adding Reminders
1. Click **"Reminders"** tab
2. Click **"+ Add Reminder"** button
3. Fill in title, description, date/time
4. Choose repeat frequency
5. Click **"Save Reminder"**

### Playing Music
1. Click **"Music"** tab
2. Click **"+ Add Song"** to upload audio files
3. Songs appear in playlist below
4. Click any song to play
5. Use controls to play/pause/next/previous

### Playing Games
1. Click **"Games"** tab
2. Choose a game card
3. Game loads below the grid
4. Play and enjoy!

### Using Utilities
1. Click **"Apps"** tab
2. Choose Weather, Notes, or Timer
3. Each opens in the game area below

## 🔧 Customization

### Changing Colors
Edit `styles.css` and modify these variables:
```css
/* Main theme colors */
background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%);
color: #ff6b9d; /* Primary pink */
```

### Adding More Games
1. Add game HTML structure to `app.js`
2. Create CSS styles in `styles.css`
3. Add click handler in the games grid

### Music File Support
- MP3, WAV, OGG, AAC
- Local file upload only
- Base64 encoding for storage

## 🚀 PWA Features

- **Installable** on home screen
- **Offline support** (basic functionality)
- **Push notifications** (ready for implementation)
- **App shortcuts** for quick actions
- **Responsive icons** for all devices

## 📱 Mobile Experience

- **Touch-friendly** buttons and controls
- **Swipe gestures** ready for implementation
- **Mobile navigation** with collapsible menu
- **Optimized layouts** for small screens
- **PWA installation** prompt

## 🔒 Privacy & Security

- **No data collection** - everything stored locally
- **No external APIs** required for basic functionality
- **Offline-first** design
- **No tracking** or analytics

## 🆘 Troubleshooting

### Common Issues

**App won't install:**
- Make sure you're using HTTPS or localhost
- Check browser compatibility
- Clear browser cache

**Reminders not saving:**
- Check if localStorage is enabled
- Try refreshing the page
- Check browser console for errors

**Music won't play:**
- Ensure audio files are in supported format
- Check file size (large files may not work)
- Try different audio files

## 🎉 Future Enhancements

- [ ] Push notifications for reminders
- [ ] Cloud sync across devices
- [ ] More games and mini-apps
- [ ] Weather API integration
- [ ] Music streaming capabilities
- [ ] Dark/light theme toggle
- [ ] Export/import data

## 📄 License

This project is open source and available for personal use and modification.

---

**Made with 💖 for daily productivity and entertainment!**
