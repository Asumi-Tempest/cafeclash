# Café Clash: Midnight Brew

A cozy card-battle adventure set in a magical midnight café. Play Kairo, a barista whose giant coffee cup awakens, and fight your way through 10 chapters of story, battles and bosses. Pull new fighters from the Brew Station, level them up in the Roster, and take them into battle.

## How to run

1. Keep every file and folder from this project together in one folder (see the structure below).
2. Open the folder in **VS Code** and start **Live Server** on `index.html`
   (or open `index.html` directly in a modern browser, Chrome or Edge recommended).
3. Click anywhere on the loading screen, then **Clock In** to sign in.

> Sound: browsers only allow music after the first click, so click once on the first screen.

### Signing in
- **Sign Up / Log In:** enter your email and you will receive a 6-digit code (check spam). Accounts and saves are stored in a Google Sheet through Google Apps Script.
- **Continue as guest:** plays with no account. Progress is saved only on that browser.

## Project structure

```
index.html      login / loading screen
main.html       main menu (Adventure, Brew Station, Roster, Story Log, Settings)
map.html        chapter map
story.html      visual-novel story scenes
combat.html     card battles
gacha.html      Brew Station (pull new characters)
roster.html     character list, stats and level-ups
campaign.js     story + enemy data, pixel character drawing
cloud.js        cloud save (talks to the Apps Script backend)
music.js        music player
help.js         how-to-play popup
Code.gs         Google Apps Script backend (paste into script.google.com)
logo.png        game logo
Characters/     character art (optional, pixel art is drawn if missing)
audios/         doki-doki.mp3, megalovania.mp3
```

## How to play

- **Goal:** reduce the enemy's HP to 0. Cards cost **EP** (3 per turn).
- **Enemy counter:** the badge above the enemy counts down each card you play. At 0 it attacks, then you get full EP and 4 new cards.
- **✔ button:** end your turn early (enemy strikes, then you refill EP and draw).
- **Cards:** Attack, Skill, Buff (shield / heal / +50% damage) and Ultimate (3 EP). Your deck is shuffled and reshuffled when empty.
- **Rewards:** winning gives coins and gems (bigger the first time). Stars depend on your HP left.
- **HP carries over** between stages (+25% after each win). Each chapter's first stage starts everyone at full HP.
- **Brew Station:** spend 💎 gems on pulls. A Rare or better is guaranteed every 10 pulls.
- **Roster:** spend 🪙 coins to level characters up (+8% HP, +4% damage per level, up to 10). Duplicate pulls make level-ups cheaper.

## Backend setup (Google Apps Script)

1. Create a Google Sheet, then **Extensions → Apps Script**, and paste in `Code.gs` (set `SHEET_ID` to your sheet's ID).
2. Run the `setup` function once and approve the permissions. It creates the `Users`, `OTP` and `Progress` tabs.
3. **Deploy → New deployment → Web app**, Execute as **Me**, access **Anyone**. Copy the `/exec` URL.
4. Paste that URL into the `API` line at the top of `cloud.js`.

A free Gmail account can send about 100 login emails per day.

## Credits

- Game design, code and story: **<Tampon and Payca>**
- Music: *Megalovania* (Toby Fox, from UNDERTALE) and *Doki Doki Literature Club! OST* (Team Salvato). Used for a non-commercial school project; all rights belong to their owners.
- Fonts: Baloo 2 and Quicksand (Google Fonts)