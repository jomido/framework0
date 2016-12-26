import { Component, make as makeComponentContent } from './component'
import { Entity, make as makeEntityContent } from './entity'
import { System, make as makeSystemContent } from './system'
import { Type } from './type'
import { Events } from './events'
import { Registry } from './registry'
import { isString } from './utils'

const UniverseType = Type('Universe')
const UniverseInstance = Type('universe')
const registry = Registry()

const Context = (namespace=null) => {
    return {registry: Registry(), events: Events(namespace)}
}

const Universe = (namespace=null) => {

    if (namespace && !isString(namespace)) throw Error('Universe namespace must be a string.')

    if (namespace && namespace in registry) {
        let msg = `Duplicate universe name '${namespace}'`
        throw Error(msg)
    }

    let C, E, S

    if (namespace === null) {

        C = Component
        E = Entity
        S = System
    }
    else {

        const events = Events(namespace)
        const componentContext = Context(events)
        const entityContext = Context(events)
        const systemContext = Context(events)

        C = makeComponentContent(componentContext)
        entityContext.Component = C
        E = makeEntityContent(entityContext)
        systemContext.Component = C
        systemContext.Entity = E
        S = makeSystemContent(systemContext)

    }

    const universe = {
        Component: C,
        Entity: E,
        System: S
    }

    UniverseInstance.set(universe, namespace)

    registry[namespace] = universe

    return universe
}

UniverseType.set(Universe)

Universe.get = (namespace=null) => registry[namespace]

export { Universe, UniverseType, UniverseInstance }

