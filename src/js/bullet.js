import { Actor, Vector } from "excalibur"
import { Resources } from "./resources.js"
import { Ship } from "./ship.js"

export class Bullet extends Actor {
    constructor(pos, playerNumber) {
        super({ width: 6, height: 6 })
        this.graphics.use(Resources.Ship.toSprite())
        this.scale = new Vector(0.2, 0.2)
        this.vel = new Vector(0, -400)
        this.pos = pos.clone()
        this.playerNumber = playerNumber // Track which player shot the bullet
    }
    onInitialize(engine) {
        // No custom collider needed, super sets up default box collider
    }
}
