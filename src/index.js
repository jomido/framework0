
import { Thing } from './thing.js'
import { Component, isComponent, ComponentType } from './component.js'
import { position, size, element, container } from './components.js'
import { Entity } from './entity.js'
import { merge } from './utils.js'
import { Types } from './types'

import stampit from 'stampit'

window.Entity = Entity
window.Types = Types
window.Thing = Thing
window.Component = Component
window.isComponent = isComponent
window.ComponentType = ComponentType
window.element = element
window.container = container
window.position = position
window.size = size
window.stampit = stampit
window.merge = merge

const thing = Thing({
    position: {x: 19},
    size: {w: 109}
})

const thingA = Thing(
    position({x: -1}),
    size({w: -1})
)

console.log(thing.get())
console.log(thingA.get())

const thing2 = Thing()
window.thing = thing
window.thing2 = thing2

let pos = thing.get(position)
console.log(pos)

pos.x = 209
thing.set(pos)

console.log(thing.get('position'))
