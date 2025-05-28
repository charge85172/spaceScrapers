import { ImageSource, Sound, Resource, Loader } from 'excalibur'

// Voeg hier jouw eigen resources toe
const Resources = {
    Ship: new ImageSource('images/ship.png'),
    Obstacle: new ImageSource('images/obstacle.png'),
    Enemy: new ImageSource('images/enemy.png')
}

const ResourceLoader = new Loader()
for (let res of Object.values(Resources)) {
    ResourceLoader.addResource(res)
}

export { Resources, ResourceLoader }