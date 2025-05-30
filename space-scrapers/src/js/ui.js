export class ScoreUI {
    constructor(engine) {
        this.score1 = 0
        this.maxHealth1 = 3
        this.currentHealth1 = 3
        this.label1 = new Label({
            text: `P1 Score: 0`,
            pos: new Vector(10, 30),
            color: Color.White,
            fontSize: 20
        })
        engine.add(this.label1)
        this.healthBg1 = new Actor({ pos: new Vector(10, 50) })
        this.healthBg1.graphics.use(new Rectangle({ width: 60, height: 12, color: Color.Gray }))
        engine.add(this.healthBg1)
        this.healthBar1 = new Actor({ pos: new Vector(10, 50) })
        this._updateHealthBarGraphics(1)
        engine.add(this.healthBar1)

        this.score2 = 0
        this.maxHealth2 = 3
        this.currentHealth2 = 3
        this.label2 = new Label({
            text: `P2 Score: 0`,
            pos: new Vector(512 - 140, 30),
            color: Color.White,
            fontSize: 20
        })
        engine.add(this.label2)
        this.healthBg2 = new Actor({ pos: new Vector(512 - 140, 50) })
        this.healthBg2.graphics.use(new Rectangle({ width: 60, height: 12, color: Color.Gray }))
        engine.add(this.healthBg2)
        this.healthBar2 = new Actor({ pos: new Vector(512 - 140, 50) })
        this._updateHealthBarGraphics(2)
        engine.add(this.healthBar2)

        this.highscore = 0
        this.highscoreLabel = new Label({
            text: `Highscore: 0`,
            pos: new Vector(512 / 2 - 60, 20),
            color: Color.Yellow,
            fontSize: 22
        })
        engine.add(this.highscoreLabel)

        const saved = localStorage.getItem('highscore')
        this.highscore = saved ? parseInt(saved) : 0
        this.highscoreLabel.text = `Highscore: ${this.highscore}`

        this.gameOverLabel = null
        this.winner = null
    }

    addPoint(player) {
        if (player === 1) {
            this.score1++
            this.label1.text = `P1 Score: ${this.score1}`
            if (this.score1 > this.highscore) this.setHighscore(this.score1)
        } else if (player === 2) {
            this.score2++
            this.label2.text = `P2 Score: ${this.score2}`
            if (this.score2 > this.highscore) this.setHighscore(this.score2)
        }
    }

    setHighscore(score) {
        this.highscore = score
        this.highscoreLabel.text = `Highscore: ${this.highscore}`
        localStorage.setItem('highscore', this.highscore)
    }

    setHealth(player, health) {
        if (player === 1) {
            this.currentHealth1 = Math.max(0, Math.min(this.maxHealth1, health))
            this._updateHealthBarGraphics(1)
        } else {
            this.currentHealth2 = Math.max(0, Math.min(this.maxHealth2, health))
            this._updateHealthBarGraphics(2)
        }
    }

    _updateHealthBarGraphics(player) {
        let width = 60
        let health = 3
        let color = Color.Green
        let healthBar
        if (player === 1) {
            health = this.currentHealth1
            healthBar = this.healthBar1
        } else {
            health = this.currentHealth2
            healthBar = this.healthBar2
        }
        width = 60 * (health / 3)
        if (health === 2) color = Color.Yellow
        if (health === 1) color = Color.Red
        healthBar.graphics.use(new Rectangle({ width, height: 12, color }))
    }

    reset() {
        this.score1 = 0
        this.score2 = 0
        this.label1.text = `P1 Score: 0`
        this.label2.text = `P2 Score: 0`
        this.setHealth(1, 3)
        this.setHealth(2, 3)
        this.winner = null
    }

    removeAllUI(engine) {
        engine.remove(this.label1)
        engine.remove(this.healthBg1)
        engine.remove(this.healthBar1)
        engine.remove(this.label2)
        engine.remove(this.healthBg2)
        engine.remove(this.healthBar2)
        engine.remove(this.highscoreLabel)
        if (this.gameOverLabel) engine.remove(this.gameOverLabel)
        if (this._restartHandler) {
            window.removeEventListener('keydown', this._restartHandler)
            this._restartHandler = null
        }
    }

    showWinner(engine, winner) {
        if (!this.gameOverLabel) {
            this.winner = winner
            let text = ''
            if (winner === 'p1') {
                text = `PLAYER 1 WINS!\nP1: ${this.score1}   P2: ${this.score2}`
            } else {
                text = `PLAYER 2 WINS!\nP1: ${this.score1}   P2: ${this.score2}`
            }
            this.gameOverLabel = new Label({
                text,
                pos: new Vector(512 / 2 - 120, 180),
                color: Color.Yellow,
                fontSize: 36,
                textAlign: 'center',
                lineHeight: 1.5
            })
            engine.add(this.gameOverLabel)
            this._restartHandler = (evt) => { /* Restart logic here */ }
            window.addEventListener('keydown', this._restartHandler)
        }
    }

    hideGameOver(engine) {
        if (this.gameOverLabel) {
            engine.remove(this.gameOverLabel)
            this.gameOverLabel = null
        }
    }
}