import React, { useState, useEffect, useRef, useCallback } from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import { Plus, Trash2, Upload, Download, FileText, Sparkles, Heart, Settings, Sun, Moon, Edit2, RefreshCcw, RefreshCw, Eye, EyeOff, X, Play, Volume2, VolumeX, FileUp, BookOpen, Maximize, Minimize } from 'https://esm.sh/lucide-react@0.292.0';

const t = (l, k) => ({ tr: { app: "Akıllı Okuma", my: "Notlarım", fav: "Favoriler", rev: "Tekrar", no: "Not yok.", edit: "Düzenle", new: "Yeni Not", ti: "Başlık", co: "İçerik...", can: "İptal", sv: "Kaydet", up: "Güncelle", set: "Ayarlar", col: "Tema", appr: "Görünüm", lng: "Dil", pom: "Pomodoro", wk: "Odak", br: "Mola", bk: "Yedekle", rs: "Geri Yükle", dn: "Tamam", del: "Silinsin mi?", ps: "Duraklatıldı", res: "Devam Et", se: "Kaydet & Çık", sh: "Notlar karıştırılıyor...", emp: "Boş not.", welT: "Hızlı Başlangıç", wel: "Ekrana çift tıkla favorile. Basılı tut duraklat. İki parmakla yazı boyutu ayarla. Biyonik okuma ve seslendirme aktiftir. Sağ üstteki ses butonu ile okumayı açabilirsiniz.", rst: "Yüklendi!", err: "Hata", imp: "Dosya Al", impg: "Aktarılıyor...", fer: "Dosya hatası", snt: "Cümle" }, en: { app: "Smart Reading", my: "My Notes", fav: "Favorites", rev: "Review", no: "No notes.", edit: "Edit", new: "New Note", ti: "Title", co: "Content...", can: "Cancel", sv: "Save", up: "Update", set: "Settings", col: "Theme", appr: "Appearance", lng: "Language", pom: "Pomodoro", wk: "Focus", br: "Break", bk: "Backup", rs: "Restore", dn: "Done", del: "Delete?", ps: "Paused", res: "Resume", se: "Save & Exit", sh: "Shuffling...", emp: "Empty.", welT: "Quick Start", wel: "Double tap to favorite. Long press to pause. Pinch for font size. Bionic reading and TTS enabled. Toggle sound with the top right button.", rst: "Restored!", err: "Error", imp: "Import File", impg: "Importing...", fer: "File error", snt: "Sentences" } })[l][k] || "";

const parseText = (x) => {
    const r = x.replace(/\n/g, ' ').split(/([.?!])\s+(?=[A-ZİĞÜŞÖÇ])/g);
    const s = [];
    let b = "", id = Date.now();
    const ab = ['Dr', 'Av', 'Prof', 'St', 'Alb', 'Yrd', 'Doç', 'Müh', 'vb', 'vs', 'bkz', 'min', 'max', 'No', 'Tel', 'Hz', 'Tic', 'Ltd', 'Şti', 'Inc'];
    const add = (t) => {
        const tr = t.trim();
        if (tr) s.push({ id: id++, text: tr, wc: tr.split(/\s+/).length, weight: 1, isFavorite: false, lastRead: 0, readCount: 0, history: [] })
    };
    for (let i = 0; i < r.length; i++) {
        const p = r[i];
        if (!p) continue;
        if (p.match(/^[.?!]$/)) {
            b += p;
            const t = b.trim().split(/\s+/);
            const l = t.length > 0 ? t[t.length - 1].replace(/[.?!]/g, '') : '';
            if (ab.includes(l)) b += " ";
            else { add(b); b = "" }
        } else b += p
    }
    if (b.trim()) add(b);
    return s;
};

const genPat = (hue) => {
    const c = document.createElement('canvas'), x = c.getContext('2d');
    c.width = 800; c.height = 1600;
    if (!x) return '';
    x.fillStyle = `hsl(${hue},30%,10%)`;
    x.fillRect(0, 0, 800, 1600);
    for (let i = 0; i < 20; i++) {
        x.fillStyle = `hsla(${(hue + Math.random() * 60 - 30) % 360},60%,50%,${Math.random() * .15 + .05})`;
        const t = Math.random(), a = Math.random() * 800, b = Math.random() * 1600, s = Math.random() * 150 + 30;
        x.beginPath();
        if (t < .4) x.arc(a, b, s, 0, Math.PI * 2);
        else if (t < .8) x.rect(a - s / 2, b - s / 2, s, s);
        else { x.moveTo(a, b - s); x.lineTo(a + s, b + s); x.lineTo(a - s, b + s) }
        x.fill()
    }
    return c.toDataURL('image/jpeg', .6)
};

