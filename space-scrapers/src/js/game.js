import { Actor, Engine, Vector, DisplayMode } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Ship } from './ship.js'
import { Enemy } from './enemy.js'
import { Obstacle } from './obstacle.js'
import { ScoreUI } from './ui.js'
import { EnemyBullet } from './enemyBullet.js'
import { BombPowerup } from './bombPowerup.js'
import { FastEnemy } from './fastEnemy.js'
import { Background } from './background.js'

export class Game extends Engine {

    enemyInterval
    frameCounter
    enemyShootInterval = 240
    enemyShootTimer = 0
    enemyShootDecreaseTimer = 0
    bombSpawnTimer = 0
    fastEnemyTimer = 0

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
        if (this.scoreUI) {
            this.scoreUI.removeAllUI(this)
            this.scoreUI = null
        }
        this.currentScene.actors.forEach(actor => {
            if (actor.name === 'background') {
                actor.kill()
            }
        })
        this.currentScene.actors.forEach(actor => {
            if (!(actor.name === 'background')) {
                actor.kill()
            }
        })
        const bg = new Background()
        bg.name = 'background'
        this.add(bg)
        this.currentScene.actors.forEach(actor => {
            if (actor instanceof Ship) {
                actor.kill()
            }
        })
        this.enemyInterval = 120
        this.frameCounter = 0
        this.enemyShootInterval = 240
        this.enemyShootTimer = 0
        this.enemyShootDecreaseTimer = 0
        this.bombSpawnTimer = 0
        this.fastEnemyTimer = 0
        console.log("start de game!")
        const ship1 = new Ship(1)
        const ship2 = new Ship(2)
        this.add(ship1)
        this.add(ship2)
        this.scoreUI = new ScoreUI(this)
    }

    onPostUpdate() {
        this.frameCounter++
        if (this.frameCounter > this.enemyInterval) {
            this.add(new Enemy())
            this.add(new Obstacle())
            this.frameCounter = 0
        }
        this.enemyShootTimer++
        this.enemyShootDecreaseTimer++
        if (this.enemyShootTimer >= this.enemyShootInterval) {
            this.currentScene.actors.forEach(actor => {
                if (actor instanceof Enemy) {
                    const bullet = new EnemyBullet(actor.pos.clone().add(new Vector(0, 16)))
                    this.add(bullet)
                }
            })
            this.enemyShootTimer = 0
        }
        if (this.enemyShootDecreaseTimer >= 900 && this.enemyShootInterval > 60) {
            this.enemyShootInterval = Math.max(60, this.enemyShootInterval - 60)
            this.enemyShootDecreaseTimer = 0
        }
        this.bombSpawnTimer++
        if (this.bombSpawnTimer >= 900) {
            this.add(new BombPowerup())
            this.bombSpawnTimer = 0
        }
        this.fastEnemyTimer++
        if (this.fastEnemyTimer >= 600) {
            this.add(new FastEnemy())
            this.fastEnemyTimer = 0
        }
    }
}

new Game()