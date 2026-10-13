/* Café Clash campaign data: 10 chapters x 5 levels. */
const CHARS = {
  "Kairo": { icon: "☕", folder: "Kairo" },
  "Mimi": { icon: "🧁", folder: "Mimi" },
  "Ryu": { icon: "🍳", folder: "Ryu" },
  "Yuki": { icon: "🧋", folder: "Yuki" },
  "Lena": { icon: "🥖", folder: "Lena" },
  "Rei": { icon: "🧾", folder: "Rei" },
  "Hana": { icon: "🧹", folder: "Hana" },
  "Akira": { icon: "👔", folder: "Akira" },
  "Sora": { icon: "📦", folder: "Sora" },
  "Luna": { icon: "🎤", folder: "Luna" },
  "Overcharged Kairo": { icon: "⚡", folder: "Kairo" },
  "Narrator": { icon: "✨", folder: null }
};

const IMG_EXT = "png"; // change to "jpg" if your files are JPEGs

// Story expressions: neutral, happy, sad, surprised, angry
function getStoryImg(charName, expression = "neutral") {
  const c = CHARS[charName];
  if (!c || !c.folder) return "";
  return `Characters/${c.folder}/${expression}.${IMG_EXT}`;
}

// Combat poses: idle, attack, ultimate ("skill" still works as an alias)
function getCombatImg(charName, action = "idle") {
  const c = CHARS[charName];
  if (!c || !c.folder) return "";
  if (action === "skill") action = "attack";
  return `Characters/${c.folder}/${action}.${IMG_EXT}`;
}

