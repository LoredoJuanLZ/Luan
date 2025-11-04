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
let audioSource; 

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
let lyricsPanel, lyricsList, lyricsPanelHeader; // <- lyricsPanelHeader AÑADIDO
let lrcMap = new Map(); // Mapa para almacenar archivos .lrc por nombre base
let currentLyrics = []; // Array de {time, text} de la canción actual
let currentLyricIndex = -1;
let lrcBadgeElement; // <- AÑADIDO: Referencia al badge "LRC"

// VARS PARA NUEVAS OPCIONES (AÑADIDO)
let lyricsAlignOptions, lyricsFontSelect, lyricsEffectSelect;

// ===== INICIO VARS BARRA LATERAL (AÑADIDO) =====
let sidebar, sidebarOpenBtn, sidebarCloseBtn, sidebarOverlay, panelToggleList;
// ===== FIN VARS BARRA LATERAL (AÑADIDO) =====

// ===== INICIO VARS TEMA DINÁMICO (AÑADIDO) =====
let dynamicThemeToggle;
let isDynamicThemeActive = true;
// ===== FIN VARS TEMA DINÁMICO (AÑADIDO) =====

// ===== INICIO VARS ECUALIZADOR (AÑADIDO) =====
let eqModal, eqOverlay, eqCloseBtn, eqOpenBtn, eqPresetsSelect, eqBandsContainer;
let eqBands = []; // Array para los nodos BiquadFilter
const EQ_FREQUENCIES = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
// ===== FIN VARS ECUALIZADOR (AÑADIDO) =====


// ====================================================================
// B. FUNCIONES DE UI Y TEMAS
// ====================================================================

// ===== INICIO FUNCIONES BARRA LATERAL (AÑADIDO) =====

/**
 * Abre la barra lateral.
 */
function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (sidebarOverlay) sidebarOverlay.classList.add('open');
}

/**
 * Cierra la barra lateral.
 */
function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('open');
}

/**
 * Aplica el estado de visibilidad a un panel.
 * @param {string} panelSelector - El selector CSS del panel.
 * @param {boolean} isVisible - True si debe ser visible, false si debe ocultarse.
 */
function setPanelVisibility(panelSelector, isVisible) {
    // Caso especial para la lista de reproducción, para no seleccionar el panel de carpetas
    let panel;
    if (panelSelector === ".playlist-panel:not(.folders-panel)") {
         panel = document.querySelector(".playlist-panel:not(.folders-panel)");
    } else {
         panel = document.querySelector(panelSelector);
    }
    
    if (panel) {
        if (isVisible) {
            panel.classList.remove('panel-hidden');
        } else {
            panel.classList.add('panel-hidden');
        }
    }
}

/**
 * Guarda el estado de visibilidad de los paneles en localStorage.
 */
function savePanelVisibility() {
    if (!panelToggleList) return;
    const visibilityState = {};
    panelToggleList.querySelectorAll('.panel-toggle').forEach(checkbox => {
        visibilityState[checkbox.id] = checkbox.checked;
    });
    localStorage.setItem('panelVisibility', JSON.stringify(visibilityState));
}

/**
 * Carga y aplica el estado de visibilidad de los paneles desde localStorage.
 */
function loadPanelVisibility() {
    if (!panelToggleList) return;
    const savedState = JSON.parse(localStorage.getItem('panelVisibility'));
    
    panelToggleList.querySelectorAll('.panel-toggle').forEach(checkbox => {
        let isChecked = true; // Default to visible
        if (savedState && savedState[checkbox.id] !== undefined) {
            isChecked = savedState[checkbox.id];
        }
        checkbox.checked = isChecked;
        const targetSelector = checkbox.dataset.target;
        setPanelVisibility(targetSelector, isChecked);
    });
}

// ===== FIN FUNCIONES BARRA LATERAL (AÑADIDO) =====

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

