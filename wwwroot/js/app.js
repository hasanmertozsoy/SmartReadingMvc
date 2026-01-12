import React, { useState, useEffect, useRef, useCallback } from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import { Plus, Trash2, Upload, Download, FileText, Sparkles, Heart, Settings, Sun, Moon, Edit2, RefreshCcw, RefreshCw, Eye, EyeOff, X, Play, Volume2, VolumeX, FileUp, BookOpen, Maximize, Minimize } from 'https://esm.sh/lucide-react@0.292.0';

/**
 * Çoklu dil desteği sağlayan yardımcı fonksiyon.
 * @param {string} lang - Seçili dil ('tr' veya 'en')
 * @param {string} key - Çeviri anahtarı
 * @returns {string} Çevrilmiş metin
 */
const translate = (lang, key) => {
    const dictionary = {
        tr: {
            app: "Akıllı Okuma", my: "Notlarım", fav: "Favoriler", rev: "Tekrar", no: "Not yok.",
            edit: "Düzenle", new: "Yeni Not", title: "Başlık", content: "İçerik...", cancel: "İptal",
            save: "Kaydet", update: "Güncelle", settings: "Ayarlar", theme: "Tema", appearance: "Görünüm",
            language: "Dil", pomodoro: "Pomodoro", focus: "Odak", break: "Mola", backup: "Yedekle",
            restore: "Geri Yükle", done: "Tamam", deleteConfirm: "Silinsin mi?", paused: "Duraklatıldı",
            resume: "Devam Et", saveExit: "Kaydet & Çık", shuffling: "Notlar karıştırılıyor...",
            empty: "Boş not.", quickStartTitle: "Hızlı Başlangıç",
            quickStartText: "Ekrana çift tıkla favorile. Basılı tut duraklat. İki parmakla yazı boyutu ayarla. Biyonik okuma ve seslendirme aktiftir. Sağ üstteki ses butonu ile okumayı açabilirsiniz.",
            restored: "Yüklendi!", error: "Hata", importFile: "Dosya Al", importing: "Aktarılıyor...",
            fileError: "Dosya hatası", sentences: "Cümle"
        },
        en: {
            app: "Smart Reading", my: "My Notes", fav: "Favorites", rev: "Review", no: "No notes.",
            edit: "Edit", new: "New Note", title: "Title", content: "Content...", cancel: "Cancel",
            save: "Save", update: "Update", settings: "Settings", theme: "Theme", appearance: "Appearance",
            language: "Language", pomodoro: "Pomodoro", focus: "Focus", break: "Break", backup: "Backup",
            restore: "Restore", done: "Done", deleteConfirm: "Delete?", paused: "Paused",
            resume: "Resume", saveExit: "Save & Exit", shuffling: "Shuffling...", empty: "Empty.",
            quickStartTitle: "Quick Start",
            quickStartText: "Double tap to favorite. Long press to pause. Pinch for font size. Bionic reading and TTS enabled. Toggle sound with the top right button.",
            restored: "Restored!", error: "Error", importFile: "Import File", importing: "Importing...",
            fileError: "File error", sentences: "Sentences"
        }
    };
    return dictionary[lang][key] || "";
};

/**
 * Ham metni cümlelerine ayırır ve analiz eder.
 * @param {string} text - İşlenecek ham metin
 * @returns {Array} Analiz edilmiş cümle objeleri listesi
 */
const parseText = (text) => {
    // Metni noktalama işaretlerine göre böl (., ?, !)
    const rawSentences = text.replace(/\n/g, ' ').split(/([.?!])\s+(?=[A-ZİĞÜŞÖÇ])/g);
    const sentences = [];
    let buffer = "";
    let uniqueId = Date.now();
    
    // Kısaltmalar listesi (bu kelimelerden sonra nokta gelse bile cümle bitmez)
    const abbreviations = ['Dr', 'Av', 'Prof', 'St', 'Alb', 'Yrd', 'Doç', 'Müh', 'vb', 'vs', 'bkz', 'min', 'max', 'No', 'Tel', 'Hz', 'Tic', 'Ltd', 'Şti', 'Inc'];
    
    const addSentence = (txt) => {
        const trimmed = txt.trim();
        if (trimmed) {
            sentences.push({
                id: uniqueId++,
                text: trimmed,
                wordCount: trimmed.split(/\s+/).length,
                weight: 1, // Öğrenme ağırlığı (zorluk seviyesi)
                isFavorite: false,
                lastRead: 0,
                readCount: 0,
                history: []
            });
        }
    };

    for (let i = 0; i < rawSentences.length; i++) {
        const part = rawSentences[i];
        if (!part) continue;
        
        if (part.match(/^[.?!]$/)) {
            buffer += part;
            const words = buffer.trim().split(/\s+/);
            const lastWord = words.length > 0 ? words[words.length - 1].replace(/[.?!]/g, '') : '';
            
            if (abbreviations.includes(lastWord)) {
                buffer += " ";
            } else {
                addSentence(buffer);
                buffer = "";
            }
        } else {
            buffer += part;
        }
    }
    if (buffer.trim()) addSentence(buffer);
    return sentences;
};

/**
 * Dinamik arka plan desenleri oluşturur.
 * @param {number} hue - Renk tonu değeri
 * @returns {string} Base64 formatında resim verisi
 */
