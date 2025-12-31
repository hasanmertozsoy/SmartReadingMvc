const DB_NAME = 'SmartReading_DB';
const DB_VERSION = 1;
const MIN_READ_TIME = 500;
const MAX_READ_TIME = 30000;
const DEFAULT_FONT_SIZE = 1.8;

let db;
let activeNote = null;
let sessionType = 'linear';
let playlist = [];
let currentCardIndex = 0;
let startTime = 0;
let isPaused = false;
let userFontSize = DEFAULT_FONT_SIZE;

window.onload = async () => {
    await initDB();
    renderNoteList();
    setupInputHandlers();
};

function initDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
            db = e.target.result;
            if (!db.objectStoreNames.contains('notes')) {
                db.createObjectStore('notes', { keyPath: 'id' });
            }
        };
        req.onsuccess = (e) => {
            db = e.target.result;
            resolve(db);
        };
        req.onerror = (e) => reject(e);
    });
}

async function dbOp(type, data) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['notes'], type === 'get' ? 'readonly' : 'readwrite');
        const store = tx.objectStore('notes');
        let req;
        if (type === 'add' || type === 'put') req = store.put(data);
        else if (type === 'getAll') req = store.getAll();
        else if (type === 'delete') req = store.delete(data);
        
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

function parseText(text) {
    let raw = text.replace(/\n/g, ' ').split(/([.?!])\s+(?=[A-ZİĞÜŞÖÇ])/g);
    let sentences = [];
    let buffer = "";
    const abbrs = ['Dr', 'Av', 'Prof', 'St', 'Alb', 'Yrd', 'Doç', 'Müh', 'vb', 'vs', 'bkz', 'min', 'max', 'Cad', 'Sok', 'Mah', 'No', 'Tel', 'Hz', 'Tic', 'Ltd', 'Şti', 'Inc', 'Corp'];
    
    for (let i = 0; i < raw.length; i++) {
        let part = raw[i];
        if (!part) continue;
        if (part.match(/^[.?!]$/)) {
            buffer += part;
            let tokens = buffer.trim().split(/\s+/);
            let lastWord = tokens.pop().replace(/[.?!]/g, '');
            
            if (abbrs.includes(lastWord) || (tokens.length > 0 && abbrs.includes(tokens[tokens.length-1]))) {
                buffer += " ";
            } else {
                sentences.push(createSentenceObj(sentences.length, buffer.trim()));
                buffer = "";
            }
        } else {
            buffer += part;
        }
    }
    if (buffer.trim()) sentences.push(createSentenceObj(sentences.length, buffer.trim()));
    return sentences;
}

function createSentenceObj(id, text) {
    return {
        id: id,
        text: text,
        wc: text.split(/\s+/).length,
        baseSpeed: null,
        weight: 1.0,
        history: []
    };
}

function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

async function saveNewNote() {
    const title = document.getElementById('inp-title').value.trim() || 'Adsız Not';
    const text = document.getElementById('inp-text').value.trim();
    if (!text) return alert("Metin boş olamaz!");

    const sentences = parseText(text);
    const note = {
        id: Date.now().toString(),
        title: title,
        sentences: sentences,
        progress: 0,
        lastOpened: Date.now()
    };

    await dbOp('add', note);
    closeModal('add-modal');
    document.getElementById('inp-title').value = '';
    document.getElementById('inp-text').value = '';
    renderNoteList();
}

async function renderNoteList() {
    const notes = await dbOp('getAll');
    const list = document.getElementById('note-list');
    list.innerHTML = '';

    if (notes.length === 0) {
        list.innerHTML = `
            <div style="text-align: center; color: #888; margin-top: 50px;">
                <div style="font-size: 40px; margin-bottom: 10px;">📝</div>
                <p>Henüz not eklemediniz.</p>
                <p style="font-size: 0.9em;">Sağ alttaki + butonuna basarak başlayın.</p>
            </div>
        `;
        return;
    }
    
    notes.sort((a,b) => b.lastOpened - a.lastOpened).forEach(note => {
        const div = document.createElement('div');
        div.className = 'note-item';
        div.innerHTML = `
            <div class="note-info" onclick="selectNote('${note.id}')" style="flex:1">
                <h3>${note.title}</h3>
                <span>${note.sentences.length} Cümle • %${Math.round(note.progress || 0)}</span>
            </div>
            <button class="btn-outline" style="width:auto; border-color:#ff4757; color:#ff4757" onclick="deleteNote('${note.id}')">Sil</button>
        `;
        list.appendChild(div);
    });
}

