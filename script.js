// ====================================================================
// A. VARIABLES GLOBALES (Configuración, Temas, Contexto)
// ====================================================================

const mainColorProperty = '--main-color';

// Estructura de tema optimizada (Colores Sólidos/Mate)
// ... (Toda la variable 'themes' se mantiene igual que antes) ...
const themes = {
    // --- TEMAS OSCUROS ---
    'theme-blue': { 
        '--main-color': '#3e9dff', 
        'body-background': '#0c1a30', // Fondo sólido
        '--card-bg-color': '#1a2940', // Color de tarjeta sólido
        '--card-text-color': '#ffffff',
        '--card-text-secondary-color': '#a0b0c0',
        '--border-color': '#3e9dff' // Borde usa color principal
    },
    'theme-red': { 
        '--main-color': '#ff3e3e', 
        'body-background': '#300c0c',
        '--card-bg-color': '#401a1a',
        '--card-text-color': '#ffffff',
        '--card-text-secondary-color': '#c0a0a0',
        '--border-color': '#ff3e3e'
    },
    'theme-purple': { 
        '--main-color': '#ff3ef2', 
        'body-background': '#300c2e',
        '--card-bg-color': '#401a3e',
        '--card-text-color': '#ffffff',
        '--card-text-secondary-color': '#c0a0be',
        '--border-color': '#ff3ef2'
    },
    'theme-green': { 
        '--main-color': '#3eff75', 
        'body-background': '#0c3015',
        '--card-bg-color': '#1a4023',
        '--card-text-color': '#ffffff',
        '--card-text-secondary-color': '#a0c0a8',
        '--border-color': '#3eff75'
    },
    'theme-orange': { 
        '--main-color': '#ff8c3e', 
        'body-background': '#301a0c',
        '--card-bg-color': '#40291a',
        '--card-text-color': '#ffffff',
        '--card-text-secondary-color': '#c0b1a0',
        '--border-color': '#ff8c3e'
    },
    'theme-cyan': { 
        '--main-color': '#3efff2', 
        'body-background': '#0c302e',
        '--card-bg-color': '#1a403e',
        '--card-text-color': '#ffffff',
        '--card-text-secondary-color': '#a0c0be',
        '--border-color': '#3efff2'
    },
    'theme-gold': { 
        '--main-color': '#ffd700', 
        'body-background': '#30280c',
        '--card-bg-color': '#403a1a',
        '--card-text-color': '#ffffff',
        '--card-text-secondary-color': '#c0bda0',
        '--border-color': '#ffd700'
    },
    'theme-magenta': { 
        '--main-color': '#c03eff', 
        'body-background': '#260c30',
        '--card-bg-color': '#351a40',
        '--card-text-color': '#ffffff',
        '--card-text-secondary-color': '#b4a0c0',
        '--border-color': '#c03eff'
    },

    // --- TEMAS MINIMALISTAS (Claro y Oscuro) ---
    'theme-light': { 
        '--main-color': '#ff6f61', 
        'body-background': '#DEE4E7', // Fondo claro
        '--card-bg-color': '#FFFFFF', // Tarjeta blanca
        '--card-text-color': '#121212', // Texto oscuro
        '--card-text-secondary-color': '#505050',
        '--border-color': '#D0D0D0' // Borde gris claro
    },
    'theme-dark': { 
        '--main-color': '#00aaff', 
        'body-background': '#121212', // Fondo negro
        '--card-bg-color': '#1e1e1e', // Tarjeta gris oscuro
        '--card-text-color': '#ffffff',
        '--card-text-secondary-color': '#aaaaaa',
        '--border-color': '#333333'
    }
};

let playlist = [];
let currentTrackIndex = -1;
let audioContext;
let analyser;

// Variables del DOM
let audioPlayer, fileInput, playPauseBtn, playIcon, prevBtn, nextBtn, progressLine, progressBarContainer, 
    currentTimeDisplay, totalTimeDisplay, songTitle, artistName, albumArtContainer, albumIcon, 
    playlistList, playerCard, root, themeOptionsContainer, sensitivitySlider, sensitivityMultiplier;

let skipBackBtn, skipForwardBtn; 
let repeatBtn, repeatIcon;
let repeatMode = 'none';

let progressStylePanel, progressStyleOptions; 
let progressStyle; 

const NUM_BARS = 64;
let dynamicBars = [];
let visualizerBarContainer;

let headerTime, headerBattery, batteryLevelSpan, batteryIconSpan, headerSongTitle;

let foldersPanel, foldersList;
let folderPlaylist = []; 

// VARS PARA LETRAS
let lyricsPanel, lyricsList;
let lrcMap = new Map(); // Mapa para almacenar archivos .lrc por nombre base
let currentLyrics = []; // Array de {time, text} de la canción actual
let currentLyricIndex = -1;

// VARS PARA NUEVAS OPCIONES (AÑADIDO)
let lyricsAlignOptions, lyricsFontSelect, lyricsEffectSelect;


// ====================================================================
// B. FUNCIONES DE UI Y TEMAS
// ====================================================================

