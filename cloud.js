/* Café Clash cloud save: syncs campaign progress + gacha with your Apps Script backend (needs a logged-in account, guests stay local). */
const CLOUD = (() => {
  const API = "https://script.google.com/macros/s/AKfycbzvkKm4etL-57GSHdPSrpVq9_IQ68QF_fwvSL-yerp3jNbzcp8E5VeND6Tpss9QsjiwQw/exec";     // <- the ONLY place you paste the URL (index.html reads it from here)
  const WATCH = ["cafe_clash_progress", "cafe_clash_gacha", "active_chapter"], RANK = { locked: 0, unlocked: 1, completed: 2 };
  const _set = Storage.prototype.setItem;
  const J = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } };
  const session = () => { const s = J("cc_session", null); return s && s.email && s.token ? s : null; };
  const configured = () => API.indexOf("http") === 0;
  const snapshot = () => ({ progress: J("cafe_clash_progress", {}), gacha: J("cafe_clash_gacha", null), activeChapter: +(localStorage.getItem("active_chapter") || 1), savedAt: +(localStorage.getItem("cc_saved_at") || 0) });
  const post = p => fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(p) }).then(r => r.json());

  function merge(a, b) {                       // a = this device, b = cloud
    const progress = Object.assign({}, a.progress);
    Object.keys(b.progress || {}).forEach(k => { if ((RANK[b.progress[k]] || 0) > (RANK[progress[k]] || 0)) progress[k] = b.progress[k]; });
    const newer = (b.savedAt || 0) > (a.savedAt || 0) ? b : a, older = newer === b ? a : b, owned = {};
    [(a.gacha || {}).owned || {}, (b.gacha || {}).owned || {}].forEach(o => Object.keys(o).forEach(n => owned[n] = Math.max(owned[n] || 0, o[n])));
    const g = newer.gacha || older.gacha || { gems: 150, pity: 0 };
    const claimed = Object.assign({}, (a.gacha || {}).claimed || {}, (b.gacha || {}).claimed || {});
    const levels = {};
    [(a.gacha || {}).levels || {}, (b.gacha || {}).levels || {}].forEach(o => Object.keys(o).forEach(n => levels[n] = Math.max(levels[n] || 1, o[n])));
    return { progress, gacha: Object.assign({}, g, { owned, claimed, levels }), activeChapter: newer.activeChapter || 1, savedAt: Math.max(a.savedAt || 0, b.savedAt || 0) };
  }
  function apply(m) {
    _set.call(localStorage, "cafe_clash_progress", JSON.stringify(m.progress));
    _set.call(localStorage, "cafe_clash_gacha", JSON.stringify(m.gacha));
    _set.call(localStorage, "active_chapter", String(m.activeChapter));
    _set.call(localStorage, "cc_saved_at", String(m.savedAt));
  }
  function clearLocal() { WATCH.concat(["cc_saved_at", "cc_owner"]).forEach(k => localStorage.removeItem(k)); }

  function load() {
    const s = session(); if (!s || !configured()) return Promise.resolve(false);
    const owner = localStorage.getItem("cc_owner"); if (owner && owner !== s.email) clearLocal();   // different account on this device
    _set.call(localStorage, "cc_owner", s.email);
    return post({ action: "loadProgress", email: s.email, token: s.token }).then(r => {
      if (!r.ok) return false;
      if (r.data) apply(merge(snapshot(), r.data)); else save(true);                                // first time: upload what this device has
      return true;
    }).catch(() => false);
  }

  let timer = null, dirty = false;
  function save(now, beacon) {
    const s = session(); if (!s || !configured()) return;
    clearTimeout(timer);
    const run = () => {
      dirty = false; _set.call(localStorage, "cc_saved_at", String(Date.now()));
      const body = JSON.stringify({ action: "saveProgress", email: s.email, token: s.token, data: snapshot() });
      if (beacon && navigator.sendBeacon) navigator.sendBeacon(API, new Blob([body], { type: "text/plain;charset=utf-8" }));
      else fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body }).catch(() => {});
    };
    now ? run() : (timer = setTimeout(run, 1500));
  }
  // any page that writes progress / gems / owned characters triggers a save automatically
  Storage.prototype.setItem = function (k, v) { _set.call(this, k, v); if (this === localStorage && WATCH.indexOf(k) >= 0) { dirty = true; save(); } };
  const flush = () => { if (dirty) save(true, true); };
  addEventListener("pagehide", flush);
  addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });

  return { url: API, configured, load, save, clearLocal, session, merge };
})();