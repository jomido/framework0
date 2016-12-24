
import { Component, ComponentType, ComponentInstance } from './component'
import { Entity, EntityType, EntityInstance } from './entity'
import { merge } from './utils'
import { Type, type } from './type'
import { System, SystemType, SystemInstance } from './system'
import { Universe, UniverseType, UniverseInstance } from './universe'

import stampit from 'stampit'

let globals = () => {

    let globals = {

        Type,
        type,

        Entity,
        EntityType,
        EntityInstance,

        Component,
        ComponentType,
        ComponentInstance,

        System,
        SystemType,
        SystemInstance,

        stampit,
        merge
    }

    return globals
}

let components = (globals) => {

    let Component = globals.Component

    let components = {
        position: Component('position', {x: 0, y: 0}),
        size: Component('size', {w: 0, h: 0}),
        container: Component('container', {children: []}),
        element: Component('element', {element: null}),
        flag: Component('flag'),
        deep: Component('deep', {a: 1, b: {c: 2, d: [2, 3, 4]}})
    }

    return components
}

let entities = (globals, components) => {

    let Entity = globals.Entity

    let entities = {
        Empty: Entity('Empty'),
        JustAFlag:  Entity('JustAFlag', components.flag),
        Thing: Entity('Thing', components.position, components.size),
        Container: Entity('Container', components.container),
        Thang: Entity('Thang', components.deep)
    }

    return entities
}

let instances = (globals, components, entities) => {

    const { Thing, Empty, JustAFlag } = entities
    const { position, size } = components

    const thing = Thing({
        position: {x: 19},
        size: {w: 109}
    })

    const thingA = Thing(
        position({x: -1}),
        size({w: -1})
    )

    const thing2 = Thing()

    const empty = Empty()
    const justAFlag = JustAFlag()



    return { thing, thing2, thingA, empty, justAFlag }
}

let systems = (globals, components, entities, instances) => {

    const PositionSystem = System('Position', components.position)
    const VisualSystem = System(
        'Visual',
        components.position,
        components.size,
        components.element
    )

    return { PositionSystem, VisualSystem }
}

let universe = (namespace=null) => {

    let key = namespace || 'universe'

    return {
        [key]: Universe(namespace)
    }
}

let run = (globals, components, entities, instances, systems, universes) => {

    const { position } = components
    const { thing, thing2, thingA, empty, justAFlag } = instances

    console.log(thing.get())
    console.log(thingA.get())

    let pos = thing.get(position)
    console.log(pos.x)

    pos.x = 20
    thing.set(pos)
    console.log(thing.get('position').x)

    thing.set(position({x: 21, y: thing.get('position.y')}))
    console.log(thing.get('position.x'))

    thing.set({position: {x: 22}})
    console.log(thing.get().position.x)

    console.log(pos.x)
}

const copyToWindow = (o) => {

    for (let n in o) window[n] = o[n]
}

const boot = () => {

    const g = globals()
    const c = components(g)
    const e = entities(g, c)
    const i = instances(g, c, e)
    const s = systems(g, c, e, i)
    const u = universe('earth')

    for (let o of [g, c, e, i, s, u]) copyToWindow(o)

    run(g, c, e, i, s, u)
}

boot()