function selectNote(id) {
    dbOp('getAll').then(notes => {
        activeNote = notes.find(n => n.id == id);
        
        if (activeNote) {
            const modalTitle = document.querySelector('#mode-modal h2');
            if(modalTitle) modalTitle.innerText = activeNote.title;
            openModal('mode-modal');
        } else {
            console.error("Not bulunamadı ID:", id);
        }
    });
}

async function deleteNote(id) {
    if (confirm('Bu notu silmek istiyor musunuz?')) {
        const notes = await dbOp('getAll');
        const target = notes.find(n => n.id == id);
        if (target) {
            await dbOp('delete', target.id);
            renderNoteList();
        }
    }
}

function exportData() {
    dbOp('getAll').then(notes => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes));
        const anchor = document.createElement('a');
        anchor.setAttribute("href", dataStr);
        anchor.setAttribute("download", "smart_reading_backup.json");
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    });
}

function startSession(mode) {
    sessionType = mode;
    closeModal('mode-modal');
    
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
    }

    if (mode === 'linear') {
        playlist = [...activeNote.sentences];
    } else {
        generateRandomQueue(10);
    }
    
    document.getElementById('start-screen').classList.remove('active');
    document.getElementById('reader-screen').classList.add('active');
    renderCards();
}

function generateRandomQueue(count) {
    for (let i = 0; i < count; i++) {
        let pool = activeNote.sentences;
        let totalWeight = pool.reduce((acc, s) => acc + s.weight, 0);
        let r = Math.random() * totalWeight;
        let selected = null;
        
        for (let s of pool) {
            r -= s.weight;
            if (r <= 0) {
                selected = s;
                break;
            }
        }
        if (!selected) selected = pool[pool.length - 1]; 
        
        if (playlist.length > 0 && playlist[playlist.length - 1].id === selected.id && pool.length > 1) {
            i--; continue;
        }
        playlist.push({...selected}); 
    }
}

function generatePatternImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 600;
    const ctx = canvas.getContext('2d', { alpha: false });
    
    const baseHue = Math.floor(Math.random() * 360);
    ctx.fillStyle = `hsl(${baseHue}, 30%, 10%)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < 20; i++) {
        const shapeHue = (baseHue + Math.random() * 60 - 30) % 360;
        ctx.fillStyle = `hsla(${shapeHue}, 60%, 50%, ${Math.random() * 0.15 + 0.05})`;
        
        const type = Math.random();
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 150 + 30;
        
        ctx.beginPath();
        if (type < 0.4) {
            ctx.arc(x, y, size, 0, Math.PI * 2);
        } else if (type < 0.8) {
            ctx.rect(x - size/2, y - size/2, size, size);
        } else {
            ctx.moveTo(x, y - size);
            ctx.lineTo(x + size, y + size);
            ctx.lineTo(x - size, y + size);
        }
        ctx.fill();
    }
    return canvas.toDataURL('image/jpeg', 0.7);
}

function renderCards() {
    const container = document.getElementById('reader-container');
    container.innerHTML = ''; 
    
    playlist.forEach((sentence, index) => {
        createCardDOM(sentence, index, container);
    });

    setupObserver();
    startTime = Date.now();
    currentCardIndex = 0;
}

function createCardDOM(sentence, index, container) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    card.dataset.sid = sentence.id;
    
    card.style.backgroundImage = `url(${generatePatternImage()})`;
    
    const content = document.createElement('div');
    content.className = 'card-content';
    content.style.fontSize = userFontSize + 'rem';
    content.innerText = sentence.text;
    
    const dim = document.createElement('div');
    dim.className = 'overlay-dim';

    card.appendChild(dim);
    card.appendChild(content);
    container.appendChild(card);
    return card;
}

let observer;
function setupObserver() {
    if (observer) {
        observer.disconnect();
    }

    const options = { root: document.getElementById('reader-container'), threshold: 0.6 };
    
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = parseInt(entry.target.dataset.index);
                if (index !== currentCardIndex) {
                    processCardFinished(currentCardIndex);

                    currentCardIndex = index;
                    startTime = Date.now();
                    
                    if (sessionType === 'random' && index > playlist.length - 3) {
                        appendMoreCards();
                    }
                    dbOp('put', activeNote);
                }
            }
        });
    }, options);
    
    document.querySelectorAll('.card').forEach(c => observer.observe(c));
}

function appendMoreCards() {
    generateRandomQueue(5);
    const container = document.getElementById('reader-container');
    for (let i = playlist.length - 5; i < playlist.length; i++) {
        const card = createCardDOM(playlist[i], i, container);
        observer.observe(card);
    }
}

function processCardFinished(index) {
    if (index < 0 || index >= playlist.length) return;
    const duration = Date.now() - startTime;
    if (duration < MIN_READ_TIME) return; 
    const validDuration = Math.min(duration, MAX_READ_TIME);
    
    const sId = playlist[index].id;
    const realSentence = activeNote.sentences.find(s => s.id === sId);
    
    if (!realSentence) return;
    const speed = validDuration;
    
    if (!realSentence.baseSpeed) {
        realSentence.baseSpeed = speed;
    } else {
        const ratio = speed / realSentence.baseSpeed;
        let newWeight = ratio;
        
        if (newWeight < 0.01) newWeight = 0.01;
        if (newWeight > 5.0) newWeight = 5.0; 
        
        realSentence.weight = parseFloat(newWeight.toFixed(4));
    }
    
    realSentence.history.push({ date: Date.now(), ms: speed });
    checkMastery();
}

function checkMastery() {
    const masteredCount = activeNote.sentences.filter(s => s.weight < 0.5).length;
    const total = activeNote.sentences.length;
    
    if (total > 0) {
        activeNote.progress = (masteredCount / total) * 100;
    }

    const allMastered = masteredCount === total;
    if (allMastered) {
        const msg = document.getElementById('feedback-msg');
        msg.style.opacity = '1';
        setTimeout(() => { msg.style.opacity = '0'; }, 3000);
    }
}

function setupInputHandlers() {
    const container = document.getElementById('reader-container');
    let touchStartTime = 0;
    let longPressTimer = null;
    let startX = 0, startY = 0;
    let isDragging = false;
    
    let initialPinchDist = 0;
    let initialFontSize = 0;

    const handleStart = (x, y) => {
        startX = x;
        startY = y;
        isDragging = false;
        touchStartTime = Date.now();
        
        longPressTimer = setTimeout(() => {
            if (!isDragging) {
                document.querySelectorAll('.card').forEach(c => c.style.animationPlayState = 'paused');
                isPaused = true;
                openModal('pause-modal');
            }
        }, 600);
    };

    const handleMove = (x, y) => {
        const diffX = Math.abs(x - startX);
        const diffY = Math.abs(y - startY);
        if (diffX > 10 || diffY > 10) {
            isDragging = true;
            clearTimeout(longPressTimer);
        }
    };

    const handleEnd = () => {
        clearTimeout(longPressTimer);
        document.querySelectorAll('.card').forEach(c => {
            c.style.transform = 'scale(1)'; 
            c.style.animationPlayState = 'running';
        });
    };

    container.addEventListener('mousedown', (e) => {
        if (e.button === 0) handleStart(e.pageX, e.pageY);
    });
    container.addEventListener('mousemove', (e) => {
        if (e.buttons === 1) handleMove(e.pageX, e.pageY);
    });
    container.addEventListener('mouseup', handleEnd);
    container.addEventListener('mouseleave', handleEnd);

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            handleStart(e.touches[0].pageX, e.touches[0].pageY);
        } else if (e.touches.length === 2) {
            clearTimeout(longPressTimer);
            initialPinchDist = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            initialFontSize = userFontSize;
        }
    });

    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
            handleMove(e.touches[0].pageX, e.touches[0].pageY);
        } else if (e.touches.length === 2) {
            const dist = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            const scale = dist / initialPinchDist;
            const newSize = Math.max(1, Math.min(5, initialFontSize * scale));
            userFontSize = newSize;
            
            document.querySelectorAll('.card-content').forEach(el => el.style.fontSize = newSize + 'rem');
            e.preventDefault(); 
        }
    });
    
    container.addEventListener('touchend', handleEnd);
}

function resumeSession() {
    closeModal('pause-modal');
    isPaused = false;
    startTime = Date.now(); 
}

function exitSession() {
    processCardFinished(currentCardIndex);
    dbOp('put', activeNote);
    
    if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {}); 
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
    
    closeModal('pause-modal');
    document.getElementById('reader-screen').classList.remove('active');
    document.getElementById('start-screen').classList.add('active');
    renderNoteList();
}