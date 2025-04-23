# AI Defender - README

## Overview
AI Defender is an interactive space shooter game designed for the Tempus Innovation InTempo booth at the OCEA Spring Conference 2025. The game engages school counselors with fun gameplay while collecting email addresses for the AI newsletter.

## Features
- Engaging space shooter gameplay with keyboard and touch controls
- Educational AI facts displayed during gameplay
- Power-ups and weapon upgrades
- Score tracking and leaderboard system
- Email collection for newsletter sign-ups
- Conference-specific branding and features
- Responsive design for all devices
- Admin controls for data export

## Directory Structure
```
ai-defender/
├── assets/               # Game assets
│   ├── images/           # Image assets
│   │   ├── player/       # Player ship images
│   │   ├── enemies/      # Enemy images
│   │   ├── asteroids/    # Asteroid images
│   │   ├── powerups/     # Power-up images
│   │   ├── backgrounds/  # Background images
│   │   └── ui/           # UI elements
│   ├── placeholder-graphics.css  # CSS-based graphics as fallback
├── css/                  # Stylesheets
│   ├── style.css         # Main styles
│   ├── additional.css    # Additional styles
│   └── responsive.css    # Responsive design styles
├── js/                   # JavaScript files
│   ├── utils.js          # Utility functions
│   ├── aiFacts.js        # AI educational facts
│   ├── player.js         # Player ship logic
│   ├── asteroids.js      # Asteroid logic
│   ├── enemies.js        # Enemy ships logic
│   ├── powerups.js       # Power-ups logic
│   ├── collision.js      # Collision detection
│   ├── ui.js             # User interface
│   ├── leaderboard.js    # Leaderboard functionality
│   ├── emailCollection.js # Email collection
│   ├── game.js           # Main game logic
│   └── mobile.js         # Mobile optimizations
├── index.html            # Main HTML file
└── deployment_guide.md   # Deployment instructions
```

## How to Play
1. Open `index.html` in a modern web browser
2. Click "Start Game" to begin
3. Use arrow keys (desktop) or touch/tilt (mobile) to move your ship
4. Avoid asteroids and enemy ships
5. Collect power-ups to enhance your ship
6. Learn AI facts while playing
7. Submit your email to join the leaderboard

## Conference Setup
See `deployment_guide.md` for detailed instructions on setting up the game at the OCEA Spring Conference booth.

## Technical Details
- Built with vanilla JavaScript, HTML5, and CSS3
- Uses HTML5 Canvas for rendering
- Responsive design works on all devices
- No external dependencies required
- Works offline (no internet connection needed)

## Admin Features
Press `Ctrl+Shift+A` to access admin controls for:
- Exporting collected emails as CSV
- Viewing statistics
- Managing leaderboard

## Customization
The game can be easily customized for future events:
- Update conference branding in index.html
- Modify AI facts in aiFacts.js
- Change game difficulty in game.js

## Created By
Developed for Tempus Innovation InTempo by Manus AI
https://tempusinnovation.com/intempo
