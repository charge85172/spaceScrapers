import { Actor, Vector } from "excalibur"
import { Resources } from "./resources.js"
import { HealthPack } from './healthPack.js'
import { Explosion } from './explosion.js'

export class Obstacle extends Actor {
    constructor() {
        super({ width: Resources.Obstacle.width - 10, height: Resources.Obstacle.height - 10 })
        this.scale = new Vector(0.1, 0.1)
        // Start at random x, y = -50 (above screen)
        const randomX = Math.random() * 512
        this.pos = new Vector(randomX, -50)
        this.vel = new Vector(0, 120)
        this.hitCount = 0 // Track hits
    }
    onInitialize(engine) {
        this.graphics.use(Resources.Obstacle.toSprite())
        this.on("collisionstart", (event) => this.handleCollision(event))
    }
    handleCollision(event) {
        const other = event.other.owner
        if (other && other.constructor && other.constructor.name === "Bullet") {
            // Award point to the player who shot the bullet
            if (other.playerNumber && this.scene.engine.scoreUI) {
                this.scene.engine.scoreUI.addPoint(other.playerNumber)
            }
            this.hitCount++
            // Spawn explosion at this obstacle's position if destroyed
            if (this.hitCount === 1) {
                this.graphics.opacity = 0.5 // Half transparent
            } else if (this.hitCount >= 2) {
                const explosion = new Explosion(this.pos)
                this.scene.add(explosion)
                // Drop health pack at this position
                const healthPack = new HealthPack(this.pos)
                this.scene.add(healthPack)
                // Respawn obstacle at top with new random x
                const randomX = Math.random() * 512
                this.pos = new Vector(randomX, -50)
                this.vel = new Vector(0, 120)
                this.hitCount = 0
                this.graphics.opacity = 1
            }
        }
    }
}
