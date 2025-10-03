// Dailycutie - Daily Reminder & Entertainment App JavaScript

// ========================================
// GLOBAL VARIABLES
// ========================================

let currentSection = 'reminders';
let reminders = JSON.parse(localStorage.getItem('dailycutieReminders')) || [];
let playlist = JSON.parse(localStorage.getItem('dailycutiePlaylist')) || [];
let currentSongIndex = 0;
let isPlaying = false;
let isLooping = false;
let audio = new Audio();

// PWA Installation
let deferredPrompt;

// Window state
let isMaximized = false;

// ========================================
// WINDOW CONTROL FUNCTIONS
// ========================================

function minimizeWindow() {
    showNotification('Window minimized! 💫', 'info');
}

function maximizeWindow() {
    const window = document.querySelector('.window');
    const container = document.querySelector('.desktop-container');

    if (!isMaximized) {
        window.style.width = '95%';
        window.style.height = '95vh';
        window.style.borderRadius = '0';
        container.style.padding = '10px';
        isMaximized = true;
        showNotification('Window maximized! 📏', 'info');
    } else {
        window.style.width = '90%';
        window.style.height = 'auto';
        window.style.borderRadius = '15px 15px 0 0';
        container.style.padding = '20px';
        isMaximized = false;
        showNotification('Window restored! 🪟', 'info');
    }
}

function closeWindow() {
    if (confirm('Close Dailycutie? 💔')) {
        showNotification('Thanks for using Dailycutie! See you soon! 💖', 'info');
        // In a real app, this would close the window
        // window.close();
    }
}

// ========================================
// NAVIGATION FUNCTIONS
// ========================================

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.app-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected section
    document.getElementById(`${sectionName}-section`).classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');

    currentSection = sectionName;

    // Load section-specific data
    if (sectionName === 'reminders') {
        loadReminders();
    } else if (sectionName === 'music') {
        loadPlaylist();
    }
}

// ========================================
// DAILY REMINDERS FUNCTIONS
// ========================================

function openReminderModal() {
    document.getElementById('reminderModal').style.display = 'block';
}

function closeReminderModal() {
    document.getElementById('reminderModal').style.display = 'none';
    document.getElementById('reminderForm').reset();

    // Reset modal to "Add" mode
    document.querySelector('#reminderModal h2').textContent = 'Add New Reminder';
    document.querySelector('#reminderForm button[type="submit"]').textContent = 'Save Reminder';

    // Clear edit mode
    delete document.getElementById('reminderModal').dataset.editId;
}

function saveReminder(event) {
    event.preventDefault();

    const editId = document.getElementById('reminderModal').dataset.editId;
    const now = new Date().toISOString();

    if (editId) {
        // Update existing reminder
        const reminderIndex = reminders.findIndex(r => r.id == editId);
        if (reminderIndex !== -1) {
            reminders[reminderIndex] = {
                ...reminders[reminderIndex],
                title: document.getElementById('reminderTitle').value,
                description: document.getElementById('reminderDesc').value,
                time: document.getElementById('reminderTime').value,
                repeat: document.getElementById('reminderRepeat').value,
                created: reminders[reminderIndex].created, // Keep original creation date
                completed: reminders[reminderIndex].completed // Keep completion status
            };

            showNotification(`Reminder "${reminders[reminderIndex].title}" updated!`, 'success');
        }

        // Clear edit mode
        delete document.getElementById('reminderModal').dataset.editId;
    } else {
        // Add new reminder
        const reminder = {
            id: Date.now(),
            title: document.getElementById('reminderTitle').value,
            description: document.getElementById('reminderDesc').value,
            time: document.getElementById('reminderTime').value,
            repeat: document.getElementById('reminderRepeat').value,
            created: now,
            completed: false
        };

        reminders.push(reminder);
        showNotification(`Reminder "${reminder.title}" added!`, 'success');
    }

    localStorage.setItem('dailycutieReminders', JSON.stringify(reminders));

    loadReminders();
    closeReminderModal();
}

