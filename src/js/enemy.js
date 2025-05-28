import { Actor, Vector } from "excalibur"
import { Resources } from "./resources.js"

export class Enemy extends Actor {
    constructor() {
        super({ width: Resources.Enemy.width - 2, height: Resources.Enemy.height - 2 })
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
            if (this.scene.engine.scoreUI) {
                this.scene.engine.scoreUI.addPoint()
            }
            this.kill() // Remove enemy if hit by bullet
        }
    }
}
