# Dancefloor Defender

## Game Description
Dancefloor Defender is a fast-paced retro arcade shooter where you play as a DJ defending the nightclub dancefloor from falling USB drives.  
The player moves horizontally across the bottom of the screen and shoots vinyl discs to destroy incoming enemies.  
As time passes, the difficulty increases: enemies fall faster and spawn more frequently.  
The objective is to survive as long as possible, score points by destroying or avoiding enemies, and avoid losing all three lives.  
The game includes sound effects, background music, light/dark mode, keyboard/mobile touch controls, and a local high-score system to track your best performances.

## Current Features Implemented

### Core Gameplay
- The player (DJ head) is displayed on screen and can move horizontally using the left and right arrow keys.  
- Touch controls implemented:  
  - Tap left: move left  
  - Tap right: move right  
  - Tap center: shoot  
- The game area is set to 500×600 pixels with switchable light and dark backgrounds.  
- Enemies (USB drives) spawn at the top of the screen and fall downward. Their speed increases with difficulty.  
- Bullets (vinyl discs) are created when the SPACE key is pressed or when tapping the middle of the screen on mobile.  
- Bullets travel upward and are removed once they exit the screen.  
- Enemies are removed when they leave the screen or when destroyed by a bullet.  
- Collision detection implemented for:
  - Player colliding with an enemy (player loses 1 life).  
  - Bullet colliding with an enemy (both elements are removed and a hit sound plays).  
- Lives system implemented:  
  - Player starts with 3 lives  
  - Each collision with an enemy removes 1 life  
  - Game Over occurs only when lives reach 0  
- Scoring system implemented:  
  - Enemy reaches the bottom: +1 point  
  - Enemy destroyed by a bullet: +2 points  
- Progressive difficulty system implemented:
  - Difficulty increases every 600 frames (~10 seconds)  
  - Enemy falling speed increases with difficulty  
  - Enemy spawn interval decreases from 90 frames down to a minimum of 40 frames  
- Level system displayed in the HUD:  
  - Level = Difficulty + 1  
  - Maximum spawn speed reached at Level 11  
- Infinite gameplay: difficulty stops increasing after reaching the minimum spawn interval, but the game continues indefinitely.

### Architecture and Code Structure
- The project uses Object-Oriented Programming with the following classes:
  - `Player`  
  - `Enemy`  
  - `Bullet`  
  - `Game`
- A game loop runs at 60 FPS to update entity positions, detect collisions, spawn enemies, apply difficulty scaling, and clean up off-screen elements.  
- Dynamic DOM manipulation is used to draw, move and delete all game objects.  
- Keyboard events (`keydown`, `keyup`) handle movement and shooting input.  
- Touch event listeners handle left/right movement and shooting on mobile devices.  
- UI screens implemented:
  - Start Screen  
  - Game Screen  
  - Game Over Screen  
- HUD elements show Score, Level, and Lives (updated in real time).  
- High score system implemented using `localStorage`:
  - Stores the top 3 runs (score + level)  
  - Automatically sorted in descending order  
  - Displayed on the Game Over screen  

### Visual & Audio Assets
- Light and dark background images integrated.  
- Player sprite integrated.  
- Enemy sprite integrated.  
- Bullet sprite integrated.  
- Background music loops during the game.  
- Sound effects implemented for:
  - Shooting  
  - Enemy hit  
- Mute toggle available across all screens (affecting music and sound effects).  
- Theme toggle available across all screens (switching between light and dark mode).

---

## Features Planned for Future Development

### Gameplay Enhancements
- Additional enemy types with unique speeds, movement patterns or behaviors.  
- Power-ups such as faster shooting, multi-shot or temporary shields.  
- Optional boss enemy or boss stage.  
- Additional difficulty modes.

### Visual and Audio Improvements
- Explosion animation when an enemy is destroyed.  
- Screen shake or visual hit feedback.  
- Dynamic animated backgrounds.  
- More elaborate player and enemy animations.

### UI and User Experience
- Enhanced Start and Game Over screens with improved visual design.  
- Pause/resume functionality.  
- Settings menu (audio volume, difficulty modes, control preferences).  

### Additional Game Options
- Character selection (different DJ avatars).  
- Alternate bullet skins (vinyl colors or special effects).  
- Extended high-score saving (more than 3 entries, dates, longest run, user name etc.).

### Technical Improvements
- Shooting cooldown to prevent extremely fast firing when holding SPACE.  
- Further optimization for mobile responsiveness and touch input accuracy.

---

## Technologies Used
- HTML5 for structure  
- CSS3 for styling and responsive layout  
- Vanilla JavaScript (ES6 classes)  
- DOM manipulation for rendering game objects  
- LocalStorage API for high score persistence  
- Audio API for sound effects and background music