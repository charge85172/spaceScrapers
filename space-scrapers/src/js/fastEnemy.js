import { Enemy } from './enemy.js'
import { Vector } from 'excalibur'
import { Explosion } from './explosion.js'

export class FastEnemy extends Enemy {
    constructor() {
        super()
        this.vel = new Vector(0, 220) // Faster than normal enemy
        this.scale = new Vector(0.13, 0.13) // Slightly bigger for visibility
    }
    onInitialize(engine) {
        super.onInitialize(engine)
        this.graphics.opacity = 0.7
    }
    handleCollision(event) {
        const other = event.other.owner
        if (other && other.constructor && other.constructor.name === "Bullet") {
            if (other.playerNumber && this.scene.engine.scoreUI) {
                for (let i = 0; i < 5; i++) {
                    this.scene.engine.scoreUI.addPoint(other.playerNumber)
                }
            }
            const explosion = new Explosion(this.pos)
            this.scene.add(explosion)
            const randomX = Math.random() * 512
            this.pos = new Vector(randomX, -50)
            this.vel = new Vector(0, 220)
        }
    }
}