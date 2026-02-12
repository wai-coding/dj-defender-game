# Dancefloor Defender

A fast-paced retro arcade shooter built with vanilla JavaScript, HTML, and CSS.  
Defend the nightclub dancefloor from falling USB drives — move, shoot, and survive as long as you can!

![Dancefloor Defender](./images/logo.png)

---

## How to Play

| Control         | Keyboard          | Touch (Mobile)         |
| --------------- | ----------------- | ---------------------- |
| Move left       | `←` Arrow         | Tap left third         |
| Move right      | `→` Arrow         | Tap right third        |
| Shoot           | `Space`           | Tap center third       |
| Pause / Resume  | `P`               | MENU button            |

- **+1 point** — enemy reaches the bottom of the screen  
- **+2 points** — enemy destroyed by a bullet  
- You start with **3 lives**. Each collision with an enemy costs 1 life.  
- Difficulty increases every ~10 seconds (faster spawns, faster enemies).

---

## Features

### Core Gameplay
- Smooth 60 FPS game loop with frame-based timing  
- Progressive difficulty curve with capped spawn rate and enemy speed  
- Lives system (3 lives) with game over on 0  
- Score and level tracking displayed in a real-time HUD  

### Polish & Game Feel
- **Screen shake** on player damage and enemy destruction  
- **Enemy hit flash** — brief brightness burst before removal  
- **Animated score count-up** with pop effect  
- **Smooth screen transitions** (fade in/out between Start, Game, and Game Over)  
- **Level-up indicator** — centered "Level X" overlay with fade animation on difficulty increase  
- **Heart-based lives** — remaining lives shown as ♥ icons, lost lives as ♡  
- **Damage flash** — brief red radial overlay when the player loses a life  
- **Enhanced HUD** — larger gold score with glow, flex-layout HUD, improved visual hierarchy  
- **Menu polish** — consistent typography, gold-highlighted #1 high score, button focus states

### Audio
- Background music with looping and volume fade  
- Shoot and enemy-hit sound effects  
- Mute toggle in pause menu — state persisted in `localStorage`  
- Music fades down on Game Over, resumes on restart without restarting the track  

### UI & Branding
- **Pause menu** (P key or MENU button) with Resume, Options, Restart, and Quit  
- **Top 10 leaderboard** — persistent high scores via `localStorage` (score + level)  
- **Quit option** from both Pause menu and Game Over screen  
- Light / Dark theme toggle — state persisted in `localStorage`  
- Mobile-friendly touch controls  

### Technical Highlights
- **Restart without page reload** — game state fully reset in JS (no duplicate loops, listeners, or audio instances)  
- Object-Oriented architecture: `Player`, `Enemy`, `Bullet`, `Game` classes  
- Centralized difficulty configuration with safe caps  
- No frameworks, no build tools — pure vanilla JS, HTML, CSS  
- Clean DOM management — entities created and removed without leaks  

---

## Tech Stack

- **HTML5** — semantic markup, screen structure  
- **CSS3** — animations (shake, flash, fade), transitions, responsive layout  
- **JavaScript (ES6)** — OOP classes, DOM manipulation, `localStorage`, `requestAnimationFrame`  

---

## How to Run Locally

1. Clone or download the repository  
2. Open `index.html` in any modern browser  
3. Click **Start Game** and defend the dancefloor!

> No server, build step, or dependencies required.

---

## Project Structure

```
index.html              → Entry point (all three screens)
styles/
  style.css             → All styling, animations, transitions
js/
  player.js             → Player class (movement, position)
  enemy.js              → Enemy class (spawn, movement, collision)
  bullet.js             → Bullet class (movement, hit detection)
  game.js               → Game class (loop, scoring, difficulty, state)
  script.js             → UI logic, audio, input listeners, startup
assets/                 → Audio files (music, SFX)
images/                 → Sprites, backgrounds, logo, favicon
```

---

## Learning Highlights

- Building a complete game loop with `setInterval` at 60 FPS  
- Managing game state (start → play → game over → restart) without page reloads  
- DOM-based rendering with dynamic element creation and cleanup  
- Collision detection using `getBoundingClientRect()`  
- Progressive difficulty design with centralized config and safe caps  
- Audio API: looping, fading, mute persistence, preventing stacking  
- CSS animations for game feel (shake, flash, score pop, screen transitions)  
- `localStorage` for high scores and user preferences