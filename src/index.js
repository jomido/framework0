
import { Universe } from './universe'

let universe = (namespace) => {

    const universe = Universe(namespace)
    const { Component, Entity, System } = universe

    let components = {
        position:   Component('position', {x: 0, y: 0}),
        size:       Component('size', {w: 0, h: 0}),
        container:  Component('container', {children: []}),
        element:    Component('element', {element: null}),
        flag:       Component('flag'),
        deep:       Component('deep', {a: 1, b: {c: 2, d: [2, 3, 4]}})
    }

    let entities = {
        Empty:      Entity('Empty'),
        JustAFlag:  Entity('JustAFlag', components.flag),
        Thing:      Entity('Thing', components.position, components.size),
        Container:  Entity('Container', components.container),
        Thang:      Entity('Thang', components.deep)
    }

    let instances = {
        thing: entities.Thing({
            position: {x: 19},
            size: {w: 109}
        }),
        thingA: entities.Thing(
            components.position({x: -1}),
            components.size({w: -1})
        ),
        thing2: entities.Thing(),
        empty: entities.Empty(),
        justAFlag: entities.JustAFlag()
    }

    let systems = {
        PositionSystem: System('Position', components.position),
        VisualSystem:   System('Visual',
            components.position,
            components.size,
            components.element
        )
    }

    return { universe, components, entities, instances, systems }
}


let run = (state) => {

    console.log('hi')
}

const copyToWindow = (o) => {

    for (let n in o) window[n] = o[n]
}

const boot = () => {

    const state = universe('earth')

    copyToWindow(state)

    run(state)
}

boot()