const CH = [
{t:"The Midnight Shift",set:"Midnight Café Interior",mobs:[["Rogue Espresso Sprite","👾"],["Haunted Grinder","⚙️"]],boss:[["Awakened Hana","🧹"]],
 intro:[["Narrator","12:00 AM. Astral Roast begins to flow through the city."],["Kairo","Clock's striking midnight. Another quiet shift... or so I thought."],["Mimi","Kairo! The espresso machine is glowing blue!"],["Narrator","The light strikes Kairo's giant coffee cup. It awakens.","!"],
  {q:"How do you respond?",o:[["Grab the cup and defend the counter!","Kairo","Time to test this awakened cup!"],["Analyze the gauge and strike precisely!","Kairo","Pressure's spiking. Strike smart!"]]}],
 pre:[["Hana","Dirty... everything is dirty... must sanitize!"],["Kairo","Hana?! The cleaning mana has corrupted her!"],["Kairo","Sorry Hana. This might sting!","!"]],
 post:[["Hana","Kairo...? Why is the floor wet?"],["Mimi","The corruption's gone, but this is happening all over the city."],["Kairo","Then we find answers. Let's start with Head Chef Ryu."]]},
{t:"Flames of the Kitchen",set:"Gourmet District High Kitchen",mobs:[["Runaway Frying Pan","🍳"],["Flaming Ladle","🥄"]],boss:[["Ryu","🍳"]],
 intro:[["Mimi","The Gourmet District. Ryu knows more about Astral Roast than anyone."],["Narrator","The kitchen doors burst open in a wave of heat."],["Ryu","Nobody enters my kitchen unless they can take the heat.","!"]],
 pre:[["Ryu","Prove yourself, rookie. Survive my Iron Wok!"],["Kairo","Fine by me. Order up!"]],
 post:[["Ryu","Hah! Not bad. Your cup is bonded to the Espresso Core."],["Ryu","It sits deep beneath the city. A corporation wants it."],["Mimi","Then we're not alone in this."]]},
{t:"Sugar Rush",set:"Sugar District Bakery",mobs:[["Sugar-Crazed Cupcake","🧁"],["Runaway Dough","🍞"]],boss:[["Lena","🥖"],["Rei","🧾"]],
 intro:[["Narrator","Sugar mana hangs thick as syrup over the Sugar District."],["Lena","MORE. FLOUR. MORE. SMASH!","!"],["Mimi","Lena's lost control of the sugar rush!"],["Kairo","Calm her down, then figure out why!"]],
 pre:[["Lena","Can't... stop... the rolling pin's too heavy!"],["Rei","Foreclosure notice. This bakery now belongs to the Corporation."],["Kairo","A rampage and an audit at once. Great."]],
 post:[["Rei","Tch. Retreating for now. The Corporation won't forget this."],["Lena","...Did I wreck the bakery? Sorry!"],["Mimi","Rei works for the Corporation. Financial District, next."]]},
{t:"Corporate Audit",set:"Financial District Office",mobs:[["Corporate Drone","💼"],["Rogue Cash Register","🧮"]],boss:[["Rei","🧾"]],
 intro:[["Kairo","Glass towers. Everything smells like burnt money."],["Narrator","Golden barriers seal every hallway."],["Rei","Unauthorized visitors are subject to audit."]],
 pre:[["Rei","My Golden Tray blocks everything you have!"],["Kairo","Then I'll hit it until it stops blocking."]],
 post:[["Rei","Fine. Our Manager, Akira, is draining the Espresso Core."],["Rei","The corrupted equipment isn't ours. It's a side effect."],["Kairo","Then Neon Boba Street next. Someone there knows more."]]},
{t:"Neon Boba Street",set:"Night Market Boba Strip",mobs:[["Neon Boba Blob","🟣"],["Tapioca Turret","🔫"]],boss:[["Yuki","🧋"]],
 intro:[["Narrator","Neon flickers. The bridge into Boba Street is locked down."],["Yuki","Corporate raiders! Not on my street!","!"],["Kairo","We're not with the Corporation!"],["Yuki","Prove it!"]],
 pre:[["Yuki","Boba Cannon, fire!"],["Mimi","She won't listen. We have to fight."]],
 post:[["Yuki","You really aren't with them. Sorry."],["Yuki","Sora's moving canisters through the Transit Hub, tied to a secret tournament."],["Kairo","Then we intercept him."]]},
{t:"Rush Hour Express",set:"City Transit Hub",mobs:[["Runaway Drone","🚁"],["Express Train Spirit","🚆"]],boss:[["Sora","📦"]],
 intro:[["Narrator","Trains scream through the hub. Every crate hums with Astral Roast."],["Sora","Deliveries wait for no one!"],["Kairo","We need those canisters!"]],
 pre:[["Sora","Special delivery, for your face!"],["Kairo","Catch him if you can!"]],
 post:[["Sora","Okay, okay! The tournament is beneath the city: the Midnight Stage."],["Sora","Luna runs it. Watch out for her voice."],["Mimi","Into the underground, then."]]},
{t:"Midnight Stage",set:"Underground Concert Hall",mobs:[["Hypnotized Fan","🤩"],["Amp Golem","🔊"]],boss:[["Luna","🎤"]],
 intro:[["Narrator","A secret concert. Thousands sway in a trance."],["Luna","Welcome, contenders! Sing for the reactor!","!"],["Kairo","That crowd's energy is feeding something."]],
 pre:[["Luna","Encore! Encore! Give me your energy!"],["Kairo","Time to cancel the show."]],
 post:[["Luna","...I felt the reactor pull. It's linked to the Core."],["Luna","Akira is using the tournament's energy. Please stop him."],["Kairo","We will."]]},
{t:"The Grand Bakery",set:"Royal Pastry Arena",mobs:[["Pastry Knight","🥐"],["Cake Golem","🎂"]],boss:[["Mimi","🧁"]],
 intro:[["Narrator","A friendly tournament, say the flyers."],["Mimi","Kairo, no hard feelings. This is a real duel!"],["Kairo","You've been holding back, Mimi?"]],
 pre:[["Mimi","En garde!"],["Kairo","Show me that Whisk Rapier!"]],
 post:[["Mimi","You've got real heart, Kairo. I'm with you to the end."],["Ryu","The whole crew's gathering. Good."],["Narrator","The ground shakes. The Espresso Core is calling.","!"]]},
{t:"The Core Chambers",set:"Subterranean Mana Reactor",mobs:[["Corrupted Wisp","🌀"],["Overheated Reactor","⚛️"]],boss:[["Overcharged Kairo","⚡"]],
 intro:[["Narrator","The reactor hums. Blue light fills the chambers."],["Kairo","The cup... it's getting heavier."],["Mimi","Kairo, your eyes are glowing!"],["Kairo","I can't... stop it!","!"]],
 pre:[["Overcharged Kairo","MORE... POWER..."],["Mimi","We have to release the extra energy. Fight him!"],["Ryu","Don't you dare lose to yourself, kid."]],
 post:[["Kairo","...I'm back. Thanks, everyone."],["Ryu","Ha. Told you."],["Narrator","Ahead: the Espresso Core, and Akira."]]},
{t:"The Monopolist",set:"Heart of the Espresso Core",mobs:[["Corporate Guardian","🛡️"],["Core Sentinel","🔮"]],boss:[["Akira","👔"],["Akira, Final Form","🌟"]],
 intro:[["Akira","Welcome to the future of coffee. One brand. One empire."],["Kairo","This city's cafés belong to its people!"],["Ryu","Everyone, together!"],["Mimi","All of us."],["Akira","Then be consumed by the Core!","!"]],
 pre:[["Akira","Behold: Corporate Monopolize!","!"],["Kairo","Midnight Brew, don't fail me now!"]],
 post:[["Akira","Impossible... the Core chose him."],["Narrator","The Astral Roast settles. Independent cafés glow warmly across the city."],["Kairo","One cup at a time. That's how it should be."],["Narrator","THE END. Thanks for playing Café Clash: Midnight Brew!"]]}
];

