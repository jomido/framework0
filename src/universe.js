import { make as makeComponentContent } from './component'
import { make as makeEntityContent } from './entity'
import { make as makeSystemContent } from './system'
import { Type } from './type'
import { Events } from './events'
import { Registry } from './registry'
import { isString } from './utils'

const UniverseType = Type('Universe')
const UniverseInstance = Type('universe')

const content = Symbol('universe-content')
const Context = (namespace=null) => {
    return {registry: Registry(), events: Events(namespace)}
}

const Universe = (namespace=null) => {

    if (namespace && !isString(namespace)) throw Error('Universe namespace must be a string.')

    const componentContext = Context(namespace ? `${namespace}:component` : namespace)
    const entityContext = Context(namespace ? `${namespace}:entity` : namespace)
    const systemContext = Context(namespace ? `${namespace}:system` : namespace)

    const { Component } = makeComponentContent(componentContext)
    const { Entity } = makeEntityContent(entityContext)
    const { System } = makeSystemContent(systemContext)

    const universe = {
        [content]: {
            Component,
            Entity,
            System
        }
    }

    UniverseInstance.set(universe, namespace)

    return universe
}

UniverseType.set(Universe)

export { Universe, UniverseType, UniverseInstance }

