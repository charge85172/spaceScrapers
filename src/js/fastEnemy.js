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
        // Optionally, use a different color or effect
        this.graphics.opacity = 0.7
    }
    handleCollision(event) {
        const other = event.other.owner
        if (other && other.constructor && other.constructor.name === "Bullet") {
            // Award 5 points if killed by bullet
            if (other.playerNumber && this.scene.engine.scoreUI) {
                for (let i = 0; i < 5; i++) {
                    this.scene.engine.scoreUI.addPoint(other.playerNumber)
                }
            }
            // Spawn explosion at this enemy's position
            const explosion = new Explosion(this.pos)
            this.scene.add(explosion)
            // Respawn enemy at top with new random x
            const randomX = Math.random() * 512
            this.pos = new Vector(randomX, -50)
            this.vel = new Vector(0, 220)
        }
    }
}