const CC = {
 id:(c,l)=>"ch"+c+"_"+l,
 node(id){const m=id.match(/ch(\d+)_(\d)/),c=+m[1],l=+m[2],C=CH[c-1];
  const waves=l==5?C.boss:[[0],[0,1],[1,1],[0,1,1]][l-1].map(i=>C.mobs[i]);
  return {c,l,chapter:C,waves,hp:l==5?110+c*25:50+c*12,dmg:(l==5?12:8)+c};},
 lines(id,ph){const n=CC.node(id),C=n.chapter,l=n.l;
  if(ph==="pre")return l==1?C.intro:l==5?C.pre:[["Narrator","Enemies ahead: "+n.waves.map(w=>w[0]).join(", ")+". Get ready!"]];
  return l==5?C.post:[["Kairo",["Round one to us.","Keep moving!","Almost there.","Ready for the boss."][l-1]]];},
 state(id){const p=JSON.parse(localStorage.getItem("cafe_clash_progress")||"{}");return p[id]||(id==="ch1_1"?"unlocked":"locked");},
 complete(id){const p=JSON.parse(localStorage.getItem("cafe_clash_progress")||"{}"),n=CC.node(id);
  p[id]="completed";const nx=n.l<5?CC.id(n.c,n.l+1):(n.c<10?CC.id(n.c+1,1):null);
  if(nx&&(!p[nx]||p[nx]==="locked"))p[nx]="unlocked";localStorage.setItem("cafe_clash_progress",JSON.stringify(p));}
};

