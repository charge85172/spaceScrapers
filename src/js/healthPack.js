import { Actor, Vector } from "excalibur"
import { Resources } from "./resources.js"

export class HealthPack extends Actor {
    constructor(pos) {
        super({ width: Resources.Obstacle.width - 2, height: Resources.Obstacle.height - 2 })
        this.scale = new Vector(0.02, 0.02)
        this.pos = pos.clone()
        this.vel = new Vector(0, 120)
    }
    onInitialize(engine) {
        this.graphics.use(Resources.Obstacle.toSprite())
        this.graphics.opacity = 0.5 // Transparent look
        this.on("collisionstart", (event) => this.handleCollision(event))
    }
    handleCollision(event) {
        const other = event.other.owner
        if (other && other.constructor && other.constructor.name === "Ship") {
            other.health = 3
            if (other.scene.engine.scoreUI) {
                other.scene.engine.scoreUI.setHealth(other.playerNumber, 3)
            }
            this.kill()
        }
    }
}
