import { Actor, Vector } from "excalibur"
import { Resources } from "./resources.js"
import { HealthPack } from './healthPack.js'
import { Explosion } from './explosion.js'

export class Obstacle extends Actor {
    constructor() {
        super({ width: Resources.Obstacle.width - 10, height: Resources.Obstacle.height - 10 })
        this.scale = new Vector(0.1, 0.1)
        const randomX = Math.random() * 512
        this.pos = new Vector(randomX, -50)
        this.vel = new Vector(0, 120)
        this.hitCount = 0
    }
    onInitialize(engine) {
        this.graphics.use(Resources.Obstacle.toSprite())
        this.on("collisionstart", (event) => this.handleCollision(event))
    }
    handleCollision(event) {
        const other = event.other.owner
        if (other && other.constructor && other.constructor.name === "Bullet") {
            if (other.playerNumber && this.scene.engine.scoreUI) {
                this.scene.engine.scoreUI.addPoint(other.playerNumber)
            }
            this.hitCount++
            if (this.hitCount === 1) {
                this.graphics.opacity = 0.5
            } else if (this.hitCount >= 2) {
                const explosion = new Explosion(this.pos)
                this.scene.add(explosion)
                const healthPack = new HealthPack(this.pos)
                this.scene.add(healthPack)
                const randomX = Math.random() * 512
                this.pos = new Vector(randomX, -50)
                this.vel = new Vector(0, 120)
                this.hitCount = 0
                this.graphics.opacity = 1
            }
        }
    }
}