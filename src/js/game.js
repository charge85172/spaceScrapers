import '../css/style.css'
import { Actor, Engine, Vector, DisplayMode } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Ship } from './ship.js'
import { Enemy } from './enemy.js'
import { Obstacle } from './obstacle.js'
import { ScoreUI } from './ui.js'
import { EnemyBullet } from './enemyBullet.js'
import { BombPowerup } from './bombPowerup.js'

export class Game extends Engine {

    enemyInterval
    frameCounter
    enemyShootInterval = 240 // frames (4s)
    enemyShootTimer = 0
    enemyShootDecreaseTimer = 0
    bombSpawnTimer = 0 // frames since last bomb spawn

    constructor() {

        super({
            width: 512,
            height: 384,
            maxFps: 60,
            displayMode: DisplayMode.FitScreen
        })

        this.start(ResourceLoader).then(() => this.startGame())
    }

    startGame() {
        // Remove all old UI actors before starting a new game
        if (this.scoreUI) {
            this.scoreUI.removeAllUI(this)
            this.scoreUI = null
        }
        // Remove all old background actors before starting a new game
        this.currentScene.actors.forEach(actor => {
            if (actor.name === 'background') {
                actor.kill()
            }
        })
        // Kill all other actors (bullets, explosions, powerups, etc.)
        this.currentScene.actors.forEach(actor => {
            if (!(actor.name === 'background')) {
                actor.kill()
            }
        })
        // Add background first so it's at the bottom layer
        const bg = new Actor()
        bg.name = 'background'
        bg.graphics.use(Resources.Background.toSprite())
        bg.pos = new Vector(256, 192)
        bg.scale = new Vector(512 / Resources.Background.width + 0.02, 384 / Resources.Background.height + 0.02)
        this.add(bg)
        // Remove all old ships before starting a new game
        this.currentScene.actors.forEach(actor => {
            if (actor instanceof Ship) {
                actor.kill()
            }
        })
        this.enemyInterval = 120 // Interval in frames to spawn enemies and obstacles
        this.frameCounter = 0
        this.enemyShootInterval = 240
        this.enemyShootTimer = 0
        this.enemyShootDecreaseTimer = 0
        this.bombSpawnTimer = 0
        console.log("start de game!")
        const ship1 = new Ship(1)
        const ship2 = new Ship(2)
        this.add(ship1)
        this.add(ship2)
        this.showDebug(true)
        this.scoreUI = new ScoreUI(this)
    }


    onPostUpdate() {
        this.frameCounter++
        if (this.frameCounter > this.enemyInterval) {
            this.add(new Enemy())
            this.add(new Obstacle())
            this.frameCounter = 0
        }
        // Enemy shooting logic
        this.enemyShootTimer++
        this.enemyShootDecreaseTimer++
        if (this.enemyShootTimer >= this.enemyShootInterval) {
            // All enemies shoot
            this.currentScene.actors.forEach(actor => {
                if (actor instanceof Enemy) {
                    const bullet = new EnemyBullet(actor.pos.clone().add(new Vector(0, 16)))
                    this.add(bullet)
                }
            })
            this.enemyShootTimer = 0
        }
        // Decrease shoot interval every 15 seconds (900 frames at 60fps)
        if (this.enemyShootDecreaseTimer >= 900 && this.enemyShootInterval > 60) {
            this.enemyShootInterval = Math.max(60, this.enemyShootInterval - 60)
            this.enemyShootDecreaseTimer = 0
        }
        // Bomb powerup spawn logic
        this.bombSpawnTimer++
        if (this.bombSpawnTimer >= 300) { // 5 seconds at 60fps
            this.add(new BombPowerup())
            this.bombSpawnTimer = 0
        }
    }

    // // Progressive enemy spawn
    // let enemyInterval = 1
    // this.enemyTimer = this.clock.schedule(() => {
    //     const enemy = new Enemy()
    //     this.add(enemy)
    //     // Decrease interval to spawn more enemies over time
    //     if (enemyInterval > 500) {
    //         enemyInterval -= 100
    //         this.enemyTimer.cancel()
    //         this.enemyTimer = this.clock.schedule(arguments.callee, enemyInterval, true)
    //     }
    // }, enemyInterval, true)
    // // Spawn obstacles every 1 second
    // this.obstacleTimer = this.clock.schedule(() => {
    //     const obstacle = new Obstacle()
    //     this.add(obstacle)
    // }, 1000, true)

}

new Game()
