import { Actor, Vector, ImageWrapping } from "excalibur"
import { Resources } from "./resources.js"

export class Background extends Actor {
    sprite
    scrollSpeed = 60
    offsetY = 0

    onInitialize(engine) {
        Resources.Background.wrapping = ImageWrapping.Repeat
        this.sprite = Resources.Background.toSprite()
        this.sprite.scale = new Vector(1, 1)
        this.sprite.sourceView.y = 0
        this.sprite.sourceView.height = engine.drawHeight
        this.sprite.sourceView.width = engine.drawWidth
        this.anchor = Vector.Zero
        this.graphics.use(this.sprite)
        this.pos = new Vector(0, 0)
        this.z = -100
    }

    onPreUpdate(engine, delta) {
        this.offsetY -= this.scrollSpeed * (delta / 1000)
        if (this.offsetY < 0) {
            this.offsetY = Resources.Background.height
        }
        this.sprite.sourceView.y = Math.floor(this.offsetY) % Resources.Background.height
    }
}