import { Actor, Vector, Sprite, ImageWrapping } from "excalibur"
import { Resources } from "./resources.js"

export class Background extends Actor {
    sprite
    scrollSpeed = 60 // pixels per second
    offsetY = 0

    onInitialize(engine) {
        // Enable vertical wrapping for the background image
        Resources.Background.wrapping = ImageWrapping.Repeat
        this.sprite = Resources.Background.toSprite()
        // Remove scaling, draw at native size and tile to fill the screen
        this.sprite.scale = new Vector(1, 1)
        this.sprite.sourceView.y = 0
        this.sprite.sourceView.height = engine.drawHeight
        this.sprite.sourceView.width = engine.drawWidth
        this.anchor = Vector.Zero
        this.graphics.use(this.sprite)
        this.pos = new Vector(0, 0)
        this.z = -100 // Always behind everything
    }

    onPreUpdate(engine, delta) {
        // Scroll the background upwards
        this.offsetY -= this.scrollSpeed * (delta / 1000)
        if (this.offsetY < 0) {
            this.offsetY = Resources.Background.height
        }
        this.sprite.sourceView.y = Math.floor(this.offsetY) % Resources.Background.height
    }
}
