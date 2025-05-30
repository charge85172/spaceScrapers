import { Actor, Vector } from "excalibur"
import { Resources } from "./resources.js"
import { Explosion } from './explosion.js'

export class Enemy extends Actor {
    constructor() {
        super({ width: Resources.Enemy.width - 200, height: Resources.Enemy.height - 200 })
        this.scale = new Vector(0.1, 0.1)
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
            if (other.playerNumber && this.scene.engine.scoreUI) {
                this.scene.engine.scoreUI.addPoint(other.playerNumber)
            }
            const explosion = new Explosion(this.pos)
            this.scene.add(explosion)
            const randomX = Math.random() * 512
            this.pos = new Vector(randomX, -50)
            this.vel = new Vector(0, 120)
        }
    }
}