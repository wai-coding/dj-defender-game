# Dancefloor Defender

## Current Features Implemented

### Core Gameplay
- The player (DJ head) is displayed on screen and can move horizontally using the left and right arrow keys.  
- The game area is set to 500×600 pixels with a static background image.  
- Enemies (USB drives) spawn at the top of the screen and fall downward with randomized speed.  
- Bullets (vinyl discs) are created when the SPACE key is pressed.  
- Bullets travel upward and are removed once they exit the screen.  
- Enemies are removed when they leave the screen.  
- Collision detection is implemented for:  
  - Player colliding with an enemy (triggers Game Over).  
  - Bullet colliding with an enemy (both elements are removed).  
- Scoring system implemented:  
  - Enemy reaches the bottom → +1 point  
  - Enemy destroyed by a bullet → +2 points  
- Progressive difficulty system implemented: enemy speed and spawn frequency increase over time.  
- Level system displayed in the HUD, based on difficulty progression.

### Architecture and Code Structure
- The project uses Object-Oriented Programming with the following classes:  
  - `Player`  
  - `Enemy`  
  - `Bullet`  
  - `Game`
- A game loop runs at 60 FPS to update entity positions, detect collisions and remove off-screen elements.  
- Dynamic DOM manipulation is used to create, position and remove elements during gameplay.  
- Keyboard events (`keydown` and `keyup`) control movement and shooting input.  
- UI screens implemented:  
  - Start Screen  
  - Game Screen  
  - Game Over Screen  
- HUD elements for score and level are updated dynamically.

### Visual Assets
- Background image integrated.  
- Player sprite integrated.  
- Enemy sprite integrated.  
- Bullet sprite integrated.  

---

## Features Planned for Future Development

### Gameplay Enhancements
- Additional enemy types with different speeds, movement patterns or properties.  
- Power-ups such as faster shooting, multi-shot or temporary shield.  
- Optional boss enemy or boss stage.  
- Lives system allowing the player to take more than one hit.

### Visual and Audio Improvements
- Explosion animation when an enemy is destroyed.  
- Sound effects for shooting, collisions and background music.  
- Additional feedback effects when scoring or leveling.

### UI and User Experience
- Improved start and game over screens with enhanced visuals.  
- Pause/resume functionality.  
- Settings menu for audio, difficulty presets, etc.

### Additional Game Options
- Light and dark mode backgrounds.  
- Saving high scores using `localStorage`.  
- Character selection (different DJ ships).

### Technical Improvements
- Shooting cooldown to prevent continuous rapid fire when holding SPACE.  
- More accurate collision boxes for better hit detection.  
- Performance improvements to avoid unnecessary DOM operations. 