const generatePattern = (hue) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 1600;
    if (!ctx) return '';

    ctx.fillStyle = `hsl(${hue}, 30%, 10%)`;
    ctx.fillRect(0, 0, 800, 1600);

    for (let i = 0; i < 20; i++) {
        ctx.fillStyle = `hsla(${(hue + Math.random() * 60 - 30) % 360}, 60%, 50%, ${Math.random() * 0.15 + 0.05})`;
        const type = Math.random();
        const x = Math.random() * 800;
        const y = Math.random() * 1600;
        const size = Math.random() * 150 + 30;

        ctx.beginPath();
        if (type < 0.4) ctx.arc(x, y, size, 0, Math.PI * 2);
        else if (type < 0.8) ctx.rect(x - size / 2, y - size / 2, size, size);
        else {
            ctx.moveTo(x, y - size);
            ctx.lineTo(x + size, y + size);
            ctx.lineTo(x - size, y + size);
        }
        ctx.fill();
    }
    return canvas.toDataURL('image/jpeg', 0.6);
};

/**
 * Biyonik okuma formatlaması uygular.
 * Kelimelerin ilk yarılarını kalınlaştırır.
 */
const applyBionicReading = (text) => {
    return text.split(' ').map(word => {
        if (word.length < 2 || word.startsWith('\\')) return word;
        const midPoint = Math.ceil(word.length / 2);
        return `<b>${word.slice(0, midPoint)}</b>${word.slice(midPoint)}`;
    }).join(' ');
};

/**
 * Metni ekranda gösterilmek üzere işler (LaTeX ve Biyonik Okuma).
 */
const processDisplayContent = (text) => {
    let processedHtml = text;
    
    // LaTeX formüllerini işle (KaTeX varsa)
    if (window.katex) {
        try {
            processedHtml = processedHtml
                .replace(/\$\$([\s\S]+?)\$\$/g, (_, content) => window.katex.renderToString(content, { displayMode: true }))
                .replace(/\\\[([\s\S]+?)\\\]/g, (_, content) => window.katex.renderToString(content, { displayMode: true }))
                .replace(/\\\(([\s\S]+?)\\\)/g, (_, content) => window.katex.renderToString(content, { displayMode: false }))
                .replace(/\$([^$]+?)\$/g, (_, content) => window.katex.renderToString(content, { displayMode: false }));
        } catch (e) {
            console.error("KaTeX rendering error:", e);
        }
    }

    const div = document.createElement('div');
    div.innerHTML = processedHtml;

    // Metin düğümlerine biyonik okuma uygula
    const applyToNodes = (node) => {
        if (node.nodeType === 3) { // Text Node
            node.parentNode.innerHTML = node.parentNode.innerHTML.replace(node.nodeValue, applyBionicReading(node.nodeValue));
        } else if (node.nodeType === 1 && !node.className.includes('katex')) { // Element Node (KaTeX hariç)
            node.childNodes.forEach(applyToNodes);
        }
    };
    applyToNodes(div);
    return div.innerHTML;
};

/**
 * Kullanıcının okuma hızına göre cümlenin zorluk derecesini (Mastery) hesaplar.
 * @param {Object} sentence - Cümle objesi
 * @param {number} duration - Okuma süresi (ms)
 * @param {Array} history - Geçmiş okuma verileri
 */
const calculateMastery = (sentence, duration, history) => {
    const allDurations = [...history.map(x => x.duration), duration];
    const mean = allDurations.reduce((a, b) => a + b, 0) / allDurations.length;

    // Yeterli veri yoksa varsayılan döndür
    if (allDurations.length < 3) return { weight: 1, baseSpeed: mean, isOutlier: false };

    // Standart Sapma hesapla (Aykırı değer tespiti için)
    const variance = allDurations.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / allDurations.length;
    const stdDev = Math.sqrt(variance);

    // Aykırı değerleri filtrele (Ortalama +- 2*StdDev dışındakiler)
    const validTimes = stdDev === 0 ? allDurations : allDurations.filter(t => Math.abs(t - mean) <= 2 * stdDev);
    const newBaseSpeed = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;

    // Eğer şu anki okuma süresi bir aykırı değerse, ağırlığı güncelleme
    if (stdDev > 0 && Math.abs(duration - mean) > 2 * stdDev) {
        return { weight: sentence.weight, baseSpeed: newBaseSpeed, isOutlier: true };
    }

    // Ağırlık hesaplama (Daha yavaş okunanlar daha ağır/zor kabul edilir)
    let newWeight = (sentence.weight || 1) * Math.pow(duration / newBaseSpeed, 1.5);
    return { 
        weight: Math.max(1e-4, Math.min(newWeight, 5)), 
        baseSpeed: newBaseSpeed, 
        isOutlier: false 
    };
};

/**
 * Okuma kuyruğu oluşturur (Ağırlıklı rastgele seçim algoritması).
 */
const generateReadingQueue = (note, count, excludeId) => {
    const queue = [];
    const pool = note.sentences;
    if (!pool || !pool.length) return [];

    if (pool.length === 1) {
        for (let i = 0; i < count; i++) queue.push({ ...pool[0] });
        return queue;
    }

    for (let i = 0; i < count; i++) {
        let totalWeight = pool.reduce((acc, s) => acc + s.weight, 0);
        let randomVal = Math.random() * totalWeight;
        let selected = null;

        for (const s of pool) {
            randomVal -= s.weight;
            if (randomVal <= 0) {
                selected = s;
                break;
            }
        }

        if (!selected) selected = pool[pool.length - 1];

        // Arka arkaya aynı cümleyi getirmemeye çalış
        if ((excludeId !== undefined && i === 0 && selected.id === excludeId) || 
            (queue.length && queue[queue.length - 1].id === selected.id)) {
            i--; 
            continue;
        }
        queue.push({ ...selected });
    }
    return queue;
};

// Renk Temaları
const THEME_HUES = { blue: 217, green: 142, purple: 270, orange: 24, red: 0, pink: 330, cyan: 189, teal: 173, indigo: 239, yellow: 48, lime: 84, monochrome: 0 };

/**
 * IndexedDB Veritabanı İşlemleri
 */