/**
 * MODIFICADO: El parámetro 'themeName' ahora puede ser null.
 * Si themeName es null, no guarda en localStorage (usado por tema dinámico).
 */
function applyThemeVariables(theme, themeName) {
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
// C. FUNCIONES DE LETRAS (ACTUALIZADO)
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
 * Muestra las letras SINCRONIZADAS (de LRC) en el panel.
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
 * MODIFICADO: Ahora también muestra el badge LRC.
 */
function loadLyrics(lrcFile) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        currentLyrics = parseLRC(content); // Establece las letras sincronizadas
        displayLyrics(currentLyrics);
        if (lrcBadgeElement) lrcBadgeElement.style.display = 'inline'; // <-- MOSTRAR BADGE
    };
    reader.readAsText(lrcFile);
}

// ===== INICIO: NUEVAS FUNCIONES PARA LETRAS DE INTERNET =====

/**
 * Muestra letras NO SINCRONIZADAS (de internet) en el panel.
 */
function displayUnsyncedLyrics(plainText) {
    if (!lyricsList) return;
    lyricsList.innerHTML = '';
    
    // MUY IMPORTANTE: Vaciar currentLyrics desactiva la lógica de sincronización.
    currentLyrics = []; 
    currentLyricIndex = -1;
    // Asegurarse de que el badge LRC está oculto
    if (lrcBadgeElement) lrcBadgeElement.style.display = 'none';

    const lines = plainText.split('\n');
    if (lines.length === 0 || (lines.length === 1 && lines[0] === '')) {
        lyricsList.innerHTML = '<li class="empty-message">No se pudo encontrar la letra.</li>';
        return;
    }

    lines.forEach(line => {
        const li = document.createElement('li');
        // Si la línea está vacía, pone un espacio (nbsp) para mantener el flujo visual
        li.textContent = line.trim() === '' ? '\u00A0' : line; 
        // No se añade data-index porque no hay sincronización
        lyricsList.appendChild(li);
    });
}

// ===== INICIO: LÓGICA DE BÚSQUEDA SÓLIDA (NUEVO) =====

// Regex para limpieza "Aggresiva" (Quita TODO en paréntesis/corchetes)
const allBracketsRegex = /(\[.*?\])|(\(.*?\))/g;
// Regex para limpieza "Junk" (Quita feat, official, etc.)
const junkRegex = /\s*([\[\(])(feat|ft|with|official|video|lyric|live|remix|audio|explicit|single|edition|version).*?([\]\)])/ig;

/**
 * (NUEVA LÓGICA SÓLIDA)
 * Intenta buscar la letra de la canción en una API pública.
 * Prueba múltiples combinaciones de limpieza de texto.
 */