function updatePlaylistUI() {
    // ... (Función sin cambios) ...
    if (!playlistList) return; 
    
    playlistList.innerHTML = '';
    
    if (playlist.length === 0) {
        playlistList.innerHTML = '<li class="empty-message">Carga archivos para ver la lista.</li>';
        return;
    }

    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${track.name}`;
        li.dataset.index = index; 

        if (index === currentTrackIndex) {
            li.classList.add('current-track');
            setTimeout(() => li.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
        }

        playlistList.appendChild(li);
    });
}

function applyThemeVariables(theme, themeName) {
    // ... (Función sin cambios) ...
    if (!root) return; 
    
    root.style.setProperty('--main-color', theme['--main-color']);
    root.style.setProperty('--body-bg', theme['body-background']);
    root.style.setProperty('--card-bg-color', theme['--card-bg-color']);
    root.style.setProperty('--card-text-color', theme['--card-text-color']);
    root.style.setProperty('--card-text-secondary-color', theme['--card-text-secondary-color']);
    root.style.setProperty('--border-color', theme['--border-color']);

    if (themeName) {
        localStorage.setItem('userTheme', themeName);
    }
    
    updatePlaylistUI(); 
}

function applyProgressStyle(styleName, save = true) {
    // ... (Función sin cambios) ...
    if (!progressLine || !visualizerBarContainer) return;

    progressStyle = styleName;
    
    progressLine.setAttribute('data-style', styleName); 
    
    if (styleName === 'bars') {
        visualizerBarContainer.style.opacity = '1';
        visualizerBarContainer.style.visibility = 'visible';
        progressLine.style.opacity = '0'; 
    } else {
        visualizerBarContainer.style.opacity = '0';
        visualizerBarContainer.style.visibility = 'hidden';
        progressLine.style.opacity = '1'; 
        progressLine.style.height = '100%'; 
        
        if (progressLine.style.transform === 'none') {
            progressLine.style.transform = `scaleY(1)`; 
        }
    }
    
    document.querySelectorAll('#progress-style-options .style-swatch').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.style === styleName) {
            btn.classList.add('active');
        }
    });

    if (save) {
        localStorage.setItem('userProgressStyle', styleName);
    }
}

/**
 * Aplica la alineación de texto al panel de letras.
 */
function applyLyricAlignment(alignName, save = true) {
    // ... (Función sin cambios) ...
    if (!lyricsList) return;

    // Quitar clases anteriores
    lyricsList.classList.remove('align-left', 'align-center', 'align-right');
    
    // Añadir clase nueva
    if (alignName === 'left') {
        lyricsList.classList.add('align-left');
    } else if (alignName === 'right') {
        lyricsList.classList.add('align-right');
    } else {
        lyricsList.classList.add('align-center'); // Default
    }

    // Actualizar botones
    if (lyricsAlignOptions) {
        lyricsAlignOptions.querySelectorAll('.style-swatch').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.align === alignName) {
                btn.classList.add('active');
            }
        });
    }

    // Guardar en localStorage
    if (save) {
        localStorage.setItem('userLyricAlign', alignName);
    }
}

// ===== INICIO DE FUNCIONES AÑADIDAS =====

/**
 * Aplica la fuente de texto al panel de letras.
 */
function applyLyricFont(fontFamily, save = true) {
    if (!root) return; // Usamos root (html) para setear la variable CSS
    
    // Setea la variable CSS que .lyrics-list li usa
    root.style.setProperty('--lyrics-font-family', fontFamily);

    if (save) {
        localStorage.setItem('userLyricFont', fontFamily);
    }
}

/**
 * Aplica el efecto de transición al panel de letras.
 */
function applyLyricEffect(effectName, save = true) {
    if (!lyricsList) return;
    
    // Setea el data-attribute en la lista
    lyricsList.dataset.effect = effectName;

    if (save) {
        localStorage.setItem('userLyricEffect', effectName);
    }
}
// ===== FIN DE FUNCIONES AÑADIDAS =====


// ===================================
// FUNCIONES PARA LA BARRA DE ESTADO (HEADER)
// ===================================

function updateTime() {
    // ... (Función sin cambios) ...
    if (!headerTime) return;
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    headerTime.textContent = `${hours}:${minutes} ${ampm}`;
}

function getBatteryStatus() {
    // ... (Función sin cambios) ...
    if (!batteryLevelSpan || !batteryIconSpan) return;
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            function updateBatteryInfo() {
                const level = Math.round(battery.level * 100);
                batteryLevelSpan.textContent = `${level}%`;
                let iconName;
                if (battery.charging) {
                    if (level > 90) iconName = 'battery_charging_full';
                    else if (level > 50) iconName = 'battery_charging_80';
                    else if (level > 20) iconName = 'battery_charging_30';
                    else iconName = 'battery_charging_20';
                } else {
                    if (level === 100) iconName = 'battery_full';
                    else if (level > 90) iconName = 'battery_6_bar';
                    else if (level > 80) iconName = 'battery_5_bar';
                    else if (level > 60) iconName = 'battery_4_bar';
                    else if (level > 40) iconName = 'battery_3_bar';
                    else if (level > 20) iconName = 'battery_2_bar';
                    else if (level > 5) iconName = 'battery_1_bar';
                    else iconName = 'battery_0_bar';
                }
                batteryIconSpan.textContent = iconName;
                if (headerBattery) {
                    if (level < 20 && !battery.charging) {
                        headerBattery.style.color = '#ff6f61';
                    } else {
                        headerBattery.style.color = '';
                    }
                }
            }
            updateBatteryInfo();
            battery.addEventListener('levelchange', updateBatteryInfo);
            battery.addEventListener('chargingchange', updateBatteryInfo);
        });
    } else {
        batteryLevelSpan.textContent = 'N/A';
        batteryIconSpan.textContent = 'power_off';
    }
}


// ===================================
// C. FUNCIONES DE LETRAS (NUEVO)
// ===================================

/**
 * Analiza el contenido de un archivo .lrc y devuelve un array de objetos de letra.
 */
function parseLRC(lrcContent) {
    const lines = lrcContent.split('\n');
    const lyrics = [];
    const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;

    lines.forEach(line => {
        const match = line.match(timeRegex);
        if (match) {
            const min = parseInt(match[1], 10);
            const sec = parseInt(match[2], 10);
            // Asegura que los milisegundos sean 3 dígitos (ej. .50 -> 500ms)
            const ms = parseInt(match[3].padEnd(3, '0'), 10);
            const time = min * 60 + sec + ms / 1000;
            const text = match[4].trim();

            // Solo añade si hay texto (ignora timestamps vacíos)
            if (text) {
                lyrics.push({ time, text });
            }
        }
    });

    // Ordena por tiempo, aunque LRC ya suele estarlo
    return lyrics.sort((a, b) => a.time - b.time);
}

/**
 * Muestra las letras en el panel.
 */
function displayLyrics(lyrics) {
    if (!lyricsList) return;
    lyricsList.innerHTML = '';
    currentLyricIndex = -1;

    if (!lyrics || lyrics.length === 0) {
        lyricsList.innerHTML = '<li class="empty-message">No hay letra disponible.</li>';
        return;
    }

    lyrics.forEach((line, index) => {
        const li = document.createElement('li');
        li.textContent = line.text;
        li.dataset.index = index;
        lyricsList.appendChild(li);
    });
}

/**
 * Carga un archivo .lrc (File object) y lo procesa.
 */
function loadLyrics(lrcFile) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        currentLyrics = parseLRC(content);
        displayLyrics(currentLyrics);
    };
    reader.readAsText(lrcFile);
}


// ===================================
// D. FUNCIONES DEL REPRODUCTOR Y VISUALIZADOR
// ===================================
function loadTrack(index, autoPlay = false) {
    if (index >= 0 && index < playlist.length && audioPlayer) {
        
        // RESETEAR LETRAS (NUEVO)
        currentLyrics = [];
        displayLyrics(null);
        
        currentTrackIndex = index;
        const track = playlist[currentTrackIndex];
        
        let albumArtUrl = 'https://via.placeholder.com/512x512.png?text=M+Icon'; 

        if (audioPlayer.src && audioPlayer.src.startsWith('blob:')) {
             URL.revokeObjectURL(audioPlayer.src);
        }
        
        const objectURL = URL.createObjectURL(track);
        audioPlayer.src = objectURL;
        
        songTitle.textContent = 'Cargando metadatos...';
        artistName.textContent = '';
        if (headerSongTitle) headerSongTitle.textContent = 'Cargando...'; 
        albumArtContainer.style.backgroundImage = 'none';
        albumIcon.style.display = 'block';

        // CARGAR LETRAS (NUEVO)
        // Obtener nombre base (ej. "Mi Cancion")
        const baseName = track.name.replace(/\.[^/.]+$/, "");
        const lrcFile = lrcMap.get(baseName); // Buscar en el mapa
        
        if (lrcFile) {
            loadLyrics(lrcFile);
        }

        // ... (resto de la función de jsmediatags sin cambios) ...
        if (window.jsmediatags) {
            window.jsmediatags.read(track, {
                onSuccess: function(tag) {
                    const tags = tag.tags;
                    const title = tags.title || track.name.replace(/\.[^/.]+$/, "");
                    const artist = tags.artist || 'Artista Desconocido';
                    songTitle.textContent = title;
                    artistName.textContent = artist;
                    if (headerSongTitle) headerSongTitle.textContent = title; 
                    if (tags.picture) {
                        const picture = tags.picture;
                        let base64String = btoa(picture.data.map(c => String.fromCharCode(c)).join(''));
                        const format = picture.format || 'image/png';
                        const dataUrl = `url(data:${format};base64,${base64String})`;
                        albumArtContainer.style.backgroundImage = dataUrl;
                        albumIcon.style.display = 'none';
                        albumArtUrl = `data:${format};base64,${base64String}`;
                    } else {
                        albumIcon.style.display = 'block';
                    }
                    updateMediaSession(title, artist, albumArtUrl);
                },
                onError: function(error) {
                    const title = track.name.replace(/\.[^/.]+$/, "");
                    const artist = 'Artista Desconocido (Metadata no encontrada)';
                    songTitle.textContent = title;
                    artistName.textContent = artist;
                    if (headerSongTitle) headerSongTitle.textContent = title; 
                    albumIcon.style.display = 'block';
                    updateMediaSession(title, artist, albumArtUrl);
                }
            });
        } else {
            const title = track.name.replace(/\.[^/.]+$/, "");
            songTitle.textContent = title;
            artistName.textContent = 'Librería ID3 no cargada';
            if (headerSongTitle) headerSongTitle.textContent = title; 
            updateMediaSession(title, 'Librería ID3 no cargada', albumArtUrl);
        }

        updatePlaylistUI();

        function tryPlayOnce() {
            if (autoPlay) {
                audioPlayer.play().catch(e => {
                    playIcon.textContent = 'play_arrow';
                });
            }
            audioPlayer.removeEventListener('canplaythrough', tryPlayOnce);
        }

        audioPlayer.addEventListener('canplaythrough', tryPlayOnce);
        audioPlayer.load();
        
        if (repeatMode === 'one') {
            audioPlayer.loop = true;
        } else {
            audioPlayer.loop = false;
        }
    }
}

function formatTime(seconds) {
    // ... (Función sin cambios) ...
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function initAudioContext() {
    // ... (Función sin cambios) ...
    if (audioContext && audioContext.state === 'running') return;
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaElementSource(audioPlayer); 
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            analyser.fftSize = 256;
            analyser.minDecibels = -90;
            analyser.maxDecibels = -20;
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    } catch (e) {
        console.error('Web Audio API no compatible o falló al iniciar:', e);
    }
}

const bufferLength = 128;
const dataArray = new Uint8Array(bufferLength); 

function visualize() {
    // ... (Función sin cambios) ...
    if (!analyser || audioPlayer.paused) {
        requestAnimationFrame(visualize);
        return;
    }

    analyser.getByteFrequencyData(dataArray); 
    const mainColor = getComputedStyle(root).getPropertyValue(mainColorProperty);
    const multiplier = parseFloat(getComputedStyle(root).getPropertyValue('--sensitivity-multiplier'));
    
    let scaleY;

    switch (progressStyle) {
        case 'bars':
            if (dynamicBars.length === 0) {
                createDynamicBars(); 
            }
            if (visualizerBarContainer && visualizerBarContainer.style.opacity === '0') break; 

            dynamicBars.forEach((bar, i) => {
                const freqValue = dataArray[i]; 
                
                let sensitivity;
                if (i < NUM_BARS * 0.15) { sensitivity = 1.5; }
                else if (i < NUM_BARS * 0.45) { sensitivity = 1.2; }
                else { sensitivity = 0.9; } 
                
                const normalizedVolume = Math.pow(Math.min(freqValue / 255, 1), 0.7) * sensitivity;
                const scaleY = 0.5 + normalizedVolume * 12 * multiplier;
                
                bar.style.transform = `scaleY(${scaleY})`;
            });

            progressLine.style.transform = 'none';
            break;
            
        case 'spark':
            const avgVolumeSpark = dataArray.slice(0, bufferLength * 0.8).reduce((a, b) => a + b, 0) / (bufferLength * 0.8);
            const effectIntensitySpark = Math.min(avgVolumeSpark / 150, 1) * multiplier;
            scaleY = 1 + effectIntensitySpark * 0.5;
            progressLine.style.transformOrigin = 'center';
            progressLine.style.transform = `scaleY(${scaleY})`;
            break;

        case 'line':
        default:
            const avgVolumeLine = dataArray.slice(0, bufferLength * 0.8).reduce((a, b) => a + b, 0) / (bufferLength * 0.8);
            const effectIntensityLine = Math.min(avgVolumeLine / 150, 1) * multiplier;
            scaleY = 1 + effectIntensityLine * 0.2;
            progressLine.style.transformOrigin = 'center';
            progressLine.style.transform = `scaleY(${scaleY})`;
            break;
    }
    requestAnimationFrame(visualize);
}

function createDynamicBars() {
    // ... (Función sin cambios) ...
    if (!progressBarContainer) return;

    visualizerBarContainer = document.getElementById('visualizer-bar-container');
    if (!visualizerBarContainer) {
        visualizerBarContainer = document.createElement('div');
        visualizerBarContainer.id = 'visualizer-bar-container';
        visualizerBarContainer.style.cssText = `
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
            display: flex; justify-content: space-between; align-items: flex-end;
            padding: 0; z-index: 2; opacity: 0; visibility: hidden; 
            transition: opacity 0.3s ease-in-out, visibility 0.3s linear; 
        `;
        progressBarContainer.prepend(visualizerBarContainer); 
    }
    
    visualizerBarContainer.innerHTML = '';
    dynamicBars = [];

    const BAR_WIDTH_PERCENT = (100 / NUM_BARS) * 0.9; 
    
    for (let i = 0; i < NUM_BARS; i++) {
        const bar = document.createElement('div');
        bar.classList.add('dyn-bar');
        bar.style.width = `${BAR_WIDTH_PERCENT}%`; 
        bar.style.minWidth = '0.1px';
        bar.style.height = '100%';
        bar.style.backgroundColor = 'var(--main-color)';
        bar.style.transformOrigin = 'bottom';
        bar.style.transition = 'transform 0.04s ease-out';
        visualizerBarContainer.appendChild(bar);
        dynamicBars.push(bar);
    }
    
    if(progressLine) progressLine.innerHTML = '';
}

// ===================================
// E. FUNCIONES DE REPETICIÓN
// ===================================
function toggleRepeatMode() {
    // ... (Función sin cambios) ...
    if (!repeatIcon || !audioPlayer) return;
    if (repeatMode === 'none') {
        repeatMode = 'one';
        repeatIcon.textContent = 'repeat_one'; 
        repeatIcon.style.color = 'var(--main-color)'; 
        audioPlayer.loop = true;
    } else if (repeatMode === 'one') {
        repeatMode = 'all';
        repeatIcon.textContent = 'repeat'; 
        repeatIcon.style.color = 'var(--main-color)';
        audioPlayer.loop = false;
    } else { 
        repeatMode = 'none';
        repeatIcon.textContent = 'repeat'; 
        repeatIcon.style.color = 'var(--card-text-color)'; 
        audioPlayer.loop = false;
    }
    localStorage.setItem('repeatMode', repeatMode);
}

function loadRepeatMode() {
    // ... (Función sin cambios) ...
    const savedMode = localStorage.getItem('repeatMode');
    if (savedMode && ['none', 'one', 'all'].includes(savedMode)) {
        repeatMode = savedMode;
    }
    if (repeatIcon && audioPlayer) {
        if (repeatMode === 'one') {
            repeatIcon.textContent = 'repeat_one';
            repeatIcon.style.color = 'var(--main-color)';
            audioPlayer.loop = true;
        } else if (repeatMode === 'all') {
            repeatIcon.textContent = 'repeat';
            repeatIcon.style.color = 'var(--main-color)';
            audioPlayer.loop = false;
        } else { // 'none'
            repeatIcon.textContent = 'repeat';
            repeatIcon.style.color = 'var(--card-text-color)';
            audioPlayer.loop = false;
        }
    }
}

// ===================================
// F. FUNCIONES DE EXPLORADOR DE CARPETAS (ACTUALIZADO)
// ===================================
function isAudioFile(fileName) {
    const audioExtensions = ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.aac'];
    const lowerName = fileName.toLowerCase();
    return audioExtensions.some(ext => lowerName.endsWith(ext));
}

function createFolderEntryUI(name, parentElement) {
    // ... (Función sin cambios) ...
    const li = document.createElement('li');
    li.classList.add('folder-item', 'collapsed'); 
    li.innerHTML = `<span class="material-icons file-icon">folder</span> ${name}`;
    li.style.cursor = 'pointer';
    li.title = `Abrir/Cerrar: ${name}`;
    const ul = document.createElement('ul');
    li.appendChild(ul);
    parentElement.appendChild(li);
    return ul;
}

function createAudioEntryUI(file, parentElement) {
    // ... (Función sin cambios) ...
    const fileIndex = folderPlaylist.length;
    folderPlaylist.push(file);
    const li = document.createElement('li');
    li.classList.add('audio-item');
    li.dataset.folderIndex = fileIndex;
    li.innerHTML = `<span class="material-icons file-icon">audio_file</span> ${file.name}`;
    li.title = `Reproducir: ${file.name}`;
    li.style.cursor = 'pointer';
    parentElement.appendChild(li);
}

/**
 * ACTUALIZADO: Ahora también busca .lrc y los añade al lrcMap
 */
async function processDirectoryEntry(entry, parentElement) {
    if (entry.isFile) {
        if (isAudioFile(entry.name)) {
            entry.file(file => {
                createAudioEntryUI(file, parentElement);
            }, err => {
                console.error('Error al leer el archivo:', err);
            });
        } 
        // NUEVO: Detectar archivos .lrc
        else if (entry.name.toLowerCase().endsWith('.lrc')) {
            entry.file(file => {
                const baseName = file.name.replace(/\.lrc$/i, "");
                lrcMap.set(baseName, file);
            }, err => {
                console.error('Error al leer el archivo .lrc:', err);
            });
        }
    } else if (entry.isDirectory) {
        const folderName = entry.name;
        const newParentUI = createFolderEntryUI(folderName, parentElement);
        const reader = entry.createReader();
        try {
            let entries = [];
            let readEntries = await new Promise((resolve, reject) => {
                reader.readEntries(resolve, reject);
            });
            while (readEntries.length > 0) {
                entries = entries.concat(readEntries);
                readEntries = await new Promise((resolve, reject) => {
                    reader.readEntries(resolve, reject);
                });
            }
            // Procesa recursivamente (esto encontrará audio y lrc en subcarpetas)
            for (const subEntry of entries) {
                await processDirectoryEntry(subEntry, newParentUI); 
            }
        } catch (err) {
            console.error('Error al leer el directorio:', err);
        }
    }
}

// ====================================================================
// G. MEDIA SESSION API
// ====================================================================
function updateMediaSession(title, artist, albumArtUrl) {
    // ... (Función sin cambios) ...
    if ('mediaSession' in navigator) {
        const formatMatch = albumArtUrl.match(/^data:(image\/\w+);base64/);
        const imageType = formatMatch ? formatMatch[1] : 'image/png';
        navigator.mediaSession.metadata = new MediaMetadata({
            title: title || 'Título Desconocido',
            artist: artist || 'Artista Desconocido',
            album: 'Tu Reproductor Web', 
            artwork: [
                { src: albumArtUrl, sizes: '512x512', type: imageType }
            ]
        });
    }
}

function setupMediaSessionHandlers() {
    // ... (Función sin cambios) ...
    if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', () => {
            if (audioPlayer.paused) {
                audioPlayer.play().catch(e => console.error("Error al reanudar:", e)); 
            }
        });
        navigator.mediaSession.setActionHandler('pause', () => {
            if (!audioPlayer.paused) {
                audioPlayer.pause();
            }
        });
        navigator.mediaSession.setActionHandler('nexttrack', () => {
            if (playlist.length > 0) {
                let nextIndex = (currentTrackIndex + 1) % playlist.length;
                loadTrack(nextIndex, true);
            }
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => {
            if (playlist.length > 0) {
                let prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
                loadTrack(prevIndex, true);
            }
        });
        navigator.mediaSession.setActionHandler('seekbackward', (details) => {
            const seekOffset = details.seekOffset || 10; 
            audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - seekOffset);
        });
        navigator.mediaSession.setActionHandler('seekforward', (details) => {
            const seekOffset = details.seekOffset || 10; 
            audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + seekOffset);
        });
        navigator.mediaSession.setActionHandler('stop', () => {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        });
    }
}


// ====================================================================
// H. INICIALIZACIÓN (ACTUALIZADO)
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. ASIGNACIONES DE DOM (ACTUALIZADO)
    audioPlayer = document.getElementById('audio-player');
    fileInput = document.getElementById('file-input');
    playPauseBtn = document.getElementById('play-pause-btn');
    playIcon = playPauseBtn ? playPauseBtn.querySelector('.material-icons') : null;
    prevBtn = document.getElementById('prev-btn');
    nextBtn = document.getElementById('next-btn');
    skipBackBtn = document.getElementById('skip-back-btn');
    skipForwardBtn = document.getElementById('skip-forward-btn');
    repeatBtn = document.getElementById('repeat-btn');
    repeatIcon = repeatBtn ? repeatBtn.querySelector('#repeat-icon') : null;
    
    progressLine = document.getElementById('progress-line');
    progressBarContainer = document.getElementById('progress-bar');
    currentTimeDisplay = document.getElementById('current-time');
    totalTimeDisplay = document.getElementById('total-time');
    songTitle = document.querySelector('.song-title');
    artistName = document.querySelector('.artist-name');
    albumArtContainer = document.getElementById('album-art-container');
    albumIcon = document.getElementById('album-icon');
    playlistList = document.getElementById('playlist-list');
    playerCard = document.querySelector('.player-card');
    root = document.documentElement;
    themeOptionsContainer = document.getElementById('theme-options');
    sensitivitySlider = document.getElementById('sensitivity-slider');

    progressStylePanel = document.getElementById('progress-style-panel');
    progressStyleOptions = document.getElementById('progress-style-options');
    
    headerTime = document.getElementById('header-time');
    headerBattery = document.getElementById('header-battery');
    batteryLevelSpan = document.getElementById('battery-level');
    batteryIconSpan = document.getElementById('battery-icon');
    headerSongTitle = document.getElementById('header-song-title');

    // Asignación de panel de letras
    lyricsPanel = document.querySelector('.lyrics-panel');
    lyricsList = document.getElementById('lyrics-list');
    
    // Asignaciones NUEVAS (AÑADIDO)
    lyricsAlignOptions = document.getElementById('lyrics-align-options');
    lyricsFontSelect = document.getElementById('lyrics-font-select');
    lyricsEffectSelect = document.getElementById('lyrics-effect-select');

    // ACTUALIZADO: Añadir .lyrics-panel al selector de tarjetas
    const cards = document.querySelectorAll('.player-card, .playlist-panel, .color-selector, .lyrics-panel');
    const mainContainer = document.querySelector('.main-container');

    foldersPanel = document.querySelector('.folders-panel');
    foldersList = document.getElementById('folders-list');

    sensitivityMultiplier = parseFloat(getComputedStyle(root).getPropertyValue('--sensitivity-multiplier'));

    createDynamicBars(); 
    setupMediaSessionHandlers();
    loadRepeatMode();

    // 2. CARGAR Y APLICAR ESTADOS GUARDADOS
    
    // 2.1 Cargar Tema
    const savedThemeName = localStorage.getItem('userTheme');
    let initialThemeName = savedThemeName && themes[savedThemeName] ? savedThemeName : 'theme-dark';
    let initialTheme = themes[initialThemeName];
    applyThemeVariables(initialTheme, initialThemeName);
    
    document.querySelectorAll('.color-swatch').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === initialThemeName) {
            btn.classList.add('active');
        }
    });
    
    // 2.3 Cargar Sensibilidad
    const savedSensitivity = localStorage.getItem('userSensitivity');
    if (savedSensitivity !== null) {
        sensitivityMultiplier = parseFloat(savedSensitivity);
        sensitivitySlider.value = sensitivityMultiplier * 100;
        root.style.setProperty('--sensitivity-multiplier', sensitivityMultiplier);
    } else {
        sensitivitySlider.value = sensitivityMultiplier * 100;
        root.style.setProperty('--sensitivity-multiplier', sensitivityMultiplier);
    }
    
    // 2.4 Cargar Estilo de Progreso
    const savedProgressStyle = localStorage.getItem('userProgressStyle');
    progressStyle = savedProgressStyle && ['line', 'spark', 'bars'].includes(savedProgressStyle) ? savedProgressStyle : 'line';
    applyProgressStyle(progressStyle, false); 
    
    // 2.5 Cargar Alineación de Letras
    const savedLyricAlign = localStorage.getItem('userLyricAlign') || 'center'; // Default a 'center'
    applyLyricAlignment(savedLyricAlign, false); // Cargar sin guardar
    
    // 2.6 Cargar Fuente de Letras (AÑADIDO)
    const savedLyricFont = localStorage.getItem('userLyricFont') || "'Roboto', sans-serif"; // Default
    applyLyricFont(savedLyricFont, false);
    if (lyricsFontSelect) lyricsFontSelect.value = savedLyricFont;

    // 2.7 Cargar Efecto de Letras (AÑADIDO)
    const savedLyricEffect = localStorage.getItem('userLyricEffect') || 'highlight'; // Default
    applyLyricEffect(savedLyricEffect, false);
    if (lyricsEffectSelect) lyricsEffectSelect.value = savedLyricEffect;
    

    // 3. LISTENERS
    
    // Header
    updateTime();
    setInterval(updateTime, 1000); 
    getBatteryStatus();
    
    // Explorador de Carpetas (ACTUALIZADO)
    if (foldersPanel && foldersList) {
        if (foldersList.innerHTML === '') {
            foldersList.innerHTML = '<li class="empty-message">Arrastra una carpeta aquí para explorarla.</li>';
        }
        foldersPanel.addEventListener('dragover', (e) => {
            e.preventDefault(); e.stopPropagation();
            foldersPanel.classList.add('drag-active');
        });
        foldersPanel.addEventListener('dragleave', (e) => {
            e.preventDefault(); e.stopPropagation();
            foldersPanel.classList.remove('drag-active');
        });
        // ACTUALIZADO: Limpiar lrcMap al soltar
        foldersPanel.addEventListener('drop', (e) => {
            e.preventDefault(); e.stopPropagation();
            foldersPanel.classList.remove('drag-active');
            const items = e.dataTransfer.items;
            if (items && items.length > 0) {
                foldersList.innerHTML = '';
                folderPlaylist = [];
                lrcMap.clear(); // Limpiar mapa de letras
                for (let i = 0; i < items.length; i++) {
                    const entry = items[i].webkitGetAsEntry();
                    if (entry) {
                        processDirectoryEntry(entry, foldersList);
                    }
                }
            }
        });
        foldersList.addEventListener('click', (event) => {
            const targetLi = event.target.closest('li');
            if (!targetLi) return; 
            if (targetLi.classList.contains('audio-item') && targetLi.dataset.folderIndex !== undefined) {
                const indexToPlay = parseInt(targetLi.dataset.folderIndex, 10);
                playlist = folderPlaylist; // Usar la playlist de carpetas
                initAudioContext();
                loadTrack(indexToPlay, true);
            } else if (targetLi.classList.contains('folder-item')) {
                targetLi.classList.toggle('collapsed');
                const icon = targetLi.querySelector('.file-icon');
                if (icon) {
                    icon.textContent = targetLi.classList.contains('collapsed') ? 'folder' : 'folder_open';
                }
            }
        });
    }

    // Listener de Temas
    themeOptionsContainer.addEventListener('click', (event) => {
        // ... (Sin cambios) ...
        const target = event.target;
        if (target.classList.contains('color-swatch')) {
            const themeName = target.dataset.theme;
            const selectedTheme = themes[themeName];
            if (selectedTheme) {
                applyThemeVariables(selectedTheme, themeName);
                document.querySelectorAll('.color-swatch').forEach(btn => {
                    btn.classList.remove('active');
                });
                target.classList.add('active');
            }
        }
    });

    // Listener de Estilo de Progreso
    progressStyleOptions.addEventListener('click', (event) => {
        // ... (Sin cambios) ...
        const target = event.target.closest('.style-swatch');
        if (target) {
            const styleName = target.dataset.style;
            applyProgressStyle(styleName);
        }
    });

    // Listener de Sensibilidad
    sensitivitySlider.addEventListener('input', (event) => {
        // ... (Sin cambios) ...
        sensitivityMultiplier = event.target.value / 100;
        root.style.setProperty('--sensitivity-multiplier', sensitivityMultiplier);
        localStorage.setItem('userSensitivity', sensitivityMultiplier.toString());
    });
    
    // Listener de Alineación de Letras
    if (lyricsAlignOptions) {
        lyricsAlignOptions.addEventListener('click', (event) => {
            const target = event.target.closest('.style-swatch');
            if (target && target.dataset.align) {
                applyLyricAlignment(target.dataset.align, true);
            }
        });
    }

    // ===== INICIO DE LISTENERS AÑADIDOS =====
    // Listener de Fuente de Letras
    if (lyricsFontSelect) {
        lyricsFontSelect.addEventListener('change', (event) => {
            applyLyricFont(event.target.value, true);
        });
    }

    // Listener de Efecto de Letras
    if (lyricsEffectSelect) {
        lyricsEffectSelect.addEventListener('change', (event) => {
            applyLyricEffect(event.target.value, true);
        });
    }
    // ===== FIN DE LISTENERS AÑADIDOS =====

    // Listeners de Audio (ACTUALIZADO)
    
    // ACTUALIZADO: Manejar audio y lrc
    fileInput.addEventListener('change', (event) => {
        lrcMap.clear(); // Limpiar mapa de letras
        const files = Array.from(event.target.files);
        const audioFiles = [];
        
        files.forEach(file => {
            if (isAudioFile(file.name)) {
                audioFiles.push(file);
            } else if (file.name.toLowerCase().endsWith('.lrc')) {
                const baseName = file.name.replace(/\.lrc$/i, "");
                lrcMap.set(baseName, file);
            }
        });

        playlist = audioFiles; // Establecer playlist global
        
        if (playlist.length > 0) {
            initAudioContext();
            loadTrack(0, true);
        }
    });

    playlistList.addEventListener('click', (event) => {
        // ... (Sin cambios) ...
        const li = event.target.closest('li');
        if (li && li.dataset.index && !li.classList.contains('empty-message')) {
            const index = parseInt(li.dataset.index);
            if (index !== currentTrackIndex) {
                loadTrack(index, true);
            } else {
                audioPlayer.play().catch(() => {});
            }
        }
    });

    playPauseBtn.addEventListener('click', () => {
        // ... (Sin cambios) ...
        if (playlist.length === 0) {
            alert("Por favor, selecciona archivos de música (MP3/WAV) primero.");
            return;
        }
        if (audioPlayer.paused) {
            initAudioContext();
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    });
    
    if (repeatBtn) {
        repeatBtn.addEventListener('click', toggleRepeatMode);
    }
    
    if (skipBackBtn) {
        skipBackBtn.addEventListener('click', () => {
            if (audioPlayer) {
                audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);
            }
        });
    }

    if (skipForwardBtn) {
        skipForwardBtn.addEventListener('click', () => {
            if (audioPlayer) {
                audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 10);
            }
        });
    }

    nextBtn.addEventListener('click', () => {
        // ... (Sin cambios) ...
        if (playlist.length > 0) {
            let nextIndex = (currentTrackIndex + 1) % playlist.length;
            loadTrack(nextIndex, true);
        }
    });

    prevBtn.addEventListener('click', () => {
        // ... (Sin cambios) ...
        if (playlist.length > 0) {
            let prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
            loadTrack(prevIndex, true);
        }
    });

    // ACTUALIZADO: Añadido sincronizador de letras
    audioPlayer.addEventListener('timeupdate', () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressLine.style.width = `${progress}%`;
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);

        // NUEVO: Sincronización de Letras
        if (currentLyrics.length > 0 && lyricsList) {
            const currentTime = audioPlayer.currentTime;
            
            // Encontrar el índice de la línea actual
            let newIndex = currentLyrics.findIndex(line => line.time > currentTime) - 1;
            
            if (newIndex < 0) {
                // Si no hay ninguna línea mayor, puede ser la última línea
                if (currentTime >= currentLyrics[currentLyrics.length - 1].time) {
                    newIndex = currentLyrics.length - 1;
                } else {
                    newIndex = -1; // Antes de la primera línea
                }
            }

            if (newIndex !== currentLyricIndex) {
                currentLyricIndex = newIndex;
                
                // Quitar clase activa de la línea anterior
                const oldActive = lyricsList.querySelector('li.active');
                if (oldActive) {
                    oldActive.classList.remove('active');
                }
                
                // Añadir clase activa a la línea nueva
                if (newIndex >= 0) {
                    const newActive = lyricsList.querySelector(`li[data-index="${newIndex}"]`);
                    if (newActive) {
                        newActive.classList.add('active');
                        // Centrar la línea activa en el panel
                        newActive.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }
        }
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        // ... (Sin cambios) ...
        totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
    });

    audioPlayer.addEventListener('play', () => {
        // ... (Sin cambios) ...
        playIcon.textContent = 'pause';
        requestAnimationFrame(visualize);
    });

    audioPlayer.addEventListener('pause', () => {
        // ... (Sin cambios) ...
        playIcon.textContent = 'play_arrow';
    });
    
    audioPlayer.addEventListener('ended', () => {
        // ... (Sin cambios) ...
        if (playlist.length > 0) {
            let nextIndex = (currentTrackIndex + 1);
            if (repeatMode === 'all') {
                nextIndex %= playlist.length;
                loadTrack(nextIndex, true);
            } else { // 'none'
                if (nextIndex < playlist.length) {
                    loadTrack(nextIndex, true);
                } else {
                    audioPlayer.currentTime = 0;
                    progressLine.style.width = '0%';
                    playIcon.textContent = 'play_arrow';
                    currentTrackIndex = -1;
                    updatePlaylistUI();
                    if (headerSongTitle) headerSongTitle.textContent = 'No hay canción';
                }
            }
        } else {
            audioPlayer.currentTime = 0;
            progressLine.style.width = '0%';
            playIcon.textContent = 'play_arrow';
            if (headerSongTitle) headerSongTitle.textContent = 'No hay canción';
        }
    });
    
    progressBarContainer.addEventListener('click', (e) => {
        // ... (Sin cambios) ...
        if (audioPlayer.duration > 0) {
            const clickX = e.clientX - progressBarContainer.getBoundingClientRect().left;
            const width = progressBarContainer.clientWidth;
            const seekTime = (clickX / width) * audioPlayer.duration;
            audioPlayer.currentTime = seekTime;
        }
    });

    requestAnimationFrame(visualize);
    
    // DRAG AND DROP (ACTUALIZADO)
    let draggingCard = null;
    cards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
            draggingCard = card;
            setTimeout(() => card.classList.add('dragging'), 0);
            e.dataTransfer.effectAllowed = 'move';
        });
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            draggingCard = null;
        });
        card.addEventListener('dragenter', (e) => {
            e.preventDefault();
            if (card !== draggingCard) {
                const reference = getDragAfterElement(mainContainer, e.clientX);
                if (reference == null) {
                    mainContainer.appendChild(draggingCard);
                } else {
                    mainContainer.insertBefore(draggingCard, reference);
                }
            }
        });
        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        card.addEventListener('dragleave', () => {});
    });

    // ACTUALIZADO: Incluir .lyrics-panel en el querySelectorAll
    function getDragAfterElement(container, x) {
        const draggableCards = [...container.querySelectorAll('.player-card:not(.dragging), .playlist-panel:not(.dragging), .color-selector:not(.dragging), .lyrics-panel:not(.dragging)')];
        return draggableCards.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = x - box.left - box.width / 2; 
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});