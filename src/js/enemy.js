import { Actor, Vector } from "excalibur"
import { Resources } from "./resources.js"
import { Explosion } from './explosion.js'

export class Enemy extends Actor {
    constructor() {
        super({ width: Resources.Enemy.width - 200, height: Resources.Enemy.height - 200 })
        this.scale = new Vector(0.1, 0.1)
        // Start at random x, y = -50 (above screen)
        const randomX = Math.random() * 512
        this.pos = new Vector(randomX, -50)
        this.vel = new Vector(0, 120)
    }
    onInitialize(engine) {
        this.graphics.use(Resources.Enemy.toSprite())
        this.on("collisionstart", (event) => this.handleCollision(event))
    }
    handleCollision(event) {
        const other = event.other.owner
        if (other && other.constructor && other.constructor.name === "Bullet") {
            // Award point to the player who shot the bullet
            if (other.playerNumber && this.scene.engine.scoreUI) {
                this.scene.engine.scoreUI.addPoint(other.playerNumber)
            }
            // Spawn explosion at this enemy's position
            const explosion = new Explosion(this.pos)
            this.scene.add(explosion)
            // Respawn enemy at top with new random x
            const randomX = Math.random() * 512
            this.pos = new Vector(randomX, -50)
            this.vel = new Vector(0, 120)
        }
    }
}
