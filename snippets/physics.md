# Physics en hitbox

In `game.js` kan je `Realistic Physics` of `Arcade Physics` physics aanzetten en de gravity bepalen: 

- `Arcade` physics which is good for basic collision detection for non-rotated rectangular areas. Example: platformers, tile based games, top down, etc
- `Realistic` physics which is good for rigid body games where realistic collisions are desired. Example: block stacking, angry bird's style games, etc

Per actor bepaal je wat er bij een botsing moet gebeuren:

- `CollisionType.Active` (objecten duwen elkaar weg)
- `CollisionType.Passive` (objecten bewegen door elkaar heen)
- `CollisionType.Fixed` (kan niet bewegen, objecten kunnen niet door fixed objecten heen)
- `CollisionType.PreventCollision` (geen collisions)

⚠️ Let op dat al je objecten een [collision](./README.md#collision) box hebben! 

<br><br><br>

## Physics aanzetten

GAME.JS
```js
const options = { 
    width: 800, height: 600, 
    backgroundColor: Color.White,
    physics: {
        solver: SolverStrategy.Realistic,
        gravity: new Vector(0, 800),
    }
}

export class Game extends Engine {
    constructor() {
        super(options)
        this.start(ResourceLoader).then(() => this.startGame())
        this.showDebug(true)  // hitboxen testen
    }
}
```
PLAYER - BOX COLLIDER
```js
export class Player extends Actor {
    constructor() {
        super({ width: 50, height: 10, collisionType: CollisionType.Active })
    }
}
```
PLATFORM - STATIC BOX COLLIDER
```js
export class Platform extends Actor {
    constructor() {
        super({ width: 500, height: 100, collisionType: CollisionType.Fixed })
    }
}
```
<br><br><br>

## Custom Hitbox 

De hitbox hoeft niet hetzelfde te zijn als de `width,height` van de sprite. In dit voorbeeld maken we een custom hitbox.

```js
export class Player extends Actor {
    onInitialise(engine) {
        const box = Shape.Box(100, 100) // optioneel: anchor, offset
        this.collider.set(box)
    }
}
```

<br><br><br>

## Acceleration

Deze rocket vliegt steeds sneller omdat er een acceleratie is.

```js
export class Rocket extends Actor {
    onInitialise(engine) {
        this.acc = new Vector(5,0)
    }
}
```

<br><br><br>

## Physics properties

Je kan een physics body de volgende properties meegeven:

- `this.body.mass` 
- `this.body.inertia`
- `this.body.bounciness`  *(alleen bij useRealisticPhysics)*
- `this.body.friction`    *(alleen bij useRealisticPhysics)*
    
<br><br><br>

## Player controls en physics
    
De physics engine regelt de `velocity` van je objecten zoals de speler. Effecten zoals stuiteren zal je niet zien als je handmatig de `velocity` van een object gaat aanpassen. 

Daarom moet je `applyLinearImpulse` gebruiken om de bestaande `velocity` van een actor aan te passen. De uiteindelijke velocity wordt bepaald door `force`, `mass`, `friction`, etc. Dit werkt goed voor besturing van (ruimte) schepen of auto's. 

Als je handmatig de `velocity` zet, dan voelt de besturing hetzelfde als in een non-physics game. Je kan ook kiezen om de `x` velocity handmatig te zetten (naar links en rechts lopen) en de `y` velocity te doen met `applyLinearImpulse` (springen en vallen).

VOORBEELD
    
```js
class Mario extends Actor {
    constructor(x, y) {
        super({ width: 20, height: 60 })
        this.body.collisionType = CollisionType.Active
        this.body.mass = 7    
    }
    onPreUpdate(engine, delta) {
        if (engine.input.keyboard.isHeld(Keys.D)) {
            this.body.applyLinearImpulse(new Vector(15 * delta, 0))
            // alternatief, links en rechts lopen met velocity
            // this.vel = new Vector(10, this.vel.y)
        }
    
        if (engine.input.keyboard.isHeld(Keys.A)) {
            this.body.applyLinearImpulse(new Vector(-15 * delta, 0))
            // alternatief, links en rechts lopen met velocity
            // this.vel = new Vector(-10, this.vel.y)
        }
    
        if (engine.input.keyboard.wasPressed(Keys.Space)) {
            this.body.applyLinearImpulse(new Vector(0, -250 * delta))
        }
    }
}
```
Als je *Realistic Physics* gebruikt, dan wil je waarschijnlijk niet dat je karakter kan ronddraaien. Dit kan je uitzetten:

```js
this.body.limitDegreeOfFreedom.push(DegreeOfFreedom.Rotation) 
```

<br><br><br>

## Bouncy ball

```js
export class Ball extends Actor {
    constructor(){
        super({ radius: 50 })
        this.graphics.use(Resources.Ball.toSprite())
        this.body.collisionType = CollisionType.Active
        this.body.mass = 6
        this.body.bounciness = 0.7
        this.pos = new Vector(350, -50)
    }
}
```

<Br><br><br>

## Polygon collider

In dit voorbeeld maken we een triangle collider in de `onInitialize()`.

```js
export class Triangle extends Actor {
    onInitialize(engine) {
        const triangle = new PolygonCollider({
            points: [new Vector(-50, 0), new Vector(0, -80), new Vector(50, 0)]
        });
        this.body.collisionType = CollisionType.Fixed
        this.collider.set(triangle)
        this.pos = new Vector(120, 480)
    }
}
```


<Br><br><br>

## Edge collider

Soms wil je alleen een rand hebben waar de speler niet langs mag. Dit kan je doen met een *edge collider*.
In dit voorbeeld loopt de edge van `0,0` naar `200,200`. 

```js
export class Border extends Actor {
    constructor() {
        super()
        let edge = new EdgeCollider({
            begin: new Vector(0, 0),
            end: new Vector(600, 20),
        })
        this.pos = new Vector(100, 500)
        this.body.collisionType = CollisionType.Fixed
        this.collider.set(edge)
    }
}
```


<Br><br><br>

## Composite collider

Je kan meerdere collision shapes *(circles, edges en boxes)* samenvoegen tot 1 collider met een complexe vorm. Hieronder een voorbeeld van een capsule (twee circles en een box) en een coastline (onregelmatige lijnen).

*capsule*

```js
import { Shape, Actor, Vector, CollisionType, CompositeCollider } from "excalibur"

export class Player extends Actor {
    onInitialize(engine) {
        let capsule = new CompositeCollider([
            Shape.Circle(10, new Vector(0, -20)),
            Shape.Box(20, 40),
            Shape.Circle(10, new Vector(0, 20)),
        ])
        this.body.collisionType = CollisionType.Active
        this.collider.set(capsule)
        this.pos = new Vector(400, 100)
    }
}
```
*coastline*

```js
export class CoastLine extends Actor {
    onInitialize(engine) {
        let landscape = new CompositeCollider([
            Shape.Edge(new Vector(0, 0), new Vector(120, 30)),
            Shape.Edge(new Vector(120, 30), new Vector(240, 50)),
            Shape.Edge(new Vector(240, 50), new Vector(320, 10)),
            Shape.Edge(new Vector(320, 10), new Vector(430, 35))
        ])
        this.body.collisionType = CollisionType.Fixed
        this.collider.set(landscape)
        this.pos = new Vector(400, 350)
    }
}
```

<Br><br><br>

## Collision groups

Om te voorkomen dat spelers door hun eigen kogels geraakt kunnen worden kan je [collision groups](../snippets/collisiongroup.md) gebruiken.