/* ---------- Drawn character sprites (used whenever a Characters/<Name>/<pose>.png is missing) ---------- */
const LOOK = {
  "Kairo":{hair:"#6b4226",style:"short",cloth:"#3d6b4f",apron:"#f3e9d8",eye:"#7b4a2a"},
  "Mimi":{hair:"#f29bb8",style:"buns",cloth:"#f7b6cc",apron:"#fff",eye:"#d9537f"},
  "Ryu":{hair:"#2b2b33",style:"short",cloth:"#f4f4f4",pants:"#3a3a44",hat:"chef",eye:"#a33"},
  "Yuki":{hair:"#8fd3e8",style:"tails",cloth:"#3fb6b0",apron:"#e8fbfa",eye:"#2b8aa8"},
  "Lena":{hair:"#e8923c",style:"ponytail",cloth:"#d9b27c",apron:"#fff3df",eye:"#8a5a1e"},
  "Rei":{hair:"#8b93a8",style:"bob",cloth:"#2e3550",tie:"#e6b84c",glasses:1,eye:"#4a5a8a"},
  "Hana":{hair:"#5fb89a",style:"ponytail",cloth:"#4a7fb8",apron:"#fff",eye:"#2e7a64"},
  "Akira":{hair:"#1e1e26",style:"long",cloth:"#15151c",tie:"#b3202a",eye:"#8f8fa8"},
  "Sora":{hair:"#e07a2e",style:"short",cloth:"#d9822b",pants:"#444",hat:"cap",eye:"#3a2a1a"},
  "Luna":{hair:"#7a4fd1",style:"long",cloth:"#3b2a78",eye:"#e6b84c"},
  "Overcharged Kairo":{hair:"#ffe04a",style:"short",cloth:"#3d6b4f",apron:"#f3e9d8",eye:"#ffef6a",aura:1}
};
const PROPS = {
  "Kairo":[[19,21,4,4,"#f5ede0"],[19,21,4,1,"#6b3a1e"],[23,22,1,2,"#f5ede0"]],
  "Mimi":[[21,22,1,5,"#c98"],[20,17,3,5,"#e8e8e8"]],
  "Ryu":[[19,22,5,3,"#444"],[23,21,1,2,"#7a4a2a"]],
  "Yuki":[[20,20,3,6,"#e8fbfa"],[20,24,3,2,"#6b3a1e"],[21,18,1,2,"#e66"]],
  "Lena":[[19,23,6,2,"#e9c58a"],[18,22,1,4,"#b9854a"]],
  "Rei":[[19,22,5,1,"#e6b84c"],[20,21,3,1,"#f3d36b"]],
  "Hana":[[21,13,1,13,"#a0703c"],[19,25,5,2,"#cfd8dc"]],
  "Akira":[[21,14,1,13,"#222"],[20,13,3,2,"#e6b84c"]],
  "Sora":[[19,20,5,5,"#c8913f"],[19,22,5,1,"#e8c37a"]],
  "Luna":[[21,19,1,6,"#333"],[20,17,3,3,"#bbb"]],
  "Overcharged Kairo":[[19,21,4,4,"#f5ede0"],[19,21,4,1,"#6b3a1e"],[23,22,1,2,"#f5ede0"],[21,16,2,3,"#ffe04a"],[20,18,2,2,"#ffe04a"]]
};
const _spriteCache = {};
// Pixel-art sprites: 24x40 grid, drawn as crisp rectangles
function drawSprite(name, ex = "neutral") {
  const k = name + "|" + ex; if (_spriteCache[k]) return _spriteCache[k];
  const L = LOOK[name]; if (!L) return "";
  const ink = "#1b1218", skin = "#ffd9b8", O = [], F = [];
  const rr = (x,y,w,h,c) => O.push([x,y,w,h,c,1]), sq = (x,y,w,h,c) => O.push([x,y,w,h,c,0]);
  const both = (x,y,w,h,c) => { F.push([x,y,w,h,c]); F.push([24-x-w,y,w,h,c]); };
  const long = L.pants || L.tie, pants = L.pants || L.cloth;
  // hair behind
  ({ long:()=>rr(4,5,16,17,L.hair), buns:()=>{rr(3,0,5,5,L.hair);rr(16,0,5,5,L.hair)}, tails:()=>{sq(2,7,3,12,L.hair);sq(19,7,3,12,L.hair)},
     bob:()=>rr(4,5,16,10,L.hair), ponytail:()=>sq(19,5,3,12,L.hair), short:()=>{} })[L.style]();
  // legs & shoes
  if (long) { sq(8,26,3,6,pants); sq(13,26,3,6,pants); } else { sq(8,26,3,3,pants); sq(13,26,3,3,pants); sq(8,29,3,3,skin); sq(13,29,3,3,skin); }
  rr(7,32,5,2,L.shoe || "#d9534f"); rr(12,32,5,2,L.shoe || "#d9534f");
  // body, arms, hands
  sq(5,18,2,6,L.cloth); sq(17,18,2,6,L.cloth); sq(5,24,2,2,skin); sq(17,24,2,2,skin);
  rr(7,17,10,9,L.cloth);
  if (L.apron) sq(9,20,6,6,L.apron);
  if (L.tie) { sq(11,17,2,1,"#fff"); sq(11,18,2,4,L.tie); }
  // head & hair
  rr(5,3,14,14,skin);
  rr(4,2,16,7,L.hair); sq(5,9,2,3,L.hair); sq(17,9,2,3,L.hair);
  if (L.hat === "chef") { rr(5,-1,14,5,"#fff"); rr(7,-4,10,4,"#fff"); }
  if (L.hat === "cap") { rr(4,0,16,5,"#c0392b"); sq(13,4,8,1,"#962d22"); }
  // props
  (PROPS[name] || []).forEach(p => sq(p[0], p[1], p[2], p[3], p[4]));
  // face
  if (ex === "happy") { both(7,12,1,1,ink); both(8,11,2,1,ink); both(10,12,1,1,ink); both(6,13,2,1,"#ff9aa8"); }
  else {
    const t = ex === "surprised" ? 10 : 11, h = ex === "surprised" ? 4 : 2;
    both(8,t,2,h,ink); both(8,t,1,1,"#fff"); both(9,t+h-1,1,1,L.eye);
  }
  if (ex === "sad") { both(7,10,1,1,ink); both(8,9,2,1,ink); F.push([7,13,1,2,"#7ec8ff"]); }
  if (ex === "angry") { both(7,9,2,1,ink); both(9,10,1,1,ink); }
  if (ex === "surprised") both(7,8,3,1,ink);
  if (L.glasses) { both(6,10,5,1,ink); both(6,14,5,1,ink); both(6,10,1,5,ink); both(10,10,1,5,ink); F.push([11,11,2,1,ink]); }
  const mouth = { neutral:[[11,14,2,1,ink]], happy:[[10,14,4,2,ink],[11,15,2,1,"#e66"]], sad:[[11,14,2,1,ink],[10,15,1,1,ink],[13,15,1,1,ink]],
    surprised:[[11,14,2,2,ink]], angry:[[10,14,4,2,ink],[10,14,4,1,"#fff"]] }[ex] || [];
  mouth.forEach(m => F.push(m));
  const R = (x,y,w,h,c,o) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"${o ? ` opacity="${o}"` : ""}/>`;
  const outline = a => a[5] ? R(a[0],a[1]-1,a[2],a[3]+2,ink) + R(a[0]-1,a[1],a[2]+2,a[3],ink) : R(a[0]-1,a[1]-1,a[2]+2,a[3]+2,ink);
  const fill = a => a[5] ? R(a[0]+1,a[1],a[2]-2,a[3],a[4]) + R(a[0],a[1]+1,a[2],a[3]-2,a[4]) : R(a[0],a[1],a[2],a[3],a[4]);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 40" shape-rendering="crispEdges"><g transform="translate(0,4)">
${L.aura ? R(1,2,22,30,"#ffe04a",.3) + R(3,5,18,25,"#fff6a0",.3) : ""}
${R(5,34,14,1,"#000",.22)}${R(3,35,18,1,"#000",.15)}
${O.map(outline).join("")}${O.map(fill).join("")}${F.map(f => R(f[0],f[1],f[2],f[3],f[4])).join("")}
</g></svg>`;
  return _spriteCache[k] = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

// Real image first (if the file exists), pixel drawing as fallback
const _missing = new Set();
function spriteImg(name, path, ex, h) {
  const img = new Image(); img.className = "pix"; img.style.height = h + "px"; img.style.imageRendering = "pixelated"; img.alt = name;
  if (!path || _missing.has(path)) { img.src = drawSprite(name, ex); return img; }
  img.onerror = () => { _missing.add(path); img.onerror = null; img.src = drawSprite(name, ex); };
  img.src = path; return img;
}
// "Awakened Hana" -> "Hana", "Akira, Final Form" -> "Akira"; mobs return null
function resolveLook(n) { return Object.keys(LOOK).sort((a, b) => b.length - a.length).find(k => n.includes(k)) || null; }