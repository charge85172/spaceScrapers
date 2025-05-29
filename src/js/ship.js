import { Actor, Vector, Keys } from "excalibur"
import { Resources } from "./resources.js"
import { Bullet } from './bullet.js'
import { Explosion } from './explosion.js'

export class Ship extends Actor {
    constructor(playerNumber) {
        super({
            width: Resources.Ship.width,
            height: Resources.Ship.height
        })
        this.playerNumber = playerNumber
        this.health = 3
        // Player 1 should be on the left, Player 2 on the right
        this.pos = playerNumber === 1 ? new Vector(100, 300) : new Vector(500, 300)
        this.vel = new Vector(0, 0) // Always reset velocity on spawn
    }

    onInitialize(engine) {
        this.graphics.use(Resources.Ship.toSprite())
        this.keyboard = engine.input.keyboard
        this.on("collisionstart", (event) => this.handleCollision(event))
    }

    handleCollision(event) {
        const other = event.other.owner
        if (other && (other.constructor.name === "Enemy" || other.constructor.name === "Obstacle")) {
            // Spawn explosion at the enemy/obstacle position
            if (other.pos && this.scene) {
                const explosion = new Explosion(other.pos)
                this.scene.add(explosion)
            }
            this.health--
            if (this.scene.engine.scoreUI) {
                this.scene.engine.scoreUI.setHealth(this.playerNumber, this.health)
                if (this.health <= 0) {
                    const winner = this.playerNumber === 1 ? 'p2' : 'p1'
                    this.scene.engine.scoreUI.showWinner(this.scene.engine, winner)
                }
            }
            if (this.health <= 0) {
                this.kill()
            }
        }
    }

    onPreUpdate() {
        let xspeed = 0
        let yspeed = 0
        // Controls for each player
        if (this.playerNumber === 1) {
            if (this.keyboard.isHeld(Keys.W)) yspeed = -250
            if (this.keyboard.isHeld(Keys.S)) yspeed = 250
            if (this.keyboard.isHeld(Keys.A)) xspeed = -250
            if (this.keyboard.isHeld(Keys.D)) xspeed = 250
            this.vel = new Vector(xspeed, yspeed)
            if (this.keyboard.wasPressed(Keys.Space)) {
                const bullet = new Bullet(this.pos.clone().add(new Vector(-3, 0)), 1)
                this.scene.add(bullet)
            }
        } else if (this.playerNumber === 2) {
            if (this.keyboard.isHeld(Keys.Num8)) yspeed = -250
            if (this.keyboard.isHeld(Keys.Num2)) yspeed = 250
            if (this.keyboard.isHeld(Keys.Num4)) xspeed = -250
            if (this.keyboard.isHeld(Keys.Num6)) xspeed = 250
            this.vel = new Vector(xspeed, yspeed)
            if (this.keyboard.wasPressed(Keys.Num0) || this.keyboard.wasPressed(Keys.Insert)) {
                const bullet = new Bullet(this.pos.clone().add(new Vector(-3, 0)), 2)
                this.scene.add(bullet)
            }
        }
    }
}