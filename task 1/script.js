// Data for the music player using public domain / creative commons audio
// To add YOUR OWN local songs: 
// 1. Put your '.mp3' file in this same folder.
// 2. Add an entry below with src: "your-file-name.mp3".
// 3. (Optional) add an image to the folder and put cover: "your-image.jpg".

const songs = [
    {
        title: "Neon Pulse",
        artist: "CyberSynth",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        cover: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop",
        duration: "06:12"
    },
    {
        title: "Deep Blue Horizon",
        artist: "Electro Dreams",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        cover: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&auto=format&fit=crop",
        duration: "07:05"
    },
    {
        title: "Velocity",
        artist: "The Midnight Hackers",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop",
        duration: "05:44"
    },
    {
        title: "Cosmic Odyssey",
        artist: "Galaxy Riders",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        cover: "https://images.unsplash.com/photo-1614050212727-4638acb34cae?q=80&w=2000&auto=format&fit=crop", // Glowing cubes geometry
        duration: "05:02"
    },
    {
        title: "Night Drive",
        artist: "Synthwave Express",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        cover: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=2000&auto=format&fit=crop", // Neon car tunnel
        duration: "05:53"
    }
];

let songIndex = 0;
let isPlaying = false;

const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const coverEl = document.getElementById('cover');
const progressSlider = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const playlistEl = document.getElementById('playlist');

function init() {
    renderPlaylist();
    loadSong(songs[songIndex]);
    audio.volume = volumeSlider.value / 100;
}

function loadSong(song) {
    titleEl.innerText = song.title;
    artistEl.innerText = song.artist;
    coverEl.src = song.cover;
    audio.src = song.src;
    
    progressSlider.value = 0;
    
    updatePlaylistHighlight();
}

function playSong() {
    isPlaying = true;
    audio.play().catch(e => console.log("Audio play failed:", e));
    playBtn.querySelector('.play-icon').style.display = 'none';
    playBtn.querySelector('.pause-icon').style.display = 'block';
    coverEl.classList.add('playing');
}

function pauseSong() {
    isPlaying = false;
    audio.pause();
    playBtn.querySelector('.play-icon').style.display = 'block';
    playBtn.querySelector('.pause-icon').style.display = 'none';
    coverEl.classList.remove('playing');
}

function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    if (isPlaying) playSong();
}

function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    if (isPlaying) playSong();
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    
    if (isNaN(duration)) return;

    currentTimeEl.innerText = formatTime(currentTime);
    durationEl.innerText = formatTime(duration);
    
    const progressPercent = (currentTime / duration) * 100;
    progressSlider.value = progressPercent;
    
    const val = progressSlider.value;
    progressSlider.style.background = `linear-gradient(to right, var(--neon-blue) ${val}%, rgba(255, 255, 255, 0.1) ${val}%)`;
}

function setProgress(e) {
    const value = e.target.value;
    const duration = audio.duration;
    if (!isNaN(duration)) {
        audio.currentTime = (value / 100) * duration;
    }
}

function setVolume(e) {
    audio.volume = e.target.value / 100;
    const val = e.target.value;
    volumeSlider.style.background = `linear-gradient(to right, var(--neon-blue) ${val}%, rgba(255, 255, 255, 0.1) ${val}%)`;
}

audio.addEventListener('loadedmetadata', () => {
    durationEl.innerText = formatTime(audio.duration);
});

function renderPlaylist() {
    playlistEl.innerHTML = '';
    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.classList.add('playlist-item');
        if (index === songIndex) {
            item.classList.add('active');
        }
        
        item.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <div class="playlist-item-info">
                <div class="playlist-item-title">${song.title}</div>
                <div class="playlist-item-artist">${song.artist}</div>
            </div>
            <div class="playlist-item-duration">${song.duration}</div>
        `;
        
        item.addEventListener('click', () => {
            songIndex = index;
            loadSong(songs[songIndex]);
            playSong();
        });
        
        playlistEl.appendChild(item);
    });
}

function updatePlaylistHighlight() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === songIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong);

progressSlider.addEventListener('input', setProgress);
volumeSlider.addEventListener('input', setVolume);

init();

volumeSlider.style.background = `linear-gradient(to right, var(--neon-blue) ${volumeSlider.value}%, rgba(255, 255, 255, 0.1) ${volumeSlider.value}%)`;