const databaseOperation = (method, data, returnValue) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('SR_DB', 1);
        request.onupgradeneeded = e => e.target.result.createObjectStore('notes', { keyPath: 'id' });
        
        request.onsuccess = e => {
            const transaction = e.target.result.transaction('notes', 'readwrite');
            const store = transaction.objectStore('notes');
            const operation = store[method](data ? data : undefined);
            
            operation.onsuccess = e => resolve(returnValue ? e.target.result : undefined);
            operation.onerror = e => reject(e);
        };
    });
};

/**
 * Okuyucu Bileşeni (Reader Component)
 * Ana okuma deneyimini yönetir.
 */
const Reader = ({ note, settings, onExit, onFavorite, isBreakMode, onProgress }) => {
    const [queue, setQueue] = useState([]);
    const [backgrounds, setBackgrounds] = useState([]);
    const [displayContents, setDisplayContents] = useState([]);
    const [fontSize, setFontSize] = useState(1.8);
    const [isPaused, setIsPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [feedbackAction, setFeedbackAction] = useState(null); // Kalp animasyonu için
    const [showControls, setShowControls] = useState(false);

    const containerRef = useRef(null);
    const activeNoteRef = useRef(note);
    const startTimeRef = useRef(0);
    const currentIndexRef = useRef(0);
    const observerRef = useRef(null);
    const isLoadingRef = useRef(false);
    const mouseTimerRef = useRef(null);
    const isBreakRef = useRef(isBreakMode);
    
    // Dokunmatik kontroller için
    const longPressRef = useRef(null);
    const touchStartRef = useRef(null);
    const pinchDistanceRef = useRef(null);
    const initialFontSizeRef = useRef(1.8);
    
    const speechRef = useRef(window.speechSynthesis);

    const speak = (text) => {
        if (!text) return;
        speechRef.current.cancel();
        if (isMuted || isBreakRef.current || isPaused || isLoadingRef.current) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = settings.language === 'tr' ? 'tr-TR' : 'en-US';
        utterance.rate = 1.1;
        speechRef.current.speak(utterance);
    };

    // Durum güncellemeleri
    useEffect(() => {
        isBreakRef.current = isBreakMode;
        if (isBreakMode || isPaused) speechRef.current.cancel();
        else if (!isMuted && queue[currentIndexRef.current]) speak(queue[currentIndexRef.current].text);
    }, [isBreakMode, isPaused]);

    useEffect(() => {
        if (isMuted) speechRef.current.cancel();
        else if (queue[currentIndexRef.current]) speak(queue[currentIndexRef.current].text);
    }, [isMuted]);

    useEffect(() => { activeNoteRef.current = note; }, [note]);

    // Başlangıç Ayarları
    useEffect(() => {
        // Geri tuşu yönetimi
        window.history.pushState(null, '', window.location.href);
        window.onpopstate = () => {
            if (isBreakRef.current) window.history.pushState(null, '', window.location.href);
            else onExit();
        };

        let initialQueue = note.sentences.map(s => ({ ...s }));
        if (!initialQueue.length) {
            initialQueue = [{ id: 0, text: translate(settings.language, 'empty'), wordCount: 0, weight: 1, isFavorite: false, history: [] }];
        }

        setQueue(initialQueue);
        setBackgrounds(initialQueue.map(() => generatePattern(Math.random() * 360)));
        setDisplayContents(initialQueue.map(s => processDisplayContent(s.text)));
        startTimeRef.current = Date.now();

        // Kaldığı yerden devam etme (scroll)
        const lastReadSentence = note.sentences.reduce((prev, curr, i) => curr.lastRead > prev.time ? { time: curr.lastRead, index: i } : prev, { time: 0, index: 0 });
        if (lastReadSentence.index > 0) {
            setTimeout(() => {
                const element = document.querySelector(`[data-index="${lastReadSentence.index}"]`);
                if (element) element.scrollIntoView({ block: "center" });
            }, 100);
        }

        return () => {
            speechRef.current.cancel();
            window.onpopstate = null;
            if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current);
        };
    }, []);

    // Cümle bitişini işle (İstatistikleri kaydet)
    const handleSentenceFinish = useCallback((idx) => {
        if (isPaused || isBreakRef.current) return;
        
        const duration = Date.now() - startTimeRef.current;
        const currentItem = queue[idx];
        
        // Çok kısa geçişleri yoksay (Okuma değil, hızlı kaydırma)
        if (!currentItem || duration < Math.max(500, (currentItem.wordCount || 1) * 150)) return;

        const currentNote = activeNoteRef.current;
        const realIndex = currentNote.sentences.findIndex(s => s.id === currentItem.id);

        if (realIndex !== -1) {
            const realSentence = currentNote.sentences[realIndex];
            const { weight, baseSpeed, isOutlier } = calculateMastery(realSentence, Math.min(duration, 30000), realSentence.history);
            
            const updateData = {
                baseSpeed: baseSpeed,
                weight: isOutlier ? realSentence.weight : weight,
                lastRead: Date.now(),
                readCount: (realSentence.readCount || 0) + 1,
                history: [...realSentence.history, { duration: Math.min(duration, 30000) }]
            };
            
            Object.assign(realSentence, updateData);
            onProgress(currentItem.id, updateData);
        }
    }, [queue, isPaused, onProgress]);

    // Intersection Observer (Kaydırma takibi)
    useEffect(() => {
        if (!queue.length) return;
        
        observerRef.current?.disconnect();
        observerRef.current = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.dataset.index || '0');
                    
                    if (index !== currentIndexRef.current) {
                        handleSentenceFinish(currentIndexRef.current);
                        currentIndexRef.current = index;
                        startTimeRef.current = Date.now();

                        if (!isLoadingRef.current && !isMuted) speak(queue[index].text);

                        // Sonsuz kaydırma için yeni cümleler ekle
                        if (index >= queue.length - 3 && !isLoadingRef.current) {
                            isLoadingRef.current = true;
                            const newBatch = generateReadingQueue(activeNoteRef.current, 5, queue[queue.length - 1].id);
                            
                            setQueue(prev => [...prev, ...newBatch]);
                            setBackgrounds(prev => [...prev, ...newBatch.map(() => generatePattern(Math.random() * 360))]);
                            setDisplayContents(prev => [...prev, ...newBatch.map(s => processDisplayContent(s.text))]);
                            
                            setTimeout(() => isLoadingRef.current = false, 200);
                        }
                    }
                }
            });
        }, { root: containerRef.current, threshold: 0.6 });

        document.querySelectorAll('.sentence-container').forEach(el => observerRef.current.observe(el));
        return () => observerRef.current?.disconnect();
    }, [queue, handleSentenceFinish, isMuted]);

    // Çift tıklama (Favorileme)
    const handleDoubleTap = (id) => {
        if (isBreakMode) return;
        const sentence = activeNoteRef.current.sentences.find(i => i.id === id);
        const willFavorite = sentence ? !sentence.isFavorite : true;
        
        onFavorite(id);
        setFeedbackAction(willFavorite ? 'add' : 'remove');
        setTimeout(() => setFeedbackAction(null), 800);
    };

    return (
        <div 
            className="relative w-full h-[100dvh] bg-black select-none overflow-hidden" 
            onMouseMove={() => { 
                setShowControls(true); 
                clearTimeout(mouseTimerRef.current); 
                mouseTimerRef.current = setTimeout(() => setShowControls(false), 3000); 
            }}
            onTouchStart={e => {
                if (!isBreakMode) {
                    if (e.touches.length === 1) {
                        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                        longPressRef.current = setTimeout(() => setIsPaused(true), 500);
                    } else if (e.touches.length === 2) {
                        initialFontSizeRef.current = fontSize;
                        pinchDistanceRef.current = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                    }
                }
            }}
            onTouchMove={e => {
                if (!isBreakMode) {
                    // Kaydırma başladıysa uzun basmayı iptal et
                    if (e.touches.length === 1 && touchStartRef.current && Math.hypot(e.touches[0].clientX - touchStartRef.current.x, e.touches[0].clientY - touchStartRef.current.y) > 10) {
                        clearTimeout(longPressRef.current);
                    }
                    // Çimdikleme (Pinch) ile yazı boyutu
                    if (e.touches.length === 2 && pinchDistanceRef.current) {
                        e.preventDefault();
                        const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                        setFontSize(Math.max(1, Math.min(5, initialFontSizeRef.current * (dist / pinchDistanceRef.current))));
                    }
                }
            }}
            onTouchEnd={() => {
                clearTimeout(longPressRef.current);
                touchStartRef.current = null;
                pinchDistanceRef.current = null;
            }}
        >
            {/* Geri Bildirim İkonu (Kalp) */}
            {feedbackAction && (
                <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <Heart size={120} className={feedbackAction === 'add' ? "text-red-500 fill-red-500 animate-bounce" : "text-white opacity-80 animate-pulse"} />
                </div>
            )}

            {/* Kaydırılabilir Alan */}
            <div ref={containerRef} className={`w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth ${(isPaused || isBreakMode) ? 'overflow-hidden pointer-events-none' : ''}`}>
                {queue.map((sentence, i) => {
                    const isNew = activeNoteRef.current.sentences.find(x => x.id === sentence.id)?.weight < 0.5;
                    return (
                        <div 
                            key={`${sentence.id}-${i}`} 
                            data-index={i} 
                            className="sentence-container w-full h-full snap-start snap-always relative flex items-center justify-center overflow-hidden transition-all duration-500"
                            onDoubleClick={e => { e.stopPropagation(); handleDoubleTap(sentence.id); }}
                        >
                            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgrounds[i]})` }} />
                            <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                            
                            {isNew && <div className="absolute top-6 right-6 text-green-400 opacity-80 animate-fade-in"><Sparkles size={24} fill="currentColor" /></div>}
                            
                            <div className="relative z-10 w-[85%] text-center pointer-events-none">
                                <p 
                                    className="font-medium text-white leading-relaxed drop-shadow-lg" 
                                    style={{ fontSize: `${fontSize}rem`, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }} 
                                    dangerouslySetInnerHTML={{ __html: displayContents[i] || sentence.text }} 
                                />
                            </div>
                        </div>
                    );
                })}
                <div className="h-[1px] w-full snap-start"></div>
            </div>

            {/* Duraklatma Menüsü */}
            {isPaused && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 animate-in fade-in">
                    <div className="bg-[#222] border border-white/10 p-8 rounded-2xl shadow-2xl text-center min-w-[300px]">
                        <h2 className="text-2xl font-bold mb-6 text-white">{translate(settings.language, 'paused')}</h2>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => { setIsPaused(false); startTimeRef.current = Date.now(); if (!isMuted && queue[currentIndexRef.current]) speak(queue[currentIndexRef.current].text); }} 
                                className="w-full bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                            >
                                <Play size={20} fill="currentColor" />{translate(settings.language, 'resume')}
                            </button>
                            <button 
                                onClick={() => { handleSentenceFinish(currentIndexRef.current); onExit(); }} 
                                className="w-full bg-red-500/20 text-red-500 border border-red-500/50 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                            >
                                <X size={20} />{translate(settings.language, 'saveExit')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Üst Sağ Kontroller */}
            <div className={`absolute top-0 right-0 p-4 pt-[calc(env(safe-area-inset-top)+3.5rem)] transition-opacity duration-300 ${showControls && !isPaused && !isBreakMode ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
                <div className="flex flex-col items-end gap-2">
                    <button onClick={() => { handleSentenceFinish(currentIndexRef.current); onExit(); }} className="p-3 bg-black/50 rounded-full text-white pointer-events-auto hover:bg-white/20"><X size={24} /></button>
                    <button onClick={e => { e.stopPropagation(); handleDoubleTap(queue[currentIndexRef.current]?.id); }} className="p-3 bg-black/50 rounded-full text-white pointer-events-auto hover:bg-white/20">
                        <Heart size={24} className={activeNoteRef.current.sentences.find(s => s.id === queue[currentIndexRef.current]?.id)?.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="p-3 bg-black/50 rounded-full text-white pointer-events-auto hover:bg-white/20">
                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Ana Uygulama Bileşeni
 */
const App = () => {
    // State Tanımları
    const [notes, setNotes] = useState([]);
    const [settings, setSettings] = useState({ themeColor: 'green', themeMode: 'light', language: 'tr', pomodoroWork: 25, pomodoroBreak: 5 });
    const [currentView, setCurrentView] = useState('home');
    const [activeNote, setActiveNote] = useState(null);
    
    // Modal Durumları
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    // Form Inputları
    const [titleInput, setTitleInput] = useState('');
    const [contentInput, setContentInput] = useState('');
    
    // Pomodoro ve Diğerleri
    const [pomodoroState, setPomodoroState] = useState('idle'); // idle, work, break
    const [timer, setTimer] = useState(25 * 60);
    const [isImporting, setIsImporting] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Verileri Yükle
    const loadNotes = async () => {
        const list = await databaseOperation('getAll', null, true);
        if (!list.length) {
            // İlk kez açılıyorsa örnek not ekle
            const demoNote = { 
                id: Date.now().toString(), 
                title: translate(settings.language, 'quickStartTitle'), 
                sentences: parseText(translate(settings.language, 'quickStartText')), 
                progress: 0, 
                order: 0 
            };
            await databaseOperation('put', demoNote);
            setNotes([demoNote]);
        } else {
            setNotes(list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
        }
    };

    useEffect(() => {
        loadNotes();
        const savedSettings = localStorage.getItem('sr_settings');
        if (savedSettings) setSettings(JSON.parse(savedSettings));
    }, []);

    // Tema Değişikliği
    useEffect(() => {
        const hue = THEME_HUES[settings.themeColor];
        const isDark = settings.themeMode === 'dark';
        const root = document.documentElement;
        
        root.style.setProperty('--bg', isDark ? `hsl(${hue}, 20%, 6%)` : `hsl(${hue}, 30%, 94%)`);
        root.style.setProperty('--card-bg', isDark ? `hsl(${hue}, 15%, 12%)` : `hsl(${hue}, 25%, 98%)`);
        root.style.setProperty('--text', isDark ? `hsl(${hue}, 10%, 90%)` : `hsl(${hue}, 40%, 10%)`);
        root.style.setProperty('--accent', `hsl(${hue}, 80%, 50%)`);
    }, [settings]);

    // Pomodoro Zamanlayıcı
    useEffect(() => { if (pomodoroState === 'idle') setTimer(settings.pomodoroWork * 60); }, [settings.pomodoroWork, pomodoroState]);
    
    useEffect(() => {
        let interval = null;
        if (pomodoroState !== 'idle' && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        } else if (timer === 0 && pomodoroState !== 'idle') {
            const nextState = pomodoroState === 'work' ? 'break' : 'work';
            setPomodoroState(nextState);
            setTimer(settings[nextState === 'work' ? 'pomodoroWork' : 'pomodoroBreak'] * 60);
            
            // Bildirim sesi
            new Audio(`https://actions.google.com/sounds/v1/alarms/${nextState === 'break' ? 'beep_short' : 'bugle_tune'}.ogg`).play().catch(() => {});
        }
        return () => clearInterval(interval);
    }, [pomodoroState, timer, settings]);

    // Tam Ekran Kontrolü
    useEffect(() => {
        const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFsChange);
        return () => document.removeEventListener('fullscreenchange', handleFsChange);
    }, []);

    // Sürükle Bırak İşlemleri
    const handleDragStart = (e, i) => { setDraggedIndex(i); e.dataTransfer.effectAllowed = "move"; };
    const handleDragEnter = (i) => {
        if (draggedIndex === null || draggedIndex === i) return;
        const copy = [...notes];
        const item = copy[draggedIndex];
        copy.splice(draggedIndex, 1);
        copy.splice(i, 0, item);
        setNotes(copy);
        setDraggedIndex(i);
    };
    const handleDragEnd = () => {
        setDraggedIndex(null);
        notes.forEach((x, i) => { x.order = i; databaseOperation('put', x); });
    };

    // Dosya İçe Aktarma
    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setIsImporting(true);
        try {
            let text = "";
            if (file.type.includes('pdf')) {
                const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
                for (let i = 1; i <= pdf.numPages; i++) {
                    text += (await (await pdf.getPage(i)).getTextContent()).items.map(x => x.str).join(' ') + " ";
                }
            } else if (file.type.includes('word')) {
                text = (await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value;
            } else {
                text = await file.text();
            }

            if (text) {
                setContentInput(prev => prev + (prev ? "\n" : "") + text);
                if (!titleInput) setTitleInput(file.name.split('.')[0]);
            }
        } catch (e) {
            alert(translate(settings.language, 'fileError'));
        } finally {
            setIsImporting(false);
            e.target.value = '';
        }
    };

    // Not Kaydetme
    const saveNote = async () => {
        if (!contentInput.trim()) return;
        const sentences = parseText(contentInput);
        
        if (isEditMode && editId) {
            const index = notes.findIndex(x => x.id === editId);
            if (index !== -1) {
                await databaseOperation('put', { 
                    ...notes[index], 
                    title: titleInput.trim() || 'Untitled', 
                    sentences: sentences, 
                    progress: 0 
                });
            }
        } else {
            await databaseOperation('put', { 
                id: Date.now().toString(), 
                title: titleInput.trim() || 'Untitled', 
                sentences: sentences, 
                progress: 0, 
                order: notes.length 
            });
        }
        await loadNotes();
        setIsAddModalOpen(false);
    };

    // Not Silme
    const deleteNote = async (e, id) => {
        e.stopPropagation();
        if (confirm(translate(settings.language, 'deleteConfirm'))) {
            await databaseOperation('delete', id);
            await loadNotes();
        }
    };

    // Favori İşlemi (Global)
    const toggleFavorite = async (sentenceId) => {
        const noteIndex = notes.findIndex(x => x.sentences.some(s => s.id === sentenceId));
        if (noteIndex !== -1) {
            const updatedNote = { ...notes[noteIndex] };
            const sentenceIndex = updatedNote.sentences.findIndex(s => s.id === sentenceId);
            
            if (sentenceIndex !== -1) {
                updatedNote.sentences[sentenceIndex].isFavorite = !updatedNote.sentences[sentenceIndex].isFavorite;
                await databaseOperation('put', updatedNote);
                
                const newNotes = [...notes];
                newNotes[noteIndex] = updatedNote;
                setNotes(newNotes);

                if (activeNote && activeNote.id === 'temp') {
                    const activeIdx = activeNote.sentences.findIndex(s => s.id === sentenceId);
                    if (activeIdx !== -1) {
                        activeNote.sentences[activeIdx].isFavorite = updatedNote.sentences[sentenceIndex].isFavorite;
                        setActiveNote({ ...activeNote });
                    }
                }
            }
        }
    };

    // İlerleme Kaydetme
    const updateProgress = async (sentenceId, data) => {
        const noteIndex = notes.findIndex(x => x.sentences.some(s => s.id === sentenceId));
        if (noteIndex === -1) return;

        const updatedNote = { ...notes[noteIndex] };
        const sentenceIndex = updatedNote.sentences.findIndex(s => s.id === sentenceId);
        
        if (sentenceIndex !== -1) {
            Object.assign(updatedNote.sentences[sentenceIndex], data);
            
            // Toplam ilerleme yüzdesi (Basit ağırlıklı olmayan cümlelerin oranı)
            const learnedCount = updatedNote.sentences.filter(s => s.weight < 0.5).length;
            updatedNote.progress = (learnedCount / updatedNote.sentences.length) * 100;
            
            await databaseOperation('put', updatedNote);
            
            const newNotes = [...notes];
            newNotes[noteIndex] = updatedNote;
            setNotes(newNotes);
        }
    };

    // Oturum Başlatma (Favoriler veya Tekrar)
    const startSession = (type) => {
        const filteredSentences = type === 'fav' 
            ? notes.flatMap(x => x.sentences.filter(s => s.isFavorite))
            : notes.flatMap(x => x.sentences.filter(s => s.readCount > 0)).sort((a, b) => a.lastRead - b.lastRead);
            
        if (!filteredSentences.length) {
            alert(translate(settings.language, 'no'));
            return;
        }
        setActiveNote({ 
            id: 'temp', 
            title: type === 'fav' ? translate(settings.language, 'fav') : translate(settings.language, 'rev'), 
            sentences: filteredSentences 
        });
        setCurrentView('reader');
    };

    // Yardımcılar
    const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
    const updateSettings = (newSettings) => {
        setSettings(newSettings);
        localStorage.setItem('sr_settings', JSON.stringify(newSettings));
    };

    // İstatistikler
    const getFavCount = () => notes.reduce((acc, note) => acc + note.sentences.filter(s => s.isFavorite).length, 0);
    const getReviewCount = () => notes.reduce((acc, note) => acc + note.sentences.filter(s => s.readCount > 0).length, 0);

    return (
        <div className="h-[100dvh] w-full flex flex-col font-sans transition-colors duration-300 relative overflow-hidden">
            {/* Mola Ekranı */}
            {pomodoroState === 'break' && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
                    <EyeOff size={80} className="text-[var(--accent)] mb-6 animate-pulse" />
                    <h2 className="text-6xl font-black mb-4 text-white font-mono">{formatTime(timer)}</h2>
                    <p className="text-white/60 mb-12 text-xl font-medium">{translate(settings.language, 'break')}</p>
                    <button 
                        onClick={() => { setPomodoroState('work'); setTimer(settings.pomodoroWork * 60); }} 
                        className="px-8 py-4 bg-[var(--accent)] text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all"
                    >
                        {translate(settings.language, 'resume')}
                    </button>
                </div>
            )}

            {currentView === 'reader' && activeNote ? (
                <Reader 
                    note={activeNote} 
                    settings={settings} 
                    onExit={() => { loadNotes(); setCurrentView('home'); setActiveNote(null); }} 
                    onFavorite={toggleFavorite} 
                    isBreakMode={pomodoroState === 'break'} 
                    onProgress={updateProgress} 
                />
            ) : (
                <>
                    {/* Header */}
                    <header className="px-5 py-4 pb-4 pt-[calc(env(safe-area-inset-top)+2.5rem)] flex-none flex justify-between items-center z-50 border-b border-gray-500/10 backdrop-blur-md bg-opacity-80" style={{ backgroundColor: 'var(--bg)' }}>
                        <h1 className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--accent)' }}>{translate(settings.language, 'app')}</h1>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setPomodoroState(pomodoroState === 'idle' ? 'work' : 'idle')} 
                                className={`flex items-center gap-2 px-5 py-2 rounded-full text-lg font-bold font-mono border-2 transition-all active:scale-95 text-[var(--accent)] border-[var(--accent)] bg-[var(--accent)]/10`}
                            >
                                {pomodoroState === 'break' ? <EyeOff size={20} /> : <Eye size={20} />}
                                {formatTime(timer)}
                            </button>
                            <button onClick={() => { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); }} className="p-2 opacity-70 hover:opacity-100">
                                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                            </button>
                            <button onClick={() => setIsSettingsOpen(true)} className="p-2 opacity-70 hover:opacity-100"><Settings size={20} /></button>
                        </div>
                    </header>

                    {/* Dashboard */}
                    <div className="flex-none p-5 pb-0 bg-[var(--bg)] z-40">
                        <h2 className="text-2xl font-bold mb-4 px-1">{translate(settings.language, 'my')}</h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <button onClick={() => startSession('fav')} className="w-full text-left relative p-4 rounded-2xl cursor-pointer group hover:scale-[1.02] transition-transform shadow-sm border border-gray-500/10 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" style={{ backgroundColor: 'var(--card-bg)' }} type="button">
                                <div className="flex justify-between items-start mb-2"><Heart size={24} className="text-red-500 fill-red-500" /><span className="text-2xl font-bold opacity-80">{getFavCount()}</span></div>
                                <div className="font-medium opacity-70">{translate(settings.language, 'fav')}</div>
                            </button>
                            <button onClick={() => startSession('rev')} className="w-full text-left relative p-4 rounded-2xl cursor-pointer group hover:scale-[1.02] transition-transform shadow-sm border border-gray-500/10 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" style={{ backgroundColor: 'var(--card-bg)' }} type="button">
                                <div className="flex justify-between items-start mb-2"><RefreshCcw size={24} className="text-[var(--accent)]" /><span className="text-2xl font-bold opacity-80">{getReviewCount()}</span></div>
                                <div className="font-medium opacity-70">{translate(settings.language, 'rev')}</div>
                            </button>
                        </div>
                        <div className="h-[1px] w-full bg-gray-500/10 mb-2"></div>
                    </div>

                    {/* Not Listesi */}
                    <main className="flex-1 p-5 pt-2 pb-[calc(env(safe-area-inset-bottom)+7rem)] overflow-y-auto no-scrollbar">
                        {!notes.length ? (
                            <div className="flex flex-col items-center justify-center mt-10 opacity-40">
                                <FileText size={64} className="mb-4" />
                                <p>{translate(settings.language, 'no')}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {notes.map((note, i) => (
                                    <div 
                                        key={note.id} 
                                        draggable 
                                        onDragStart={e => handleDragStart(e, i)} 
                                        onDragEnter={() => handleDragEnter(i)} 
                                        onDragEnd={handleDragEnd} 
                                        onClick={() => { setActiveNote(note); setCurrentView('reader'); }} 
                                        className={`relative p-5 rounded-2xl shadow-sm border border-gray-500/5 transition-all cursor-pointer select-none overflow-hidden ${draggedIndex === i ? 'opacity-50 scale-95 ring-2 ring-[var(--accent)]' : 'opacity-100 hover:scale-[1.01]'}`} 
                                        style={{ backgroundColor: 'var(--card-bg)' }}
                                    >
                                        <div className="absolute bottom-0 left-0 h-1 bg-[var(--accent)] transition-all duration-500" style={{ width: `${note.progress}%` }} />
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold mb-1 line-clamp-1">{note.title}</h3>
                                                <div className="flex items-center gap-3 text-xs opacity-60 font-medium">
                                                    <span className="flex items-center gap-1"><BookOpen size={12} />{note.sentences.length} {translate(settings.language, 'sentences')}</span>
                                                    <span className="flex items-center gap-1"><Sparkles size={12} />{Math.round(note.progress)}%</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={e => { e.stopPropagation(); setIsEditMode(true); setEditId(note.id); setTitleInput(note.title); setContentInput(note.sentences.map(s => s.text).join(' ')); setIsAddModalOpen(true); }} 
                                                    className="p-2 text-gray-400 hover:text-[var(--accent)] rounded-full z-10 bg-black/5"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={e => deleteNote(e, note.id)} className="p-2 text-gray-400 hover:text-red-400 rounded-full z-10 bg-black/5"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>

                    {/* Ekle Butonu */}
                    <button 
                        onClick={() => { setIsEditMode(false); setTitleInput(''); setContentInput(''); setIsAddModalOpen(true); }} 
                        className="fixed bottom-8 right-8 mb-[env(safe-area-inset-bottom)] w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 text-white" 
                        style={{ backgroundColor: 'var(--accent)' }}
                    >
                        <Plus size={32} />
                    </button>

                    {/* Ekle/Düzenle Modalı */}
                    {isAddModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
                            <div className="w-[90%] h-[90%] rounded-3xl p-6 shadow-2xl flex flex-col" style={{ backgroundColor: 'var(--card-bg)' }}>
                                <h2 className="text-xl font-bold mb-4">{isEditMode ? translate(settings.language, 'edit') : translate(settings.language, 'new')}</h2>
                                <label className="mb-4 flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-400/30 rounded-xl cursor-pointer hover:bg-black/5 gap-2 text-sm font-medium opacity-70">
                                    {isImporting ? <div className="loader" /> : <FileUp size={18} />}
                                    {isImporting ? translate(settings.language, 'importing') : translate(settings.language, 'importFile')}
                                    <input type="file" className="hidden" accept=".txt,.md,.pdf,.docx" onChange={handleFileSelect} disabled={isImporting} />
                                </label>
                                <input 
                                    type="text" 
                                    placeholder={translate(settings.language, 'title')} 
                                    className="w-full bg-black/5 border border-black/10 rounded-xl p-4 mb-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" 
                                    value={titleInput} 
                                    onChange={e => setTitleInput(e.target.value)} 
                                />
                                <textarea 
                                    placeholder={translate(settings.language, 'content')} 
                                    className="w-full flex-1 min-h-[150px] bg-black/5 border border-black/10 rounded-xl p-4 mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" 
                                    value={contentInput} 
                                    onChange={e => setContentInput(e.target.value)} 
                                />
                                <div className="flex gap-3">
                                    <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 opacity-60 hover:opacity-100">{translate(settings.language, 'cancel')}</button>
                                    <button onClick={saveNote} className="flex-1 py-3 rounded-xl font-bold text-white hover:opacity-90" style={{ backgroundColor: 'var(--accent)' }}>
                                        {isEditMode ? translate(settings.language, 'update') : translate(settings.language, 'save')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Ayarlar Modalı */}
                    {isSettingsOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                            <div className="w-full max-w-sm rounded-3xl p-6 shadow-2xl" style={{ backgroundColor: 'var(--card-bg)' }}>
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Settings size={20} />{translate(settings.language, 'settings')}</h2>
                                
                                <div className="mb-6">
                                    <label className="text-xs font-bold uppercase opacity-50 mb-2 block">{translate(settings.language, 'theme')}</label>
                                    <div className="grid grid-cols-6 gap-2">
                                        {Object.keys(THEME_HUES).map(color => (
                                            <button 
                                                key={color} 
                                                onClick={() => updateSettings({ ...settings, themeColor: color })} 
                                                className={`w-8 h-8 rounded-full border-2 ${settings.themeColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50'}`} 
                                                style={{ backgroundColor: `hsl(${THEME_HUES[color]}, 80%, 50%)` }} 
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="text-xs font-bold uppercase opacity-50 mb-2 block">{translate(settings.language, 'appearance')}</label>
                                    <div className="flex bg-black/10 rounded-lg p-1">
                                        <button onClick={() => updateSettings({ ...settings, themeMode: 'light' })} className={`flex-1 py-2 rounded-md flex justify-center ${settings.themeMode === 'light' ? 'bg-white shadow text-black' : 'opacity-50'}`}><Sun size={16} /></button>
                                        <button onClick={() => updateSettings({ ...settings, themeMode: 'dark' })} className={`flex-1 py-2 rounded-md flex justify-center ${settings.themeMode === 'dark' ? 'bg-black shadow text-white' : 'opacity-50'}`}><Moon size={16} /></button>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="text-xs font-bold uppercase opacity-50 mb-2 block">{translate(settings.language, 'language')}</label>
                                    <div className="flex bg-black/10 rounded-lg p-1">
                                        <button onClick={() => updateSettings({ ...settings, language: 'tr' })} className={`flex-1 py-2 rounded-md flex justify-center text-xs font-bold ${settings.language === 'tr' ? 'bg-white shadow text-black' : 'opacity-50'}`}>TÜRKÇE</button>
                                        <button onClick={() => updateSettings({ ...settings, language: 'en' })} className={`flex-1 py-2 rounded-md flex justify-center text-xs font-bold ${settings.language === 'en' ? 'bg-white shadow text-black' : 'opacity-50'}`}>ENGLISH</button>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="text-xs font-bold uppercase opacity-50 mb-2 block">{translate(settings.language, 'pomodoro')}</label>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <span className="text-xs">{translate(settings.language, 'focus')}</span>
                                            <input type="number" value={settings.pomodoroWork} onChange={e => updateSettings({ ...settings, pomodoroWork: parseInt(e.target.value) })} className="w-full bg-black/5 rounded p-2 mt-1" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-xs">{translate(settings.language, 'break')}</span>
                                            <input type="number" value={settings.pomodoroBreak} onChange={e => updateSettings({ ...settings, pomodoroBreak: parseInt(e.target.value) })} className="w-full bg-black/5 rounded p-2 mt-1" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-6 border-t border-black/10 pt-4">
                                    <button 
                                        onClick={() => databaseOperation('getAll', null, true).then(d => { 
                                            const a = document.createElement('a'); 
                                            a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(d)); 
                                            a.download = "backup.json"; 
                                            a.click(); 
                                        })} 
                                        className="flex-1 py-3 bg-black/5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 hover:bg-black/10"
                                    >
                                        <Download size={14} />{translate(settings.language, 'backup')}
                                    </button>
                                    <label className="flex-1 py-3 bg-black/5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 hover:bg-black/10 cursor-pointer">
                                        <Upload size={14} />{translate(settings.language, 'restore')}
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept=".json" 
                                            onChange={e => {
                                                const f = e.target.files[0];
                                                if (f) {
                                                    const r = new FileReader();
                                                    r.onload = async ev => {
                                                        try {
                                                            const d = JSON.parse(ev.target.result);
                                                            if (Array.isArray(d)) {
                                                                const current = await databaseOperation('getAll', null, true);
                                                                const ids = new Set(current.map(x => x.id));
                                                                for (const x of d) if (!ids.has(x.id)) await databaseOperation('put', x);
                                                                loadNotes();
                                                                alert(translate(settings.language, 'restored'));
                                                            }
                                                        } catch { alert(translate(settings.language, 'error')); }
                                                    };
                                                    r.readAsText(f);
                                                    e.target.value = '';
                                                }
                                            }} 
                                        />
                                    </label>
                                </div>
                                <button onClick={() => setIsSettingsOpen(false)} className="w-full mt-4 py-3 rounded-xl bg-[var(--accent)] text-white font-bold">{translate(settings.language, 'done')}</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);