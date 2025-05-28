import { Actor, Vector } from "excalibur"
import { Resources } from "./resources.js"

export class Obstacle extends Actor {
    constructor() {
        super({ width: Resources.Obstacle.width - 2, height: Resources.Obstacle.height - 2 })
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
            this.hitCount++
            if (this.hitCount === 1) {
                this.graphics.opacity = 0.5 // Half transparent
            } else if (this.hitCount >= 2) {
                this.kill() // Remove after 2 hits
            }
        }
    }
}
