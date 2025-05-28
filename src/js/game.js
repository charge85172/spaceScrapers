import '../css/style.css'
import { Actor, Engine, Vector, DisplayMode } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Ship } from './ship.js'
import { Enemy } from './enemy.js'
import { Obstacle } from './obstacle.js'
import { ScoreUI } from './ui.js'

export class Game extends Engine {

    enemyInterval
    frameCounter

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
        this.enemyInterval = 120
        this.frameCounter = 0
        console.log("start de game!")
        const ship = new Ship()
        this.add(ship)
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
