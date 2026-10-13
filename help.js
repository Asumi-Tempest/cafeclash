/* Café Clash how-to-play popup. HELP.show() opens it; HELP.once(cb) shows it the first time only, then calls cb. */
const HELP = (() => {
  const STEPS = [
    ["🎯", "Your goal", "Bring the enemy's HP to 0 before yours runs out. Win to earn coins and gems."],
    ["⚡", "Energy (EP)", "Every card costs EP. You have 3 EP each turn. The number at the bottom left shows what's left."],
    ["⚔️", "The enemy counter", "The badge above the enemy counts down every time you play a card. At 0 the enemy strikes. Then you get full EP and 4 new cards."],
    ["✔", "End turn", "Press the green ✔ button to end your turn early: the enemy strikes, then you refill EP and draw 4 new cards. It pulses when you can't afford any card."],
    ["🃏", "Cards", "Attacks and Skills deal damage. Buffs give shield, heal, or +50% damage on your next attack. Ultimates cost 3 EP. Your deck is shuffled, and the discard pile is reshuffled when it runs out."],
    ["⭐", "Rewards & HP", "Stars depend on your HP left. HP carries over to the next stage (+25% after a win). Spend coins on level-ups in the Roster and gems in the Brew Station."]
  ];
  let css = false;
  function show(done) {
    if (!css) { css = true; const s = document.createElement("style"); s.textContent = "#helpBox{position:fixed;inset:0;z-index:20000;background:rgba(15,8,28,.85);display:flex;align-items:center;justify-content:center}#helpBox .hc{width:min(440px,92vw);background:#fdf5e6;border:5px solid #422413;border-radius:18px;padding:24px 26px;text-align:center;box-shadow:0 10px 0 #6c4228;color:#331a0d;font-family:Quicksand,sans-serif;animation:hpop .35s cubic-bezier(.2,1.4,.4,1)}@keyframes hpop{from{transform:scale(.7);opacity:0}}#helpBox .hi{font-size:54px}#helpBox h3{margin:6px 0;font:800 24px 'Baloo 2',sans-serif;color:#422413}#helpBox p{font-size:15px;font-weight:700;line-height:1.4;min-height:84px;margin:0}#helpBox .hd{display:flex;gap:6px;justify-content:center;margin:12px 0}#helpBox .hd i{width:10px;height:10px;border-radius:50%;background:#d1bfa7}#helpBox .hd i.on{background:#e6b84c;border:2px solid #422413}#helpBox .hb{display:flex;gap:10px;justify-content:center}#helpBox button{background:#e6b84c;border:4px solid #422413;border-radius:10px;padding:8px 20px;font:800 16px 'Baloo 2',sans-serif;color:#331a0d;cursor:pointer;box-shadow:0 4px 0 #6c4228}#helpBox button.alt{background:#e3bc88}"; document.head.appendChild(s); }
    let i = 0; const box = document.createElement("div"); box.id = "helpBox"; document.body.appendChild(box);
    const close = () => { box.remove(); try { localStorage.setItem("cc_help_seen", "1"); } catch (e) {} if (done) done(); };
    (function draw() {
      const s = STEPS[i], last = i === STEPS.length - 1;
      box.innerHTML = `<div class="hc"><div class="hi">${s[0]}</div><h3>${s[1]}</h3><p>${s[2]}</p><div class="hd">${STEPS.map((_, k) => `<i class="${k === i ? "on" : ""}"></i>`).join("")}</div><div class="hb">${i ? '<button class="alt" id="hBack">◀ Back</button>' : '<button class="alt" id="hSkip">Skip</button>'}<button id="hNext">${last ? "Got it!" : "Next ▶"}</button></div></div>`;
      box.onclick = e => e.stopPropagation();
      box.querySelector("#hNext").onclick = () => last ? close() : (i++, draw());
      const b = box.querySelector("#hBack"), k = box.querySelector("#hSkip"); if (b) b.onclick = () => (i--, draw()); if (k) k.onclick = close;
    })();
  }
  const once = cb => { let seen = false; try { seen = localStorage.getItem("cc_help_seen") === "1"; } catch (e) {} seen ? cb() : show(cb); };
  return { show, once };
})();