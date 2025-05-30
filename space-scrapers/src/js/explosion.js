import { Actor, Vector } from "excalibur"
import { Resources } from "./resources.js"

export class Explosion extends Actor {
    constructor(pos) {
        super({ width: Resources.Explosion.width, height: Resources.Explosion.height })
        this.pos = pos.clone()
        this.scale = new Vector(0.04, 0.04)
        this.graphics.use(Resources.Explosion.toSprite())
        this.graphics.opacity = 1
        this._shakeFrames = 10 // Number of frames to shake
        this._shakeMagnitude = 8 // Shake intensity
        this._originalCameraPos = null
    }
    onPreUpdate(engine) {
        if (this._shakeFrames > 0 && engine && engine.currentScene && engine.currentScene.camera) {
            if (!this._originalCameraPos) {
                this._originalCameraPos = engine.currentScene.camera.pos.clone()
            }
            const dx = (Math.random() - 0.5) * this._shakeMagnitude
            const dy = (Math.random() - 0.5) * this._shakeMagnitude
            engine.currentScene.camera.pos = this._originalCameraPos.add(new Vector(dx, dy))
            this._shakeFrames--
        } else if (this._shakeFrames === 0 && this._originalCameraPos && engine && engine.currentScene && engine.currentScene.camera) {
            engine.currentScene.camera.pos = this._originalCameraPos
            this._shakeFrames = -1
        }
        this.scale = this.scale.add(new Vector(0.04, 0.04))
        this.graphics.opacity -= 0.05
        if (this.graphics.opacity < 0.01) {
            if (this._originalCameraPos && engine && engine.currentScene && engine.currentScene.camera) {
                engine.currentScene.camera.pos = this._originalCameraPos
            }
            this.kill()
        }
    }
}