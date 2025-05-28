import { Label, Color, Vector, Actor, Rectangle, GraphicsGroup } from "excalibur"

export class ScoreUI {
    constructor(engine) {
        this.score = 0
        this.maxHealth = 3
        this.currentHealth = 3
        this.label = new Label({
            text: `Score: 0`,
            pos: new Vector(10, 30),
            color: Color.White,
            fontSize: 24
        })
        engine.add(this.label)

        // Health bar background
        this.healthBg = new Actor({
            pos: new Vector(10, 50)
        })
        this.healthBg.graphics.use(new Rectangle({ width: 60, height: 12, color: Color.Gray }))
        engine.add(this.healthBg)

        // Health bar foreground (dynamic)
        this.healthBar = new Actor({
            pos: new Vector(10, 50)
        })
        this._updateHealthBarGraphics()
        engine.add(this.healthBar)

        this.gameOverLabel = null
    }

    addPoint() {
        this.score++
        this.label.text = `Score: ${this.score}`
    }

    setHealth(health) {
        this.currentHealth = Math.max(0, Math.min(this.maxHealth, health))
        this._updateHealthBarGraphics()
    }

    _updateHealthBarGraphics() {
        let width = 60 * (this.currentHealth / this.maxHealth)
        let color = Color.Green
        if (this.currentHealth === 2) color = Color.Yellow
        if (this.currentHealth === 1) color = Color.Red
        this.healthBar.graphics.use(new Rectangle({ width, height: 12, color }))
    }

    reset() {
        this.score = 0
        this.label.text = `Score: 0`
        this.setHealth(this.maxHealth)
    }

    showGameOver(engine) {
        if (!this.gameOverLabel) {
            this.gameOverLabel = new Label({
                text: `GAME OVER\nScore: ${this.score}`,
                pos: new Vector(120, 180),
                color: Color.Red,
                fontSize: 40,
                textAlign: 'center',
                lineHeight: 1.5
            })
            engine.add(this.gameOverLabel)
        }
    }

    hideGameOver(engine) {
        if (this.gameOverLabel) {
            engine.remove(this.gameOverLabel)
            this.gameOverLabel = null
        }
    }
}
