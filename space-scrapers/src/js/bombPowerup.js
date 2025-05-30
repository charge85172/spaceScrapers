import { Actor, Vector } from "excalibur"
import { Resources } from "./resources.js"
import { Explosion } from "./explosion.js"

export class BombPowerup extends Actor {
    constructor() {
        super({ width: Resources.Bomb.width - 2, height: Resources.Bomb.height - 2 })
        this.scale = new Vector(0.04, 0.04)
        const randomX = Math.random() * 512
        this.pos = new Vector(randomX, -50)
        this.vel = new Vector(0, 120)
    }
    onInitialize(engine) {
        this.graphics.use(Resources.Bomb.toSprite())
        this.graphics.opacity = 0.8
        this.on("collisionstart", (event) => this.handleCollision(event))
    }
    handleCollision(event) {
        const other = event.other.owner
        if (other && other.constructor && other.constructor.name === "Ship") {
            const playerNum = other.playerNumber
            this.scene.actors.forEach(actor => {
                if (actor.constructor && (actor.constructor.name === "Enemy" || actor.constructor.name === "Obstacle")) {
                    const explosion = new Explosion(actor.pos)
                    this.scene.add(explosion)
                    actor.kill()
                    if (this.scene.engine.scoreUI) {
                        this.scene.engine.scoreUI.addPoint(playerNum)
                    }
                }
            })
            this.kill()
        }
    }
}