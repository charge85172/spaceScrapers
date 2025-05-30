import { Actor, Vector } from "excalibur"
import { Resources } from "./resources.js"

export class EnemyBullet extends Actor {
    constructor(pos) {
        super({ width: 6, height: 6 })
        this.graphics.use(Resources.Enemy.toSprite())
        this.scale = new Vector(0.04, 0.04)
        this.vel = new Vector(0, 300)
        this.pos = pos.clone()
    }
    onInitialize(engine) {
        this.on("collisionstart", (event) => this.handleCollision(event))
    }
    handleCollision(event) {
        const other = event.other.owner
        if (other && other.constructor && other.constructor.name === "Ship") {
            if (other.health > 0) {
                other.health--
                if (other.scene.engine.scoreUI) {
                    other.scene.engine.scoreUI.setHealth(other.playerNumber, other.health)
                    if (other.health <= 0) {
                        const winner = other.playerNumber === 1 ? 'p2' : 'p1'
                        other.scene.engine.scoreUI.showWinner(other.scene.engine, winner)
                    }
                }
                if (other.health <= 0) {
                    other.kill()
                }
            }
            this.kill()
        }
        if (other && other.constructor && other.constructor.name !== "Enemy") {
            this.kill()
        }
    }
}