import { Actor, Vector, Keys } from "excalibur"
import { Resources } from "./resources.js"
import { Bullet } from './bullet.js'

export class Ship extends Actor {
    constructor() {
        super({
            width: Resources.Ship.width,
            height: Resources.Ship.height
        })
        this.pos = new Vector(500, 300)
        this.health = 3 // Ship starts with 3 health
    }

    onInitialize(engine) {
        this.graphics.use(Resources.Ship.toSprite())
        this.keyboard = engine.input.keyboard
        this.on("collisionstart", (event) => this.handleCollision(event))
    }

    handleCollision(event) {
        const other = event.other.owner
        if (other && (other.constructor.name === "Enemy" || other.constructor.name === "Obstacle")) {
            this.health--
            if (this.scene.engine.scoreUI) {
                this.scene.engine.scoreUI.setHealth(this.health)
                if (this.health <= 0) {
                    this.scene.engine.scoreUI.showGameOver(this.scene.engine)
                }
            }
            if (this.health <= 0) {
                this.kill() // remove ship (lose)
            }
        }
    }

    onPreUpdate() {
        let xspeed = 0
        let yspeed = 0

        if (this.keyboard.isHeld(Keys.W)) yspeed = -250
        if (this.keyboard.isHeld(Keys.S)) yspeed = 250
        if (this.keyboard.isHeld(Keys.A)) xspeed = -250
        if (this.keyboard.isHeld(Keys.D)) xspeed = 250

        this.vel = new Vector(xspeed, yspeed)

        // Shoot bullet on space press
        if (this.keyboard.wasPressed(Keys.Space)) {
            // Move bullet 10 pixels to the left of the ship's center
            const bullet = new Bullet(this.pos.clone().add(new Vector(-3, 0)))
            this.scene.add(bullet)
        }
    }
}