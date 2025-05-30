const Resources = {
    Ship: new ImageSource('images/ship.png'),
    Obstacle: new ImageSource('images/obstacle.png'),
    Enemy: new ImageSource('images/enemy.png'),
    Bomb: new ImageSource('images/bomb.png'),
    Background: new ImageSource('images/background.jpg'),
    Explosion: new ImageSource('images/explosion.png')
}

const ResourceLoader = new Loader()
for (let res of Object.values(Resources)) {
    ResourceLoader.addResource(res)
}

export { Resources, ResourceLoader }