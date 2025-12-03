# Dancefloor Defender

## Current Features Implemented

### Core Gameplay
- The player (DJ head) is displayed on screen and can move horizontally using the left and right arrow keys.  
- The game area is set to 500×600 pixels with a background image applied.  
- Enemies (USB drives) spawn at the top of the screen and fall downward with randomized speed.  
- Bullets (vinyl discs) are created when the SPACE key is pressed.  
- Bullets travel upward and are removed once they exit the screen.  
- Enemies are removed when they leave the screen.  
- Collision detection is implemented for:
  - Player colliding with an enemy (triggers Game Over).
  - Bullet colliding with an enemy (both elements are removed).

### Architecture and Code Structure
- The project uses Object-Oriented Programming with the following classes:
  - `Player`
  - `Enemy`
  - `Bullet`
  - `Game`
- A game loop runs at 60 FPS to update positions, detect collisions and remove off-screen elements.  
- Dynamic DOM manipulation is used to create, position and remove elements during gameplay.  
- Keyboard events (`keydown` and `keyup`) control movement and shooting.  
- UI screens implemented:
  - Start Screen  
  - Game Screen  
  - Game Over Screen  

### Visual Assets
- Background image integrated.  
- Player sprite integrated.  
- Enemy sprite integrated.  
- Bullet sprite integrated.  

---

## Features Planned for Future Development

### Gameplay Enhancements
- Scoring system (points for destroying enemies and for allowing them to pass).  
- Additional enemy types with different movement patterns or properties.  
- Progressive difficulty (increased speed or spawn rate over time).  
- Power-ups such as faster shooting, multi-shot or temporary shield.  
- Optional boss enemy or boss stage.

### Visual and Audio Improvements
- Explosion animation when an enemy is destroyed.  
- Sound effects for shooting and collisions.  
- Score feedback.
- Change player, bullet and enemy images.

### UI and User Experience
- Improved start screen with additional visual elements.  
- Improved Game Over screen with layout enhancements.  
- Pause/resume functionality.

### Additional Game Options
- Light and dark mode backgrounds.  
- Saving high scores using `localStorage`.

### Technical Improvements
- Shooting cooldown to prevent holding SPACE for continuous rapid fire.  
- More accurate collision boxes for better hit detection (both player and enemy).  
- Additional cleanup to avoid unused DOM nodes remaining in memory.