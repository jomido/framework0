
import { Entity } from './entity'
import { position, size } from './components.js'

const Thing = Entity(
    'Thing',
    position({x: 8, y: 8}),
    size
)

export { Thing }
