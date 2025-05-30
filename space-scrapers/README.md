# Space Scrapers

## Overview
Space Scrapers is a 2D space shooter game built using the ExcaliburJS game library. Players control ships, shoot enemies, and collect power-ups while navigating through a scrolling background.

## Project Structure
```
space-scrapers
├── public
│   ├── images
│   │   ├── background.jpg
│   │   ├── bomb.png
│   │   ├── enemy.png
│   │   ├── explosion.png
│   │   ├── obstacle.png
│   │   └── ship.png
│   └── index.html
├── src
│   ├── css
│   │   └── style.css
│   └── js
│       ├── background.js
│       ├── bombPowerup.js
│       ├── bullet.js
│       ├── enemy.js
│       ├── enemyBullet.js
│       ├── explosion.js
│       ├── fastEnemy.js
│       ├── game.js
│       ├── healthPack.js
│       ├── obstacle.js
│       ├── resources.js
│       ├── ship.js
│       └── ui.js
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## Setup Instructions
1. **Clone the repository:**
   ```
   git clone https://github.com/yourusername/space-scrapers.git
   cd space-scrapers
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the development server:**
   ```
   npm run dev
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

## Gameplay
- Players control their ships using keyboard inputs.
- Shoot enemies and obstacles to score points.
- Collect power-ups to gain advantages.
- Avoid enemy bullets and obstacles to maintain health.

## Deployment
To deploy the game on GitHub Pages:
1. Build the project:
   ```
   npm run build
   ```

2. Push the `dist` folder to the `gh-pages` branch of your repository.

## License
This project is licensed under the MIT License.