const bionic = (t) => {
    return t.split(' ').map(w => {
        if (w.length < 2 || w.startsWith('\\')) return w;
        const m = Math.ceil(w.length / 2);
        return `<b>${w.slice(0, m)}</b>${w.slice(m)}`
    }).join(' ')
};

const procDisp = (t) => {
    let h = t;
    if (window.katex) {
        try {
            h = h.replace(/\$\$([\s\S]+?)\$\$/g, (m, c) => window.katex.renderToString(c, { displayMode: true }))
                .replace(/\\\[([\s\S]+?)\\\]/g, (m, c) => window.katex.renderToString(c, { displayMode: true }))
                .replace(/\\\(([\s\S]+?)\\\)/g, (m, c) => window.katex.renderToString(c, { displayMode: false }))
                .replace(/\$([^$]+?)\$/g, (m, c) => window.katex.renderToString(c, { displayMode: false }))
        } catch (e) { }
    }
    const d = document.createElement('div');
    d.innerHTML = h;
    const w = (n) => {
        if (n.nodeType === 3) n.parentNode.innerHTML = n.parentNode.innerHTML.replace(n.nodeValue, bionic(n.nodeValue));
        else if (n.nodeType === 1 && !n.className.includes('katex')) n.childNodes.forEach(w)
    };
    w(d);
    return d.innerHTML
};

const calcMast = (s, d, h) => {
    const a = [...h.map(x => x.ms), d], m = a.reduce((x, y) => x + y, 0) / a.length;
    if (a.length < 3) return { w: 1, bs: m, o: false };
    const v = a.reduce((x, y) => x + Math.pow(y - m, 2), 0) / a.length, sd = Math.sqrt(v), vt = sd === 0 ? a : a.filter(t => Math.abs(t - m) <= 2 * sd), nbs = vt.reduce((x, y) => x + y, 0) / vt.length;
    if (sd > 0 && Math.abs(d - m) > 2 * sd) return { w: s.weight, bs: nbs, o: true };
    let nw = (s.weight || 1) * Math.pow(d / nbs, 1.5);
    return { w: Math.max(1e-4, Math.min(nw, 5)), bs: nbs, o: false }
};

const genQ = (n, c, ex) => {
    const q = [], p = n.sentences;
    if (!p || !p.length) return [];
    if (p.length === 1) { for (let i = 0; i < c; i++) q.push({ ...p[0] }); return q }
    for (let i = 0; i < c; i++) {
        let tw = p.reduce((a, s) => a + s.weight, 0), r = Math.random() * tw, sel = null;
        for (const s of p) { r -= s.weight; if (r <= 0) { sel = s; break } }
        if (!sel) sel = p[p.length - 1];
        if (ex !== undefined && i === 0 && sel.id === ex || q.length && q[q.length - 1].id === sel.id) { i--; continue }
        q.push({ ...sel })
    }
    return q
};

const hues = { blue: 217, green: 142, purple: 270, orange: 24, red: 0, pink: 330, cyan: 189, teal: 173, indigo: 239, yellow: 48, lime: 84, monochrome: 0 };

const dbOp = (m, a, v) => {
    return new Promise((r, j) => {
        const q = indexedDB.open('SR_DB', 1);
        q.onupgradeneeded = e => e.target.result.createObjectStore('notes', { keyPath: 'id' });
        q.onsuccess = e => {
            const t = e.target.result.transaction('notes', 'readwrite').objectStore('notes')[m](a ? a : undefined);
            t.onsuccess = e => r(v ? e.target.result : undefined);
            t.onerror = e => j(e)
        }
    })
};