async function fetchLyrics(artist, title, trackIndex) {
    if (!lyricsList) return;
    
    // Ocultar badge LRC al iniciar la búsqueda
    if (lrcBadgeElement) lrcBadgeElement.style.display = 'none';

    // 1. Mensaje de carga
    lyricsList.innerHTML = '<li class="empty-message">Buscando letra en internet...</li>';
    currentLyrics = []; // Desactivar sincronización
    currentLyricIndex = -1;
    
    // 2. Definir las permutaciones de búsqueda
    const baseArtist = artist.split(/[;,]/)[0].trim();
    const baseTitle = title.trim();

    const permutations = [
        // Intento 1: Tal cual (El más probable)
        { artist: baseArtist, title: baseTitle },
        
        // Intento 2: Limpieza "Junk" (Quita feat, official, etc.)
        { artist: baseArtist.replace(junkRegex, '').trim(), title: baseTitle.replace(junkRegex, '').trim() },
        
        // Intento 3: Limpieza "Aggresiva" (Quita TODO en paréntesis/corchetes)
        // Esto arreglará "Right Here (Explicit)" si la API lo tiene como "Right Here"
        { artist: baseArtist.replace(allBracketsRegex, '').trim(), title: baseTitle.replace(allBracketsRegex, '').trim() },
        
        // Intento 4: Limpieza de "Hyphen" (Quita " - Remastered", etc. del título)
        { artist: baseArtist, title: baseTitle.split(' - ')[0].trim() }
    ];

    // Deduplicar la lista de intentos.
    const uniquePermutations = new Map();
    permutations.forEach(p => {
        const key = `${p.artist}|${p.title}`;
        // Asegurarse de no tener artist/title vacíos y que no esté duplicado
        if (p.artist && p.title && !uniquePermutations.has(key)) { 
            uniquePermutations.set(key, p);
        }
    });

    // 3. Ejecutar la cadena de búsqueda
    for (const [key, perm] of uniquePermutations) {
        // (Race condition check) Si el usuario cambió de canción, detener todo.
        if (trackIndex !== currentTrackIndex) return; 

        // console.log(`Intentando buscar letra: ${perm.artist} - ${perm.title}`); // (Debug)

        try {
            const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(perm.artist)}/${encodeURIComponent(perm.title)}`);
            
            // (Race condition check)
            if (trackIndex !== currentTrackIndex) return;

            if (response.ok) {
                const data = await response.json();
                if (data.lyrics) {
                    // ¡Éxito!
                    displayUnsyncedLyrics(data.lyrics);
                    return; // Salir de la función fetchLyrics
                }
            }
            // Si !response.ok o no hay data.lyrics, el bucle continúa al siguiente intento...
        } catch (error) {
            // Error de red, el bucle continúa al siguiente intento...
            console.warn(`Intento fallido para ${key}:`, error);
        }
    }

    // 4. Si todos los intentos fallan
    // (Race condition check)
    if (trackIndex !== currentTrackIndex) return;

    console.error("Todos los intentos de búsqueda de letra fallaron.");
    lyricsList.innerHTML = '<li class="empty-message">No se pudo encontrar la letra.</li>';
}
// ===== FIN: LÓGICA DE BÚSQUEDA SÓLIDA =====


// ===================================
// D. FUNCIONES DEL REPRODUCTOR Y VISUALIZADOR
// ===================================

/**
 * MODIFICADO: Ahora también aplica el tema dinámico si está activado.
 * MODIFICADO: Ahora busca letras en internet si no hay .lrc
 */
function loadTrack(index, autoPlay = false) {
    if (index >= 0 && index < playlist.length && audioPlayer) {
        
        // RESETEAR LETRAS Y BADGE LRC
        currentLyrics = [];
        displayLyrics(null); // Limpia el panel
        if (lrcBadgeElement) lrcBadgeElement.style.display = 'none'; // <-- OCULTAR BADGE
        
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

        // BUSCAR LETRAS LOCALES (.lrc)
        // Obtener nombre base (ej. "Mi Cancion")
        const baseName = track.name.replace(/\.[^/.]+$/, "");
        const lrcFile = lrcMap.get(baseName); // Buscar en el mapa
        

        if (window.jsmediatags) {
            window.jsmediatags.read(track, {
                onSuccess: function(tag) {
                    const tags = tag.tags;
                    const title = tags.title || track.name.replace(/\.[^/.]+$/, "");
                    // AQUÍ es donde artist puede ser "Artista 1;Artista 2"
                    const artist = tags.artist || 'Artista Desconocido'; 
                    songTitle.textContent = title;
                    artistName.textContent = artist; // Mostramos el string completo
                    if (headerSongTitle) headerSongTitle.textContent = title; 
                    
                    // ===== INICIO LÓGICA DE LETRAS (MODIFICADO) =====
                    if (lrcFile) {
                        // 1. Si se encontró .lrc local, usarlo.
                        loadLyrics(lrcFile);
                    } else {
                        // 2. Si no, buscar en internet (pasando el trackIndex actual)
                        // fetchLyrics limpiará el string "artist"
                        fetchLyrics(artist, title, currentTrackIndex); 
                    }
                    // ===== FIN LÓGICA DE LETRAS =====
                    
                    if (tags.picture) {
                        const picture = tags.picture;
                        let base64String = btoa(picture.data.map(c => String.fromCharCode(c)).join(''));
                        const format = picture.format || 'image/png';
                        const dataUrl = `url(data:${format};base64,${base64String})`;
                        albumArtContainer.style.backgroundImage = dataUrl;
                        albumIcon.style.display = 'none';
                        albumArtUrl = `data:${format};base64,${base64String}`;
                        
                        if (isDynamicThemeActive) {
                            extractAndApplyDynamicTheme(albumArtUrl);
                        }
                        
                    } else {
                        albumIcon.style.display = 'block';
                        if (isDynamicThemeActive) {
                            const savedThemeName = localStorage.getItem('userTheme') || 'theme-dark';
                            applyThemeVariables(themes[savedThemeName], savedThemeName);
                        }
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
                    
                    // ===== INICIO LÓGICA DE LETRAS (MODIFICADO) =====
                    if (lrcFile) {
                        // 1. Si se encontró .lrc local, usarlo.
                        loadLyrics(lrcFile);
                    } else {
                        // 2. Si no, buscar en internet (pasando el trackIndex actual)
                        fetchLyrics(artist, title, currentTrackIndex);
                    }
                    // ===== FIN LÓGICA DE LETRAS =====
                    
                    updateMediaSession(title, artist, albumArtUrl);
                    
                    if (isDynamicThemeActive) {
                        const savedThemeName = localStorage.getItem('userTheme') || 'theme-dark';
                        applyThemeVariables(themes[savedThemeName], savedThemeName);
                    }
                }
            });
        } else {
            const title = track.name.replace(/\.[^/.]+$/, "");
            songTitle.textContent = title;
            artistName.textContent = 'Librería ID3 no cargada';
            if (headerSongTitle) headerSongTitle.textContent = title; 

            // ===== INICIO LÓGICA DE LETRAS (MODIFICADO) =====
            if (lrcFile) {
                loadLyrics(lrcFile);
            } else {
                fetchLyrics("Artista Desconocido", title, currentTrackIndex);
            }
            // ===== FIN LÓGICA DE LETRAS =====
            
            updateMediaSession(title, 'Librería ID3 no cargada', albumArtUrl);
            
            if (isDynamicThemeActive) {
                const savedThemeName = localStorage.getItem('userTheme') || 'theme-dark';
                applyThemeVariables(themes[savedThemeName], savedThemeName);
            }
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

/**
 * MODIFICADO: Reconfigurado para insertar el EQ en el grafo de audio.
 */
function initAudioContext() {
    if (audioContext && audioContext.state === 'running') return;
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            
            // Crear la fuente y guardarla
            audioSource = audioContext.createMediaElementSource(audioPlayer); 
            
            // ===== INICIO CONFIGURACIÓN EQ (AÑADIDO) =====
            setupEQ(); // Crea las bandas de EQ
            
            // Conectar el grafo de audio:
            // source -> eqBand[0] -> eqBand[1] ... -> eqBand[last] -> analyser -> destination
            audioSource.connect(eqBands[0]); // Conectar fuente a la primera banda
            eqBands[eqBands.length - 1].connect(analyser); // Conectar última banda al analizador
            // (Las bandas intermedias se conectan en setupEQ)
            // ===== FIN CONFIGURACIÓN EQ (AÑADIDO) =====
            
            analyser.connect(audioContext.destination); // Conectar analizador a la salida
            
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
// I. FUNCIONES DE ECUALIZADOR (AÑADIDO)
// ====================================================================

const EQ_PRESETS = {
    'custom': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'flat': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'pop': [ -1, 2, 4, 5, 3, 0, -2, -3, -4, -4],
    'rock': [5, 3, -1, -3, -2, 1, 4, 6, 7, 7],
    'jazz': [4, 2, 1, 3, -1, -1, 0, 2, 3, 4],
    'classical': [5, 4, 3, 2, -2, -2, 0, 2, 4, 5],
    'vocal': [-2, -1, 0, 3, 4, 4, 3, 0, -1, -2],
    'bass_boost': [8, 6, 4, 2, 0, 0, 0, 0, 0, 0],
    'treble_boost': [0, 0, 0, 0, 0, 0, 2, 4, 6, 8]
};

/**
 * Crea los nodos de filtro Biquad y los conecta en cadena.
 * También genera la UI para los sliders.
 */
function setupEQ() {
    if (!audioContext || !eqBandsContainer) return;
    
    eqBands = [];
    eqBandsContainer.innerHTML = '';

    EQ_FREQUENCIES.forEach((freq, i) => {
        const filter = audioContext.createBiquadFilter();

        // Determinar tipo de filtro
        if (i === 0) {
            filter.type = 'lowshelf'; // Primera banda (graves)
        } else if (i === EQ_FREQUENCIES.length - 1) {
            filter.type = 'highshelf'; // Última banda (agudos)
        } else {
            filter.type = 'peaking'; // Bandas intermedias
        }

        filter.frequency.value = freq;
        filter.gain.value = 0;
        filter.Q.value = 1; // Valor Q estándar para 'peaking'

        // Conectar al filtro anterior (si existe)
        if (i > 0) {
            eqBands[i - 1].connect(filter);
        }

        eqBands.push(filter);

        // --- Crear UI para esta banda ---
        const bandDiv = document.createElement('div');
        bandDiv.className = 'eq-band';
        
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'eq-slider-container';
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = -12;
        slider.max = 12;
        slider.step = 0.1;
        slider.value = 0;
        
        const gainLabel = document.createElement('span');
        gainLabel.className = 'eq-gain-label';
        gainLabel.textContent = '0.0 dB';
        
        const freqLabel = document.createElement('span');
        freqLabel.className = 'eq-freq-label';
        freqLabel.textContent = (freq < 1000) ? `${freq}Hz` : `${freq / 1000}k`;
        
        sliderContainer.appendChild(slider);
        bandDiv.appendChild(gainLabel);
        bandDiv.appendChild(sliderContainer);
        bandDiv.appendChild(freqLabel);
        eqBandsContainer.appendChild(bandDiv);
        
        // Añadir listener al slider
        slider.addEventListener('input', () => {
            const gain = parseFloat(slider.value);
            filter.gain.value = gain;
            gainLabel.textContent = `${gain.toFixed(1)} dB`;
            if (eqPresetsSelect) eqPresetsSelect.value = 'custom'; // Cambiar a custom
        });
        
        // Listener para resetear con doble click
         slider.addEventListener('dblclick', () => {
            slider.value = 0;
            filter.gain.value = 0;
            gainLabel.textContent = '0.0 dB';
            if (eqPresetsSelect) eqPresetsSelect.value = 'custom';
        });
    });
}

/**
 * Aplica un preset de ecualización seleccionado.
 */
function applyEQPreset() {
    if (!eqPresetsSelect || !eqBandsContainer) return;
    
    const presetName = eqPresetsSelect.value;
    const gains = EQ_PRESETS[presetName];
    if (!gains) return;
    
    const sliders = eqBandsContainer.querySelectorAll('input[type="range"]');
    const labels = eqBandsContainer.querySelectorAll('.eq-gain-label');
    
    eqBands.forEach((filter, i) => {
        const gain = gains[i];
        filter.gain.value = gain;
        if (sliders[i]) sliders[i].value = gain;
        if (labels[i]) labels[i].textContent = `${gain.toFixed(1)} dB`;
    });
}

/**
 * Abre el modal del Ecualizador.
 */
function openEqModal() {
    if (eqModal) eqModal.classList.add('open');
    if (eqOverlay) eqOverlay.classList.add('open');
}

/**
 * Cierra el modal del Ecualizador.
 */
function closeEqModal() {
    if (eqModal) eqModal.classList.remove('open');
    if (eqOverlay) eqOverlay.classList.remove('open');
}

// ====================================================================
// J. TEMA DINÁMICO (MODIFICADO)
// ====================================================================

// --- INICIO FUNCIONES HSL (AÑADIDAS) ---
/**
 * Convierte RGB a HSL.
 * r, g, b están en el rango [0, 255].
 * Devuelve [h, s, l] donde h está en [0, 360] y s, l en [0, 100].
 */
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, l * 100];
}

/**
 * Convierte HSL a CSS string 'hsl(h, s%, l%)'.
 * h, s, l vienen del array [h, s, l].
 */
function hslToCss(h, s, l) {
    return `hsl(${h.toFixed(0)}, ${s.toFixed(0)}%, ${l.toFixed(0)}%)`;
}
// --- FIN FUNCIONES HSL ---

/**
 * MODIFICADO: Ahora usa HSL para garantizar el contraste.
 * Genera un objeto de tema basado en un color promedio (RGB).
 */
function generateThemeFromColor(r, g, b) {
    // 1. Convertir el color promedio a HSL
    const [h, s, l] = rgbToHsl(r, g, b);

    // 2. Definir el color principal (resaltado)
    // Queremos que sea brillante y saturado.
    
    // Asegurar que la saturación no sea demasiado baja (p.ej. gris)
    const finalMainSat = Math.max(50, s); // Mínimo 50% de saturación.
    // Asegurar que la luminosidad sea alta (brillante)
    const finalMainLight = 65; // Fijarlo en 65% para un brillo consistente

    const mainColor = hslToCss(h, finalMainSat, finalMainLight);

    // 3. Definir los fondos (oscuros)
    // Usamos el mismo Tono (h) pero bajamos mucho la luminosidad.
    const bodyLight = 5; // Fondo principal muy oscuro
    const cardLight = 10; // Fondo de tarjeta un poco más claro
    
    // Reducir la saturación en los fondos para que no sean "barrocos"
    const bgSat = Math.min(s, 20); 

    const bodyBg = hslToCss(h, bgSat, bodyLight);
    const cardBg = hslToCss(h, bgSat, cardLight);

    // 4. Definir colores de texto
    // Para fondos tan oscuros, el texto siempre debe ser blanco/claro.
    const textColor = '#FFFFFF';
    // El texto secundario puede usar el HSL con alta luminosidad pero baja saturación
    const secondaryText = hslToCss(h, 15, 75); 

    return {
        '--main-color': mainColor,
        'body-background': bodyBg,
        '--card-bg-color': cardBg,
        '--card-text-color': textColor,
        '--card-text-secondary-color': secondaryText,
        '--border-color': mainColor // El borde usa el color principal brillante
    };
}


/**
 * Extrae el color promedio de una imagen (data URL) y aplica el tema.
 */
function extractAndApplyDynamicTheme(imageUrl) {
    if (!imageUrl.startsWith('data:')) {
        // Si no es data URL (ej. placeholder), revierte a estático
        const savedThemeName = localStorage.getItem('userTheme') || 'theme-dark';
        applyThemeVariables(themes[savedThemeName], savedThemeName);
        return;
    }
    
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        // Reducir el tamaño del canvas para muestreo más rápido
        const w = canvas.width = 20;
        const h = canvas.height = 20;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        
        let data, r = 0, g = 0, b = 0, count = 0;
        try {
            data = ctx.getImageData(0, 0, w, h).data;
        } catch (e) {
            console.error("Error al obtener datos de imagen (canvas):", e);
            // Fallback a tema estático si falla
            const savedThemeName = localStorage.getItem('userTheme') || 'theme-dark';
            applyThemeVariables(themes[savedThemeName], savedThemeName);
            return;
        }
        
        // Muestrear píxeles (cada 4 píxeles) para velocidad
        const step = 4 * 4; // Muestrear cada 4 píxeles
        for (let i = 0; i < data.length; i += step) { 
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
        }
        
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        
        // Generar y aplicar el tema
        const dynamicTheme = generateThemeFromColor(r, g, b);
        applyThemeVariables(dynamicTheme, null); // Aplicar sin guardar en localStorage
    };
    img.onerror = () => {
        // Fallback si la imagen no se puede cargar
        const savedThemeName = localStorage.getItem('userTheme') || 'theme-dark';
        applyThemeVariables(themes[savedThemeName], savedThemeName);
    };
    // Asegurar que CORS no sea un problema (aunque con data:URL no debería)
    img.crossOrigin = "Anonymous";
    img.src = imageUrl.replace('url("', '').replace('")', ''); // Limpiar el "url(...)" si viene
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
    lyricsPanelHeader = document.querySelector('.lyrics-panel h3'); // <-- AÑADIDO
    
    // Asignaciones NUEVAS (AÑADIDO)
    lyricsAlignOptions = document.getElementById('lyrics-align-options');
    lyricsFontSelect = document.getElementById('lyrics-font-select');
    lyricsEffectSelect = document.getElementById('lyrics-effect-select');

    // ACTUALIZADO: Añadir .lyrics-panel al selector de tarjetas
    const cards = document.querySelectorAll('.player-card, .playlist-panel, .color-selector, .lyrics-panel');
    const mainContainer = document.querySelector('.main-container');

    foldersPanel = document.querySelector('.folders-panel');
    foldersList = document.getElementById('folders-list');

    // ===== INICIO ASIGNACIÓN BARRA LATERAL (AÑADIDO) =====
    sidebar = document.getElementById('sidebar-nav');
    sidebarOpenBtn = document.getElementById('sidebar-open-btn');
    sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    sidebarOverlay = document.getElementById('sidebar-overlay');
    panelToggleList = document.getElementById('panel-toggle-list');
    // ===== FIN ASIGNACIÓN BARRA LATERAL (AÑADIDO) =====
    
    // ===== INICIO ASIGNACIÓN TEMA DINÁMICO (AÑADIDO) =====
    dynamicThemeToggle = document.getElementById('toggle-dynamic-theme');
    // ===== FIN ASIGNACIÓN TEMA DINÁMICO (AÑADIDO) =====
    
    // ===== INICIO ASIGNACIÓN ECUALIZADOR (AÑADIDO) =====
    eqModal = document.getElementById('eq-modal');
    eqOverlay = document.getElementById('eq-modal-overlay');
    eqCloseBtn = document.getElementById('eq-close-btn');
    eqOpenBtn = document.getElementById('open-eq-btn');
    eqPresetsSelect = document.getElementById('eq-presets-select');
    eqBandsContainer = document.getElementById('eq-bands-container');
    // ===== FIN ASIGNACIÓN ECUALIZADOR (AÑADIDO) =====


    sensitivityMultiplier = parseFloat(getComputedStyle(root).getPropertyValue('--sensitivity-multiplier'));

    createDynamicBars(); 
    setupMediaSessionHandlers();
    loadRepeatMode();
    
    // ===== INICIO: AÑADIR BADGE "LRC" (NUEVO) =====
    if (lyricsPanelHeader) {
        const badge = document.createElement('span');
        badge.id = 'lrc-badge';
        badge.textContent = 'LRC';
        badge.style.cssText = `
            color: var(--main-color);
            font-size: 0.7em;
            font-weight: bold;
            margin-right: 8px; /* Espacio entre badge y "Letra" */
            vertical-align: middle;
            display: none; /* Oculto por defecto */
            transition: color 0.5s ease-in-out; /* Para que cambie con el tema */
        `;
        lyricsPanelHeader.prepend(badge);
        lrcBadgeElement = badge; // Asignar a la variable global
    }
    // ===== FIN: AÑADIR BADGE "LRC" =====


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
    
    // 2.8 Cargar Visibilidad de Paneles (AÑADIDO)
    loadPanelVisibility();
    
    // 2.9 Cargar Estado de Tema Dinámico (AÑADIDO)
    const savedDynamicThemeState = localStorage.getItem('dynamicThemeActive');
    isDynamicThemeActive = (savedDynamicThemeState !== 'false'); // Default a true
    if (dynamicThemeToggle) dynamicThemeToggle.checked = isDynamicThemeActive;
    

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
        const target = event.target;
        if (target.classList.contains('color-swatch')) {
            const themeName = target.dataset.theme;
            const selectedTheme = themes[themeName];
            if (selectedTheme) {
                // AÑADIDO: Desactiva el tema dinámico si se elige uno manual
                if (dynamicThemeToggle) {
                    dynamicThemeToggle.checked = false;
                    isDynamicThemeActive = false;
                    localStorage.setItem('dynamicThemeActive', 'false');
                }
                
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

    // ===== INICIO DE LISTENERS BARRA LATERAL (AÑADIDO) =====
    if (sidebarOpenBtn) {
        sidebarOpenBtn.addEventListener('click', openSidebar);
    }
    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', closeSidebar);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
    
    if (panelToggleList) {
        panelToggleList.addEventListener('change', (event) => {
            const target = event.target;
            if (target.classList.contains('panel-toggle') && target.dataset.target) {
                setPanelVisibility(target.dataset.target, target.checked);
                savePanelVisibility();
            }
        });
    }
    // ===== FIN DE LISTENERS BARRA LATERAL (AÑADIDO) =====


    // ===== INICIO DE LISTENERS AÑADIDOS (EQ y Tema Dinámico) =====
    
    // Listener de Tema Dinámico
    if (dynamicThemeToggle) {
        dynamicThemeToggle.addEventListener('change', () => {
            isDynamicThemeActive = dynamicThemeToggle.checked;
            localStorage.setItem('dynamicThemeActive', isDynamicThemeActive);
            
            if (isDynamicThemeActive && audioPlayer.src && albumArtContainer.style.backgroundImage) {
                // Si hay una carátula cargada, aplica el tema dinámico
                let currentArt = albumArtContainer.style.backgroundImage;
                // Limpiar el 'url("...")'
                currentArt = currentArt.replace('url("', '').replace('")', '');
                
                extractAndApplyDynamicTheme(currentArt);
                
            } else if (!isDynamicThemeActive) {
                // Si se desactiva, revierte al tema estático guardado
                const savedThemeName = localStorage.getItem('userTheme') || 'theme-dark';
                applyThemeVariables(themes[savedThemeName], savedThemeName);
            }
        });
    }

    // Listeners de Ecualizador
    if (eqOpenBtn) {
        eqOpenBtn.addEventListener('click', openEqModal);
    }
    if (eqCloseBtn) {
        eqCloseBtn.addEventListener('click', closeEqModal);
    }
    if (eqOverlay) {
        eqOverlay.addEventListener('click', closeEqModal);
    }
    if (eqPresetsSelect) {
        eqPresetsSelect.addEventListener('change', applyEQPreset);
    }
    // ===== FIN DE LISTENERS AÑADIDOS (EQ y Tema Dinámico) =====


    // ===== INICIO DE LISTENERS AÑADIDOS (Letras) =====
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
    // ===== FIN DE LISTENERS AÑADIDOS (Letras) =====

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
        if (audioPlayer.duration > 0) {
             const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
             progressLine.style.width = `${progress}%`;
        }
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);

        // MODIFICADO: Solo sincroniza si currentLyrics tiene datos (de LRC)
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