function loadReminders() {
    const container = document.getElementById('remindersList');

    if (reminders.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                <p>No reminders yet. Add your first reminder!</p>
            </div>
        `;
        return;
    }

    // Sort reminders by time
    reminders.sort((a, b) => new Date(a.time) - new Date(b.time));

    container.innerHTML = reminders.map(reminder => `
        <div class="reminder-card">
            <div class="reminder-header">
                <div>
                    <div class="reminder-title">${reminder.title}</div>
                    <div class="reminder-time">${formatDateTime(reminder.time)}</div>
                </div>
                <div class="reminder-actions">
                    <button onclick="toggleReminder(${reminder.id})" title="Complete">
                        ${reminder.completed ? '✅' : '⏰'}
                    </button>
                    <button onclick="editReminder(${reminder.id})" title="Edit">✏️</button>
                    <button onclick="deleteReminder(${reminder.id})" title="Delete">🗑️</button>
                </div>
            </div>
            ${reminder.description ? `<div class="reminder-desc">${reminder.description}</div>` : ''}
        </div>
    `).join('');
}

function deleteReminder(id) {
    if (confirm('Delete this reminder?')) {
        reminders = reminders.filter(r => r.id !== id);
        localStorage.setItem('dailycutieReminders', JSON.stringify(reminders));
        loadReminders();
    }
}

function toggleReminder(id) {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
        reminder.completed = !reminder.completed;
        localStorage.setItem('dailycutieReminders', JSON.stringify(reminders));
        loadReminders();
    }
}

function editReminder(id) {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
        // Populate the form with existing reminder data
        document.getElementById('reminderTitle').value = reminder.title;
        document.getElementById('reminderDesc').value = reminder.description;
        document.getElementById('reminderTime').value = reminder.time;
        document.getElementById('reminderRepeat').value = reminder.repeat;

        // Store the ID of the reminder being edited
        document.getElementById('reminderModal').dataset.editId = id;

        // Update modal title and button text
        document.querySelector('#reminderModal h2').textContent = 'Edit Reminder';
        document.querySelector('#reminderForm button[type="submit"]').textContent = 'Update Reminder';

        // Show the modal
        document.getElementById('reminderModal').style.display = 'block';
    }
}

// ========================================
// MUSIC PLAYER FUNCTIONS
// ========================================

function openMusicModal() {
    document.getElementById('musicModal').style.display = 'block';
}

function closeMusicModal() {
    document.getElementById('musicModal').style.display = 'none';
}

function togglePlay() {
    if (playlist.length === 0) {
        showNotification('No songs in playlist!', 'error');
        return;
    }

    if (isPlaying) {
        audio.pause();
        document.getElementById('playBtn').innerHTML = '▶️';
        isPlaying = false;
    } else {
        audio.play();
        document.getElementById('playBtn').innerHTML = '⏸️';
        isPlaying = true;
    }
}

function nextSong() {
    if (playlist.length === 0) return;

    if (isLooping && currentSongIndex === playlist.length - 1) {
        // If looping and on last song, go back to first
        currentSongIndex = 0;
    } else {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
    }
    playSong(currentSongIndex);
}

// Toggle loop functionality
function toggleLoop() {
    isLooping = !isLooping;
    const loopBtn = document.getElementById('loopBtn');

    if (isLooping) {
        loopBtn.style.background = '#ff6b9d';
        loopBtn.style.color = 'white';
        showNotification('Loop enabled - songs will repeat!', 'info');
    } else {
        loopBtn.style.background = '';
        loopBtn.style.color = '';
        showNotification('Loop disabled', 'info');
    }
}

function previousSong() {
    if (playlist.length === 0) return;
    currentSongIndex = currentSongIndex === 0 ? playlist.length - 1 : currentSongIndex - 1;
    playSong(currentSongIndex);
}

function playSong(index) {
    const song = playlist[index];
    audio.src = song.url;
    audio.play();

    document.getElementById('currentSong').textContent = song.title;
    document.getElementById('currentArtist').textContent = song.artist || 'Unknown Artist';

    // Update playlist UI
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    isPlaying = true;
    document.getElementById('playBtn').innerHTML = '⏸️';
    currentSongIndex = index;
}

function loadPlaylist() {
    const container = document.getElementById('playlist');

    if (playlist.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                <p>No songs in playlist. Add some music!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = playlist.map((song, index) => `
        <div class="playlist-item" onclick="playSong(${index})">
            <div style="width: 40px; height: 40px; background: #ff6b9d; border-radius: 5px; margin-right: 1rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                ${song.title.charAt(0)}
            </div>
            <div>
                <div style="font-weight: 600;">${song.title}</div>
                <div style="color: #666; font-size: 0.9rem;">${song.artist || 'Unknown Artist'}</div>
            </div>
        </div>
    `).join('');
}

// ========================================
// MUSIC UPLOAD FUNCTIONS
// ========================================

// Handle file selection for upload
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    const preview = document.getElementById('musicPreview');

    // Clear previous preview
    preview.innerHTML = '';

    files.forEach((file, index) => {
        if (file.type.startsWith('audio/')) {
            // Show immediate loading indicator
            const loadingContainer = document.createElement('div');
            loadingContainer.className = 'audio-preview-item loading';
            loadingContainer.innerHTML = `
                <div class="audio-info">
                    <strong>${file.name}</strong><br>
                    <small>${formatFileSize(file.size)} • Processing...</small>
                </div>
                <div class="loading-progress">
                    <div class="loading-bar">
                        <div class="loading-fill" id="progress-${index}"></div>
                    </div>
                    <small>Reading file...</small>
                </div>
            `;
            preview.appendChild(loadingContainer);

            const reader = new FileReader();

            // Update progress as file reads
            reader.onprogress = function(e) {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    const progressFill = document.getElementById(`progress-${index}`);
                    if (progressFill) {
                        progressFill.style.width = percentComplete + '%';
                    }
                }
            };

            reader.onload = function(e) {
                // Update to completed state
                loadingContainer.classList.remove('loading');
                loadingContainer.innerHTML = `
                    <div class="audio-info">
                        <strong>${file.name}</strong><br>
                        <small>${formatFileSize(file.size)} • ${file.type} ✓</small>
                    </div>
                    <div class="audio-controls">
                        <input type="text" placeholder="Song title" class="song-title-input" value="${file.name.replace(/\.[^/.]+$/, '')}">
                        <input type="text" placeholder="Artist (optional)" class="song-artist-input">
                        <button onclick="addSongToPlaylist(event)" class="add-song-btn">Add to Playlist</button>
                    </div>
                `;

                // Store the file data for later use
                loadingContainer.dataset.audioData = e.target.result;
                loadingContainer.dataset.fileName = file.name;
                loadingContainer.dataset.fileSize = formatFileSize(file.size);
            };

            reader.onerror = function() {
                loadingContainer.innerHTML = `
                    <div class="audio-info">
                        <strong>${file.name}</strong><br>
                        <small style="color: #f44336;">❌ Error reading file</small>
                    </div>
                `;
            };

            // Start reading the file
            reader.readAsDataURL(file);
        } else {
            showNotification(`File "${file.name}" is not a supported audio format!`, 'error');
        }
    });
}

// Add song to playlist (legacy function)
function addToPlaylist(audioData, buttonElement) {
    const container = buttonElement.closest('.audio-preview-item');
    const titleInput = container.querySelector('.song-title-input');
    const artistInput = container.querySelector('.song-artist-input');

    const song = {
        id: Date.now() + Math.random(),
        title: titleInput.value || 'Unknown Title',
        artist: artistInput.value || '',
        url: audioData,
        dateAdded: new Date().toISOString()
    };

    playlist.push(song);
    localStorage.setItem('dailycutiePlaylist', JSON.stringify(playlist));

    loadPlaylist();
    showNotification(`Song "${song.title}" added to playlist!`, 'success');
}

// Add song to playlist (improved function)
function addSongToPlaylist(event) {
    event.preventDefault();

    const button = event.target;
    const container = button.closest('.audio-preview-item');
    const titleInput = container.querySelector('.song-title-input');
    const artistInput = container.querySelector('.song-artist-input');
    const audioData = container.dataset.audioData;
    const fileName = container.dataset.fileName;

    if (!audioData) {
        showNotification('Audio data not ready yet. Please wait for file processing to complete.', 'error');
        return;
    }

    const song = {
        id: Date.now() + Math.random(),
        title: titleInput.value || fileName.replace(/\.[^/.]+$/, ''),
        artist: artistInput.value || '',
        url: audioData,
        dateAdded: new Date().toISOString()
    };

    playlist.push(song);
    localStorage.setItem('dailycutiePlaylist', JSON.stringify(playlist));

    // Update playlist display immediately
    loadPlaylist();

    // Close modal and show success
    closeMusicModal();
    showNotification(`Song "${song.title}" added to playlist!`, 'success');

    // Switch to music section if not already there
    if (currentSection !== 'music') {
        showSection('music');
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ========================================
// MINI APPS FUNCTIONS
// ========================================

function openWeatherApp() {
    const weatherHTML = `
        <h3>Weather App</h3>
        <p>🌤️ Weather information coming soon!</p>
        <p>You can integrate with services like OpenWeatherMap API for real weather data.</p>
    `;
    document.getElementById('game-container').innerHTML = weatherHTML;
}

function openNotesApp() {
    const notesHTML = `
        <h3>Notes App</h3>
        <textarea id="notes" placeholder="Start writing..." style="width: 100%; height: 200px; padding: 1rem; border: 2px solid #ff6b9d; border-radius: 10px;">${localStorage.getItem('dailycutieNotes') || ''}</textarea>
        <br><br>
        <button onclick="saveNotes()">Save Notes</button>
    `;
    document.getElementById('game-container').innerHTML = notesHTML;
}

function openTimerApp() {
    const timerHTML = `
        <h3>Timer App</h3>
        <div>
            <input type="number" id="timerMinutes" placeholder="Minutes" min="1" max="60" style="padding: 0.5rem; margin-right: 1rem;">
            <button onclick="startTimer()">Start Timer</button>
        </div>
        <div id="timerDisplay" style="font-size: 2rem; margin: 1rem 0; font-weight: bold; color: #ff6b9d;"></div>
    `;
    document.getElementById('game-container').innerHTML = timerHTML;
}

// ========================================
// PWA INSTALLATION
// ========================================

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
        });
    } else {
        showNotification('App is already installed or installation not supported on this device', 'info');
    }
}

// ========================================
// REMINDER CHECKER FUNCTIONS
// ========================================

// Start the reminder checker
function startReminderChecker() {
    // Check immediately
    checkDueReminders();

    // Then check every minute
    setInterval(checkDueReminders, 60000);
}

// Check for due reminders and show notifications
function checkDueReminders() {
    const now = new Date();
    const dueReminders = reminders.filter(reminder => {
        if (reminder.completed) return false;

        const reminderTime = new Date(reminder.time);
        const timeDiff = reminderTime - now;

        // Check if reminder is due (within 1 minute)
        return timeDiff <= 60000 && timeDiff >= -60000; // ±1 minute window
    });

    dueReminders.forEach(reminder => {
        showReminderNotification(reminder);
    });
}

// Show reminder notification
function showReminderNotification(reminder) {
    // Mark as completed to avoid repeated notifications
    reminder.completed = true;
    localStorage.setItem('dailycutieReminders', JSON.stringify(reminders));
    loadReminders();

    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(`⏰ Reminder: ${reminder.title}`, {
            body: reminder.description || 'Time for your reminder!',
            icon: 'icon-192.png',
            badge: 'icon-192.png',
            tag: `reminder-${reminder.id}`,
            requireInteraction: true,
            actions: [
                { action: 'snooze', title: 'Snooze 5 min' }
            ]
        });

        notification.onclick = function() {
            // Focus the app when notification is clicked
            window.focus();
            showSection('reminders');
            notification.close();
        };

        // Handle notification actions
        notification.onclose = function() {
            // Auto-snooze if dismissed without action
            snoozeReminder(reminder.id, 5);
        };
    } else if ('Notification' in window && Notification.permission !== 'denied') {
        // Request permission and show notification
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showReminderNotification(reminder);
            } else {
                // Fallback to in-app notification
                showNotification(`⏰ ${reminder.title} - ${reminder.description || 'Reminder!'}`, 'info');
            }
        });
    } else {
        // Fallback to in-app notification
        showNotification(`⏰ ${reminder.title} - ${reminder.description || 'Reminder!'}`, 'info');
    }
}

// Snooze reminder for specified minutes
function snoozeReminder(id, minutes) {
    const reminder = reminders.find(r => r.id == id);
    if (reminder) {
        const snoozeTime = new Date();
        snoozeTime.setMinutes(snoozeTime.getMinutes() + minutes);

        reminder.time = snoozeTime.toISOString();
        reminder.completed = false;

        localStorage.setItem('dailycutieReminders', JSON.stringify(reminders));
        loadReminders();

        showNotification(`Reminder snoozed for ${minutes} minutes`, 'info');
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const now = new Date();
    const diff = date - now;

    if (diff < 0) {
        return `Overdue: ${date.toLocaleString()}`;
    } else if (diff < 60000) { // Less than 1 minute
        return 'In less than a minute';
    } else if (diff < 3600000) { // Less than 1 hour
        return `In ${Math.floor(diff / 60000)} minutes`;
    } else if (diff < 86400000) { // Less than 1 day
        return `In ${Math.floor(diff / 3600000)} hours`;
    } else {
        return date.toLocaleString();
    }
}

function showNotification(message, type = 'info') {
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function saveNotes() {
    const notes = document.getElementById('notes').value;
    localStorage.setItem('dailycutieNotes', notes);
    showNotification('Notes saved!', 'success');
}

function startTimer() {
    const minutes = parseInt(document.getElementById('timerMinutes').value);
    if (!minutes || minutes < 1) {
        showNotification('Please enter valid minutes', 'error');
        return;
    }

    let seconds = minutes * 60;
    const display = document.getElementById('timerDisplay');

    const timer = setInterval(() => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        if (seconds <= 0) {
            clearInterval(timer);
            display.textContent = '00:00';
            showNotification(`Timer finished! ${minutes} minutes completed.`, 'success');

            // Play notification sound if available
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Timer Finished!', {
                    body: `${minutes} minutes completed`,
                    icon: 'icon-192.png'
                });
            }
        }

        seconds--;
    }, 1000);
}



// ========================================
// EVENT LISTENERS
// ========================================

// Reminder form submission
document.getElementById('reminderForm').addEventListener('submit', saveReminder);

// PWA Installation prompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('installBtn').style.display = 'block';
});

// Audio events
audio.addEventListener('ended', nextSong);
audio.addEventListener('timeupdate', () => {
    const progress = document.getElementById('progress');
    if (audio.duration) {
        progress.style.width = (audio.currentTime / audio.duration * 100) + '%';
    }
});

// ========================================
// INITIALIZATION
// ========================================

// Load reminders when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadReminders();

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    // Start reminder checker
    startReminderChecker();

    // Hide install button if not supported
    if (!window.matchMedia('(display-mode: standalone)').matches) {
        document.getElementById('installBtn').style.display = 'inline-block';
    }
});