const Reader = ({ note, st, exit, fav, brk, onProg }) => {
    const [q, sq] = useState([]), [bg, sbg] = useState([]), [hc, shc] = useState([]), [fs, sfs] = useState(1.8), [pau, spau] = useState(false), [mute, smute] = useState(true), [fa, sfa] = useState(null), [sc, ssc] = useState(false);
    const cr = useRef(null), an = useRef(note), stt = useRef(0), ci = useRef(0), obs = useRef(null), ld = useRef(false), mt = useRef(null), br = useRef(brk), lp = useRef(null), ts = useRef(null), pd = useRef(null), ifs = useRef(1.8), speech = useRef(window.speechSynthesis);
    const speak = (txt) => { if (!txt) return; speech.current.cancel(); if (mute || br.current || pau || ld.current) return; const u = new SpeechSynthesisUtterance(txt); u.lang = st.language === 'tr' ? 'tr-TR' : 'en-US'; u.rate = 1.1; speech.current.speak(u) };
    useEffect(() => { br.current = brk; if (brk || pau) speech.current.cancel(); else if (!mute && q[ci.current]) speak(q[ci.current].text) }, [brk, pau]);
    useEffect(() => { if (mute) speech.current.cancel(); else if (q[ci.current]) speak(q[ci.current].text) }, [mute]);
    useEffect(() => { an.current = note }, [note]);
    useEffect(() => {
        window.history.pushState(null, '', window.location.href); window.onpopstate = () => { if (br.current) window.history.pushState(null, '', window.location.href); else exit() };
        let iq = note.sentences.map(s => ({ ...s }));
        if (!iq.length) iq = [{ id: 0, text: t(st.language, 'emp'), wc: 0, weight: 1, isFavorite: false, history: [] }];
        sq(iq); sbg(iq.map(() => genPat(Math.random() * 360))); shc(iq.map(s => procDisp(s.text))); stt.current = Date.now();
        const last = note.sentences.reduce((p, c, i) => c.lastRead > p.t ? { t: c.lastRead, i } : p, { t: 0, i: 0 }); if (last.i > 0) setTimeout(() => { const e = document.querySelector(`[data-index="${last.i}"]`); if (e) e.scrollIntoView({ block: "center" }) }, 100);
        return () => { speech.current.cancel(); window.onpopstate = null; if (mt.current) clearTimeout(mt.current) }
    }, []);
    const fin = useCallback((idx) => {
        if (pau || br.current) return; const dur = Date.now() - stt.current, si = q[idx]; if (!si || dur < Math.max(500, (si.wc || 1) * 150)) return;
        const cn = an.current, ri = cn.sentences.findIndex(s => s.id === si.id);
        if (ri !== -1) {
            const rs = cn.sentences[ri], { w, bs, o } = calcMast(rs, Math.min(dur, 3e4), rs.history);
            const up = { baseSpeed: bs, weight: o ? rs.weight : w, lastRead: Date.now(), readCount: (rs.readCount || 0) + 1, history: [...rs.history, { ms: Math.min(dur, 3e4) }] };
            Object.assign(rs, up); onProg(si.id, up);
        }
    }, [q, pau, onProg]);
    useEffect(() => {
        if (!q.length) return; obs.current?.disconnect();
        obs.current = new IntersectionObserver(e => {
            e.forEach(x => {
                if (x.isIntersecting) {
                    const i = parseInt(x.target.dataset.index || '0');
                    if (i !== ci.current) {
                        fin(ci.current); ci.current = i; stt.current = Date.now();
                        if (!ld.current && !mute) speak(q[i].text);
                        if (i >= q.length - 3 && !ld.current) {
                            ld.current = true;
                            const nb = genQ(an.current, 5, q[q.length - 1].id);
                            sq(p => [...p, ...nb]); sbg(p => [...p, ...nb.map(() => genPat(Math.random() * 360))]); shc(p => [...p, ...nb.map(s => procDisp(s.text))]);
                            setTimeout(() => ld.current = false, 200);
                        }
                    }
                }
            })
        }, { root: cr.current, threshold: .6 });
        document.querySelectorAll('.rc').forEach(c => obs.current.observe(c)); return () => obs.current?.disconnect()
    }, [q, fin, mute]);
    const dTap = (id) => { if (brk) return; const s = an.current.sentences.find(i => i.id === id), wf = s ? s.isFavorite : false; fav(id); sfa(wf ? 'remove' : 'add'); setTimeout(() => sfa(null), 800) };
    return (
        <div className="relative w-full h-[100dvh] bg-black select-none overflow-hidden" onMouseMove={() => { ssc(true); clearTimeout(mt.current); mt.current = setTimeout(() => ssc(false), 3000) }} onTouchStart={e => { if (!brk) { if (e.touches.length === 1) { ts.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; lp.current = setTimeout(() => spau(true), 500) } else if (e.touches.length === 2) { ifs.current = fs; pd.current = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY) } } }} onTouchMove={e => { if (!brk) { if (e.touches.length === 1 && ts.current && Math.hypot(e.touches[0].clientX - ts.current.x, e.touches[0].clientY - ts.current.y) > 10) clearTimeout(lp.current); if (e.touches.length === 2 && pd.current) { e.preventDefault(); sfs(Math.max(1, Math.min(5, ifs.current * (Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY) / pd.current)))) } } }} onTouchEnd={() => { clearTimeout(lp.current); ts.current = null; pd.current = null }}>
            {fa && <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"><Heart size={120} className={fa === 'add' ? "text-red-500 fill-red-500 animate-bounce" : "text-white opacity-80 animate-pulse"} /></div>}
            <div ref={cr} className={`w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth ${(pau || brk) ? 'overflow-hidden pointer-events-none' : ''}`}>
                {q.map((s, i) => { const m = an.current.sentences.find(x => x.id === s.id)?.weight < .5; return (<div key={`${s.id}-${i}`} data-index={i} className={`rc w-full h-full snap-start snap-always relative flex items-center justify-center overflow-hidden transition-all duration-500`} onDoubleClick={e => { e.stopPropagation(); dTap(s.id) }}><div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bg[i]})` }} /><div className="absolute inset-0 bg-black/30 pointer-events-none" />{m && <div className="absolute top-6 right-6 text-green-400 opacity-80 animate-fade-in"><Sparkles size={24} fill="currentColor" /></div>}<div className="relative z-10 w-[85%] text-center pointer-events-none"><p className="font-medium text-white leading-relaxed drop-shadow-lg" style={{ fontSize: `${fs}rem`, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }} dangerouslySetInnerHTML={{ __html: hc[i] || s.text }} /></div></div>) })}
                <div className="h-[1px] w-full snap-start"></div>
            </div>
            {pau && <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 animate-in fade-in"><div className="bg-[#222] border border-white/10 p-8 rounded-2xl shadow-2xl text-center min-w-[300px]"><h2 className="text-2xl font-bold mb-6 text-white">{t(st.language, 'ps')}</h2><div className="flex flex-col gap-3"><button onClick={() => { spau(false); stt.current = Date.now(); if (!mute && q[ci.current]) speak(q[ci.current].text) }} className="w-full bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Play size={20} fill="currentColor" />{t(st.language, 'res')}</button><button onClick={() => { fin(ci.current); exit() }} className="w-full bg-red-500/20 text-red-500 border border-red-500/50 py-3 rounded-xl font-bold flex items-center justify-center gap-2"><X size={20} />{t(st.language, 'se')}</button></div></div></div>}
            <div className={`absolute top-0 right-0 p-4 pt-[calc(env(safe-area-inset-top)+3.5rem)] transition-opacity duration-300 ${sc && !pau && !brk ? 'opacity-100' : 'opacity-0'} pointer-events-none`}><div className="flex flex-col items-end gap-2"><button onClick={() => { fin(ci.current); exit() }} className="p-3 bg-black/50 rounded-full text-white pointer-events-auto hover:bg-white/20"><X size={24} /></button><button onClick={e => { e.stopPropagation(); dTap(q[ci.current]?.id) }} className="p-3 bg-black/50 rounded-full text-white pointer-events-auto hover:bg-white/20"><Heart size={24} className={an.current.sentences.find(s => s.id === q[ci.current]?.id)?.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'} /></button><button onClick={(e) => { e.stopPropagation(); smute(!mute) }} className="p-3 bg-black/50 rounded-full text-white pointer-events-auto hover:bg-white/20">{mute ? <VolumeX size={24} /> : <Volume2 size={24} />}</button></div></div>
        </div>
    )
};

const App = () => {
    const [n, sn] = useState([]), [st, sst] = useState({ themeColor: 'green', themeMode: 'light', language: 'tr', pomodoroWork: 25, pomodoroBreak: 5 }), [v, sv] = useState('home'), [an, san] = useState(null), [add, sadd] = useState(false), [edt, sedt] = useState(false), [eid, seid] = useState(null), [set, sset] = useState(false), [ti, sti] = useState(''), [ct, sct] = useState(''), [ps, sps] = useState('idle'), [tm, stm] = useState(25 * 60), [imp, simp] = useState(false), [drag, sdrag] = useState(null), [isf, sisf] = useState(false);
    const ln = async () => { const l = await dbOp('getAll', null, true); if (!l.length) { const d = { id: Date.now().toString(), title: t(st.language, 'welT'), sentences: parseText(t(st.language, 'wel')), progress: 0, order: 0 }; await dbOp('put', d); sn([d]) } else sn(l.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))) };
    useEffect(() => { ln(); const s = localStorage.getItem('sr_s'); if (s) sst(JSON.parse(s)) }, []);
    useEffect(() => { const h = hues[st.themeColor], dk = st.themeMode === 'dark', r = document.documentElement; r.style.setProperty('--bg', dk ? `hsl(${h},20%,6%)` : `hsl(${h},30%,94%)`); r.style.setProperty('--cd', dk ? `hsl(${h},15%,12%)` : `hsl(${h},25%,98%)`); r.style.setProperty('--tx', dk ? `hsl(${h},10%,90%)` : `hsl(${h},40%,10%)`); r.style.setProperty('--acc', `hsl(${h},80%,50%)`) }, [st]);
    useEffect(() => { if (ps === 'idle') stm(st.pomodoroWork * 60) }, [st.pomodoroWork, ps]);
    useEffect(() => { let i = null; if (ps !== 'idle' && tm > 0) i = setInterval(() => stm(t => t - 1), 1e3); else if (tm === 0 && ps !== 'idle') { const nx = ps === 'work' ? 'break' : 'work'; sps(nx); stm(st[nx === 'work' ? 'pomodoroWork' : 'pomodoroBreak'] * 60); new Audio(`https://actions.google.com/sounds/v1/alarms/${nx === 'break' ? 'beep_short' : 'bugle_tune'}.ogg`).play().catch(() => { }) } return () => clearInterval(i) }, [ps, tm, st]);
    useEffect(() => { const h = () => sisf(!!document.fullscreenElement); document.addEventListener('fullscreenchange', h); return () => document.removeEventListener('fullscreenchange', h) }, []);
    const dStart = (e, i) => { sdrag(i); e.dataTransfer.effectAllowed = "move" }; const dEnter = (i) => { if (drag === null || drag === i) return; const c = [...n], mv = c[drag]; c.splice(drag, 1); c.splice(i, 0, mv); sn(c); sdrag(i) }; const dEnd = () => { sdrag(null); n.forEach((x, i) => { x.order = i; dbOp('put', x) }) };
    const fSel = async (e) => { const f = e.target.files[0]; if (!f) return; simp(true); try { let txt = ""; if (f.type.includes('pdf')) { const p = await pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise; for (let i = 1; i <= p.numPages; i++) txt += (await (await p.getPage(i)).getTextContent()).items.map(x => x.str).join(' ') + " " } else if (f.type.includes('word')) { txt = (await mammoth.extractRawText({ arrayBuffer: await f.arrayBuffer() })).value } else txt = await f.text(); if (txt) { sct(p => p + (p ? "\n" : "") + txt); if (!ti) sti(f.name.split('.')[0]) } } catch (e) { alert(t(st.language, 'fer')) } finally { simp(false); e.target.value = '' } };
    const save = async () => { if (!ct.trim()) return; const s = parseText(ct); if (edt && eid) { const i = n.findIndex(x => x.id === eid); if (i !== -1) await dbOp('put', { ...n[i], title: ti.trim() || 'Untitled', sentences: s, progress: 0 }) } else await dbOp('put', { id: Date.now().toString(), title: ti.trim() || 'Untitled', sentences: s, progress: 0, order: n.length }); await ln(); sadd(false) };
    const del = async (e, id) => { e.stopPropagation(); if (confirm(t(st.language, 'del'))) { await dbOp('delete', id); await ln() } };
    const fav = async (sid) => { const ni = n.findIndex(x => x.sentences.some(s => s.id === sid)); if (ni !== -1) { const nt = { ...n[ni] }, si = nt.sentences.findIndex(s => s.id === sid); if (si !== -1) { nt.sentences[si].isFavorite = !nt.sentences[si].isFavorite; await dbOp('put', nt); const nn = [...n]; nn[ni] = nt; sn(nn); if (an && an.id === 'tmp') { const u = an.sentences.findIndex(s => s.id === sid); if (u !== -1) { an.sentences[u].isFavorite = nt.sentences[si].isFavorite; san({ ...an }) } } } } };
    const upPr = async (sid, d) => { const ni = n.findIndex(x => x.sentences.some(s => s.id === sid)); if (ni === -1) return; const nt = { ...n[ni] }, si = nt.sentences.findIndex(s => s.id === sid); if (si !== -1) { Object.assign(nt.sentences[si], d); nt.progress = (nt.sentences.filter(s => s.weight < .5).length / nt.sentences.length) * 100; await dbOp('put', nt); const nn = [...n]; nn[ni] = nt; sn(nn) } };
    const ses = (typ) => { const s = typ === 'f' ? n.flatMap(x => x.sentences.filter(s => s.isFavorite)) : n.flatMap(x => x.sentences.filter(s => s.readCount > 0)).sort((a, b) => a.lastRead - b.lastRead); if (!s.length) { alert(t(st.language, 'no')); return } san({ id: 'tmp', title: typ === 'f' ? t(st.language, 'fav') : t(st.language, 'rev'), sentences: s }); sv('reader') };
    const ft = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`; const ss = (ns) => { sst(ns); localStorage.setItem('sr_s', JSON.stringify(ns)) };
    const getFavC = () => n.reduce((a, b) => a + b.sentences.filter(s => s.isFavorite).length, 0);
    const getRevC = () => n.reduce((a, b) => a + b.sentences.filter(s => s.readCount > 0).length, 0);
    return (
        <div className="h-[100dvh] w-full flex flex-col font-sans transition-colors duration-300 relative overflow-hidden">
            {ps === 'break' && <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 animate-in fade-in"><EyeOff size={80} className="text-[var(--acc)] mb-6 animate-pulse" /><h2 className="text-6xl font-black mb-4 text-white font-mono">{ft(tm)}</h2><p className="text-white/60 mb-12 text-xl font-medium">{t(st.language, 'br')}</p><button onClick={() => { sps('work'); stm(st.pomodoroWork * 60) }} className="px-8 py-4 bg-[var(--acc)] text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all">{t(st.language, 'res')}</button></div>}
            {v === 'reader' && an ? <Reader note={an} st={st} exit={() => { ln(); sv('home'); san(null) }} fav={fav} brk={ps === 'break'} onProg={upPr} /> : <>
                <header className="px-5 py-4 pb-4 pt-[calc(env(safe-area-inset-top)+2.5rem)] flex-none flex justify-between items-center z-50 border-b border-gray-500/10 backdrop-blur-md bg-opacity-80" style={{ backgroundColor: 'var(--bg)' }}><h1 className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--acc)' }}>{t(st.language, 'app')}</h1><div className="flex items-center gap-3"><button onClick={() => sps(ps === 'idle' ? 'work' : 'idle')} className={`flex items-center gap-2 px-5 py-2 rounded-full text-lg font-bold font-mono border-2 transition-all active:scale-95 text-[var(--acc)] border-[var(--acc)] bg-[var(--acc)]/10`}>{ps === 'break' ? <EyeOff size={20} /> : <Eye size={20} />}{ft(tm)}</button><button onClick={() => { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen() }} className="p-2 opacity-70 hover:opacity-100">{isf ? <Minimize size={20} /> : <Maximize size={20} />}</button><button onClick={() => sset(true)} className="p-2 opacity-70 hover:opacity-100"><Settings size={20} /></button></div></header>
                <div className="flex-none p-5 pb-0 bg-[var(--bg)] z-40">
                    <h2 className="text-2xl font-bold mb-4 px-1">{t(st.language, 'my')}</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div onClick={() => ses('f')} className="relative p-4 rounded-2xl cursor-pointer group hover:scale-[1.02] transition-transform shadow-sm border border-gray-500/10" style={{ backgroundColor: 'var(--cd)' }}><div className="flex justify-between items-start mb-2"><Heart size={24} className="text-red-500 fill-red-500" /><span className="text-2xl font-bold opacity-80">{getFavC()}</span></div><div className="font-medium opacity-70">{t(st.language, 'fav')}</div></div>
                        <div onClick={() => ses('r')} className="relative p-4 rounded-2xl cursor-pointer group hover:scale-[1.02] transition-transform shadow-sm border border-gray-500/10" style={{ backgroundColor: 'var(--cd)' }}><div className="flex justify-between items-start mb-2"><RefreshCcw size={24} className="text-[var(--acc)]" /><span className="text-2xl font-bold opacity-80">{getRevC()}</span></div><div className="font-medium opacity-70">{t(st.language, 'rev')}</div></div>
                    </div>
                    <div className="h-[1px] w-full bg-gray-500/10 mb-2"></div>
                </div>
                <main className="flex-1 p-5 pt-2 pb-[calc(env(safe-area-inset-bottom)+7rem)] overflow-y-auto no-scrollbar">
                    {!n.length ? (<div className="flex flex-col items-center justify-center mt-10 opacity-40"><FileText size={64} className="mb-4" /><p>{t(st.language, 'no')}</p></div>) : (<div className="space-y-4">{n.map((x, i) => (<div key={x.id} draggable onDragStart={e => dStart(e, i)} onDragEnter={() => dEnter(i)} onDragEnd={dEnd} onClick={() => { san(x); sv('reader') }} className={`relative p-5 rounded-2xl shadow-sm border border-gray-500/5 transition-all cursor-pointer select-none overflow-hidden ${drag === i ? 'opacity-50 scale-95 ring-2 ring-[var(--acc)]' : 'opacity-100 hover:scale-[1.01]'}`} style={{ backgroundColor: 'var(--cd)' }}><div className="absolute bottom-0 left-0 h-1 bg-[var(--acc)] transition-all duration-500" style={{ width: `${x.progress}%` }} /><div className="flex justify-between items-start"><div className="flex-1"><h3 className="text-lg font-bold mb-1 line-clamp-1">{x.title}</h3><div className="flex items-center gap-3 text-xs opacity-60 font-medium"><span className="flex items-center gap-1"><BookOpen size={12} />{x.sentences.length} {t(st.language, 'snt')}</span><span className="flex items-center gap-1"><Sparkles size={12} />{Math.round(x.progress)}%</span></div></div><div className="flex gap-2"><button onClick={e => { e.stopPropagation(); sedt(true); seid(x.id); sti(x.title); sct(x.sentences.map(s => s.text).join(' ')); sadd(true) }} className="p-2 text-gray-400 hover:text-[var(--acc)] rounded-full z-10 bg-black/5"><Edit2 size={16} /></button><button onClick={e => del(e, x.id)} className="p-2 text-gray-400 hover:text-red-400 rounded-full z-10 bg-black/5"><Trash2 size={16} /></button></div></div></div>))}</div>)}
                </main>
                <button onClick={() => { sedt(false); sti(''); sct(''); sadd(true) }} className="fixed bottom-8 right-8 mb-[env(safe-area-inset-bottom)] w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 text-white" style={{ backgroundColor: 'var(--acc)' }}><Plus size={32} /></button>
                {add && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"><div className="w-[90%] h-[90%] rounded-3xl p-6 shadow-2xl flex flex-col" style={{ backgroundColor: 'var(--cd)' }}><h2 className="text-xl font-bold mb-4">{edt ? t(st.language, 'edit') : t(st.language, 'new')}</h2><label className="mb-4 flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-400/30 rounded-xl cursor-pointer hover:bg-black/5 gap-2 text-sm font-medium opacity-70">{imp ? <div className="loader" /> : <FileUp size={18} />}{imp ? t(st.language, 'impg') : t(st.language, 'imp')}<input type="file" className="hidden" accept=".txt,.md,.pdf,.docx" onChange={fSel} disabled={imp} /></label><input type="text" placeholder={t(st.language, 'ti')} className="w-full bg-black/5 border border-black/10 rounded-xl p-4 mb-3 focus:outline-none focus:ring-2 focus:ring-[var(--acc)]" value={ti} onChange={e => sti(e.target.value)} /><textarea placeholder={t(st.language, 'co')} className="w-full flex-1 min-h-[150px] bg-black/5 border border-black/10 rounded-xl p-4 mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--acc)]" value={ct} onChange={e => sct(e.target.value)} /><div className="flex gap-3"><button onClick={() => sadd(false)} className="flex-1 py-3 opacity-60 hover:opacity-100">{t(st.language, 'can')}</button><button onClick={save} className="flex-1 py-3 rounded-xl font-bold text-white hover:opacity-90" style={{ backgroundColor: 'var(--acc)' }}>{edt ? t(st.language, 'up') : t(st.language, 'sv')}</button></div></div></div>)}
                {set && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"><div className="w-full max-w-sm rounded-3xl p-6 shadow-2xl" style={{ backgroundColor: 'var(--cd)' }}><h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Settings size={20} />{t(st.language, 'set')}</h2><div className="mb-6"><label className="text-xs font-bold uppercase opacity-50 mb-2 block">{t(st.language, 'col')}</label><div className="grid grid-cols-6 gap-2">{Object.keys(hues).map(c => (<button key={c} onClick={() => ss({ ...st, themeColor: c })} className={`w-8 h-8 rounded-full border-2 ${st.themeColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50'}`} style={{ backgroundColor: `hsl(${hues[c]},80%,50%)` }} />))}</div></div><div className="mb-6"><label className="text-xs font-bold uppercase opacity-50 mb-2 block">{t(st.language, 'appr')}</label><div className="flex bg-black/10 rounded-lg p-1"><button onClick={() => ss({ ...st, themeMode: 'light' })} className={`flex-1 py-2 rounded-md flex justify-center ${st.themeMode === 'light' ? 'bg-white shadow text-black' : 'opacity-50'}`}><Sun size={16} /></button><button onClick={() => ss({ ...st, themeMode: 'dark' })} className={`flex-1 py-2 rounded-md flex justify-center ${st.themeMode === 'dark' ? 'bg-black shadow text-white' : 'opacity-50'}`}><Moon size={16} /></button></div></div><div className="mb-6"><label className="text-xs font-bold uppercase opacity-50 mb-2 block">{t(st.language, 'lng')}</label><div className="flex bg-black/10 rounded-lg p-1"><button onClick={() => ss({ ...st, language: 'tr' })} className={`flex-1 py-2 rounded-md flex justify-center text-xs font-bold ${st.language === 'tr' ? 'bg-white shadow text-black' : 'opacity-50'}`}>TÜRKÇE</button><button onClick={() => ss({ ...st, language: 'en' })} className={`flex-1 py-2 rounded-md flex justify-center text-xs font-bold ${st.language === 'en' ? 'bg-white shadow text-black' : 'opacity-50'}`}>ENGLISH</button></div></div><div className="mb-6"><label className="text-xs font-bold uppercase opacity-50 mb-2 block">{t(st.language, 'pom')}</label><div className="flex gap-4"><div className="flex-1"><span className="text-xs">{t(st.language, 'wk')}</span><input type="number" value={st.pomodoroWork} onChange={e => ss({ ...st, pomodoroWork: parseInt(e.target.value) })} className="w-full bg-black/5 rounded p-2 mt-1" /></div><div className="flex-1"><span className="text-xs">{t(st.language, 'br')}</span><input type="number" value={st.pomodoroBreak} onChange={e => ss({ ...st, pomodoroBreak: parseInt(e.target.value) })} className="w-full bg-black/5 rounded p-2 mt-1" /></div></div></div><div className="flex gap-2 mt-6 border-t border-black/10 pt-4"><button onClick={() => dbOp('getAll', null, true).then(d => { const a = document.createElement('a'); a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(d)); a.download = "backup.json"; a.click() })} className="flex-1 py-3 bg-black/5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 hover:bg-black/10"><Download size={14} />{t(st.language, 'bk')}</button><label className="flex-1 py-3 bg-black/5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 hover:bg-black/10 cursor-pointer"><Upload size={14} />{t(st.language, 'rs')}<input type="file" className="hidden" accept=".json" onChange={e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = async ev => { try { const d = JSON.parse(ev.target.result); if (Array.isArray(d)) { const c = await dbOp('getAll', null, true), ids = new Set(c.map(x => x.id)); for (const x of d) if (!ids.has(x.id)) await dbOp('put', x); ln(); alert(t(st.language, 'rst')) } } catch { alert(t(st.language, 'err')) } }; r.readAsText(f); e.target.value = '' } }} /></label></div><button onClick={() => sset(false)} className="w-full mt-4 py-3 rounded-xl bg-[var(--acc)] text-white font-bold">{t(st.language, 'dn')}</button></div></div>)}</>}
        </div>
    )
};

const root = createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);