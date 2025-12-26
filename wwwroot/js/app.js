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
    setupGestures();
    
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
    const abbrs = ['Dr', 'Av', 'Prof', 'St', 'Alb', 'Yrd', 'Doç', 'Müh', 'vb', 'vs', 'bkz', 'min', 'max'];
    
    for (let i = 0; i < raw.length; i++) {
        let part = raw[i];
        if (!part) continue;
        if (part.match(/^[.?!]$/)) {
            buffer += part;
            let lastWord = buffer.trim().split(/\s+/).pop().replace(/[.?!]/g, '');
            if (abbrs.includes(lastWord)) {
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
        activeNote = notes.find(n => n.id === id);
        openModal('mode-modal');
    });
}

async function deleteNote(id) {
    if (confirm('Bu notu silmek istiyor musunuz?')) {
        await dbOp('delete', id);
        renderNoteList();
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
    try { document.documentElement.requestFullscreen(); } catch(e){}

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

function renderCards() {
    const container = document.getElementById('reader-container');
    container.innerHTML = ''; 
    
    playlist.forEach((sentence, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.sid = sentence.id;
        
        const hue1 = Math.floor(Math.random() * 360);
        const hue2 = (hue1 + 40 + Math.random() * 60) % 360;
        const hue3 = (hue1 + 180) % 360;
        card.style.background = `linear-gradient(${Math.random()*360}deg, hsl(${hue1}, 70%, 40%), hsl(${hue2}, 80%, 30%), hsl(${hue3}, 60%, 20%))`;
        card.style.backgroundSize = "400% 400%";
        
        const content = document.createElement('div');
        content.className = 'card-content';
        content.style.fontSize = userFontSize + 'rem';
        content.innerText = sentence.text;
        
        const dim = document.createElement('div');
        dim.className = 'overlay-dim';

        card.appendChild(dim);
        card.appendChild(content);
        container.appendChild(card);
    });

    setupObserver();
    startTime = Date.now();
    currentCardIndex = 0;
}

let observer;
function setupObserver() {
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
        const sentence = playlist[i];
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = i;
        card.dataset.sid = sentence.id;
        
        const hue1 = Math.floor(Math.random() * 360);
        card.style.background = `linear-gradient(${Math.random()*360}deg, hsl(${hue1}, 70%, 40%), hsl(${hue1+60}, 80%, 30%))`;
        card.style.backgroundSize = "400% 400%";
        
        const content = document.createElement('div');
        content.className = 'card-content';
        content.style.fontSize = userFontSize + 'rem';
        content.innerText = sentence.text;
        
        card.appendChild(document.createElement('div')).className='overlay-dim';
        card.appendChild(content);
        container.appendChild(card);
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
        let newWeight = realSentence.weight * ratio;
        if (newWeight < 0.012) newWeight = 0.012;
        if (newWeight > 5.0) newWeight = 5.0; 
        realSentence.weight = parseFloat(newWeight.toFixed(4));
    }
    
    realSentence.history.push({ date: Date.now(), ms: speed });
    checkMastery();
}

function checkMastery() {
    const allMastered = activeNote.sentences.every(s => {
        if (!s.baseSpeed || s.history.length === 0) return false;
        const lastSpeed = s.history[s.history.length - 1].ms;
        return lastSpeed <= (s.baseSpeed * 0.5);
    });

    if (allMastered) {
        const msg = document.getElementById('feedback-msg');
        msg.style.opacity = '1';
        setTimeout(() => { msg.style.opacity = '0'; }, 3000);
    }
}

function setupGestures() {
    const container = document.getElementById('reader-container');
    let touchStartTime = 0;
    let longPressTimer = null;
    let initialPinchDist = 0;
    let initialFontSize = 0;
    
    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            touchStartTime = Date.now();
            longPressTimer = setTimeout(() => {
                document.querySelectorAll('.card').forEach(c => c.style.animationPlayState = 'paused');
                isPaused = true;
                openModal('pause-modal');
            }, 600); 
        } else if (e.touches.length === 2) {
            initialPinchDist = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            initialFontSize = userFontSize;
        }
    });

    container.addEventListener('touchend', (e) => {
        clearTimeout(longPressTimer);
        document.querySelectorAll('.card').forEach(c => {
            c.style.transform = 'scale(1)'; 
            c.style.animationPlayState = 'running';
        });
    });
    
    container.addEventListener('touchmove', (e) => {
        clearTimeout(longPressTimer);
        if (e.touches.length === 2) {
            const dist = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            const scale = dist / initialPinchDist;
            const newSize = Math.max(1, Math.min(5, initialFontSize * scale));
            userFontSize = newSize;
            
            document.querySelectorAll('.card-content').forEach(el => el.style.fontSize = newSize + 'rem');
            
            const activeCard = document.querySelector('.card[data-index="'+currentCardIndex+'"]');
            if(activeCard && scale > 1) {
                activeCard.style.transform = `scale(${Math.min(1.5, scale)})`;
            }
            e.preventDefault(); 
        }
    });
}

function resumeSession() {
    closeModal('pause-modal');
    isPaused = false;
    startTime = Date.now(); 
}

function exitSession() {
    processCardFinished(currentCardIndex);
    dbOp('put', activeNote);
    document.exitFullscreen().catch(e=>{});
    closeModal('pause-modal');
    document.getElementById('reader-screen').classList.remove('active');
    document.getElementById('start-screen').classList.add('active');
    renderNoteList();
}