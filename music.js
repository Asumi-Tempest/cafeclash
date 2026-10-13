/* Café Clash music. Plays real files from /audio if they exist, otherwise a built-in chiptune loop.
   Tracks: login, menu, story, combat, boss. Mute + volume are remembered between pages. */
const MUSIC = (() => {
  const MK = "cc_music_muted", VK = "cc_music_vol", SK = "cc_music_state";
  // YOUR TWO SONGS (both live in the "audios" folder). Change these two names if your files are named differently.
  const SONG_A = "audios/doki-doki.mp3";    // login + main menu + map + Brew Station
  const SONG_B = "audios/megalovania.mp3";  // story + battle + boss
  // If a song file is missing, a built-in chiptune loop plays instead.
  const FILES = { login: [SONG_A], menu: [SONG_A], story: [SONG_B], combat: [SONG_B], boss: [SONG_B] };
  const TR = {
    login:  { bpm: 78,  root: 60, lead: "triangle", pad: 1, bass: "arp",   drum: 0, scale: [0,2,4,7,9],        prog: [[0,4,7],[5,9,12],[9,12,16],[7,11,14]],   dens: .5,  lv: .17 },
    menu:   { bpm: 104, root: 60, lead: "square",   pad: 0, bass: "walk",  drum: 1, scale: [0,2,4,5,7,9,11],  prog: [[0,4,7,11],[9,12,16,19],[2,5,9,12],[7,11,14,17]], dens: .6, lv: .08 },
    story:  { bpm: 64,  root: 57, lead: "sine",     pad: 1, bass: "hold",  drum: 0, scale: [0,2,3,5,7,8,10],  prog: [[0,3,7],[-4,0,3],[3,7,10],[-2,2,5]],       dens: .35, lv: .2 },
    combat: { bpm: 150, root: 57, lead: "square",   pad: 0, bass: "pulse", drum: 2, scale: [0,3,5,7,10],      prog: [[0,3,7],[-4,0,3],[-2,2,5],[-5,-2,2]],      dens: .7,  lv: .08 },
    boss:   { bpm: 164, root: 55, lead: "sawtooth", pad: 0, bass: "pulse", drum: 2, scale: [0,1,3,5,7,8,10],  prog: [[0,3,7],[1,5,8],[-2,2,5],[-1,2,6]],        dens: .75, lv: .06 }
  };
  let want = null, cur = null, ctx = null, master = null, timer = null, step = 0, noiseBuf = null, ui = true;
  let muted = localStorage.getItem(MK) === "true", vol = parseFloat(localStorage.getItem(VK) || "0.5");
  const rd = () => { try { return JSON.parse(localStorage.getItem(SK) || "null"); } catch (e) { return null; } };
  const fresh = s => s && Date.now() - s.t < 30000;

  function saveState() {
    try {
      if (!cur) return;
      localStorage.setItem(SK, JSON.stringify(cur.kind === "file" ? { file: cur.src, time: cur.audio.currentTime, t: Date.now() } : { name: cur.name, step, t: Date.now() }));
    } catch (e) {}
  }
  function fade(a) { let v = 0; const iv = setInterval(() => { v = Math.min(vol, v + vol / 15); a.volume = v; if (v >= vol) clearInterval(iv); }, 60); }

  // ---------- real audio files ----------
  function startFile(name, list, i) {
    if (i >= list.length) {
      if (list.length) {
        const url = decodeURI(new URL(list[0], location.href).href), tail = " Playing the built-in loop instead.";
        fetch(list[0], { method: "HEAD" })
          .then(r => notice(r.ok ? "Found " + url + " but the browser can't play it. The file may not be a real MP3 (re-export it as .mp3)." + tail : "Not found (" + r.status + "): " + url + " - the audios folder isn't at that address." + tail))
          .catch(() => notice("Couldn't load " + url + "." + tail));
      }
      return synth(name);
    }
    const a = new Audio(), src = list[i]; let bad = false;
    cur = { name, kind: "file", audio: a, src };
    const fail = () => { if (bad || !cur || cur.audio !== a) return; bad = true; startFile(name, list, i + 1); };
    a.loop = true; a.volume = 0; a.addEventListener("error", fail);
    const s = rd();
    if (s && fresh(s) && s.file === src) a.addEventListener("loadedmetadata", () => { try { a.currentTime = s.time % (a.duration || 1e9); } catch (e) {} }, { once: true });
    a.src = src;
    a.play().then(() => { fade(a); const b = document.getElementById("musicBtn"); if (b) b.title = "Playing " + src; notice("Playing " + src, true); }).catch(e => { if (e.name !== "NotAllowedError") fail(); });
  }

  // ---------- built-in chiptune ----------
  function tone(f, t, d, type, v, att = .005) {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(v, t + att); g.gain.exponentialRampToValueAtTime(.0001, t + Math.max(d, att + .02));
    o.connect(g); g.connect(master); o.start(t); o.stop(t + d + .05);
  }
  function noise(t, d, v, hp) {
    if (!noiseBuf) { noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const dt = noiseBuf.getChannelData(0); for (let i = 0; i < dt.length; i++) dt[i] = Math.random() * 2 - 1; }
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = noiseBuf; f.type = "highpass"; f.frequency.value = hp;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + d + .02);
  }
  function kick(t) {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(40, t + .12);
    g.gain.setValueAtTime(.8, t); g.gain.exponentialRampToValueAtTime(.001, t + .18); o.connect(g); g.connect(master); o.start(t); o.stop(t + .2);
  }
  function playStep(T, mel, st, t, sd) {
    const k = st % 16, bar = Math.floor(st / 16) % 8, ch = T.prog[bar % 4], beat = sd * 4, f = m => 440 * Math.pow(2, (T.root + m - 69) / 12);
    if (k === 0 && T.pad) ch.forEach(n => tone(f(n), t, beat * 4, "sine", .05, .5));
    const m = mel[bar][k]; if (m !== null) tone(f(m), t, sd * 1.8, T.lead, T.lv);
    if (T.bass === "arp" && k % 4 === 0) tone(f(ch[(k / 4) % ch.length] - 12), t, sd * 3, "triangle", .16);
    if (T.bass === "hold" && k === 0) tone(f(ch[0] - 12), t, beat * 4, "sine", .18, .2);
    if (T.bass === "walk" && k % 4 === 0) tone(f((k % 8 ? ch[2] : ch[0]) - 12), t, sd * 3, "triangle", .2);
    if (T.bass === "pulse" && k % 2 === 0) tone(f(ch[0] - 24), t, sd * 1.6, "sawtooth", .09);
    if (T.drum) {
      if (k === 0 || k === 8 || (T.drum === 2 && k === 10)) kick(t);
      if (T.drum === 2 && (k === 4 || k === 12)) noise(t, .12, .3, 1500);
      if (k % 2 === 0) noise(t, .04, T.drum === 2 ? .1 : .06, 7000);
    }
  }
  function synth(name) {
    const AC = window.AudioContext || window.webkitAudioContext, T = TR[name]; if (!AC || !T) return;
    ctx = new AC(); master = ctx.createGain(); master.gain.value = vol * .8; master.connect(ctx.destination);
    cur = { name, kind: "synth" };
    const sd = 60 / T.bpm / 4, s = rd(); step = s && fresh(s) && s.name === name ? s.step : 0;
    let seed = 7; for (const c of name) seed += c.charCodeAt(0);
    const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    const mel = Array.from({ length: 8 }, (_, b) => Array.from({ length: 16 }, (_, k) => {
      if (k % 2 || rnd() > T.dens) return null;
      const ch = T.prog[b % 4];
      return k % 4 === 0 ? ch[Math.floor(rnd() * ch.length)] + 12 : T.scale[Math.floor(rnd() * T.scale.length)] + 12;
    }));
    let nt = ctx.currentTime + .1;
    timer = setInterval(() => { while (nt < ctx.currentTime + .25) { playStep(T, mel, step, nt, sd); nt += sd; step++; } }, 60);
  }

  // ---------- control ----------
  function start(name) { startFile(name, FILES[name] || [], 0); }
  function stop() {
    if (!cur) return; saveState();
    if (cur.kind === "file") cur.audio.pause(); else { clearInterval(timer); try { ctx.close(); } catch (e) {} }
    cur = null;
  }
  function play(name, opts = {}) {
    if (opts.button === false) ui = false;
    want = name;
    if (!muted && !(cur && cur.name === name)) { stop(); start(name); }
    mountUI();
  }
  function setMuted(m) { muted = m; localStorage.setItem(MK, String(m)); if (m) stop(); else if (want) start(want); paint(); }
  function refreshMute() { const m = localStorage.getItem(MK) === "true"; if (m !== muted) setMuted(m); }
  function setVol(v) { vol = v; localStorage.setItem(VK, String(v)); if (cur && cur.kind === "file") cur.audio.volume = v; if (master) master.gain.value = v * .8; }

  const unlock = () => {
    if (muted) return;
    if (cur && cur.kind === "file" && cur.audio.paused) cur.audio.play().then(() => fade(cur.audio)).catch(() => {});
    if (ctx && ctx.state === "suspended") ctx.resume();
  };
  ["pointerdown", "keydown", "touchstart"].forEach(e => addEventListener(e, unlock, { passive: true }));
  addEventListener("pagehide", saveState);

  // ---------- floating button ----------
  function notice(msg, ok) {
    const add = () => { const d = document.createElement("div"); d.textContent = "🎵 " + msg;
      d.style.cssText = "position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:10000;max-width:90vw;background:" + (ok ? "#3f7d3a" : "#a83a35") + ";color:#fff;border:3px solid #422413;border-radius:10px;padding:8px 16px;font:700 13px Quicksand,sans-serif;text-align:center";
      document.body.appendChild(d); setTimeout(() => d.remove(), ok ? 4500 : 9000); };
    document.body ? add() : addEventListener("DOMContentLoaded", add);
  }
  function paint() { const b = document.getElementById("musicBtn"); if (b) b.textContent = muted ? "🔇" : "🎵"; }
  function mountUI() {
    if (!ui || document.getElementById("musicCtl")) return;
    const st = document.createElement("style");
    st.textContent = "#musicCtl{position:fixed;right:14px;top:50%;transform:translateY(-50%);z-index:9999;display:flex;align-items:center;gap:8px;flex-direction:row-reverse}#musicBtn{width:46px;height:46px;border-radius:50%;background:#6c4228;border:3px solid #422413;color:#fdf5e6;font-size:20px;cursor:pointer;box-shadow:0 4px 0 #422413;padding:0}#musicBtn:active{transform:translateY(3px);box-shadow:0 1px 0 #422413}#musicCtl input{width:0;opacity:0;transition:.25s;accent-color:#e6b84c}#musicCtl:hover input,#musicCtl:focus-within input{width:90px;opacity:1}";
    document.head.appendChild(st);
    const box = document.createElement("div"); box.id = "musicCtl";
    box.innerHTML = '<button id="musicBtn" type="button" aria-label="Toggle music"></button><input type="range" min="0" max="100" aria-label="Music volume">';
    document.body.appendChild(box);
    const r = box.querySelector("input"); r.value = Math.round(vol * 100);
    r.oninput = () => setVol(r.value / 100);
    box.querySelector("button").onclick = e => { e.stopPropagation(); setMuted(!muted); };
    box.onclick = e => e.stopPropagation();
    paint();
  }
  return { play, stop, setMuted, refreshMute, setVol, notice };
})();