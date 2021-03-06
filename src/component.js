//
// The main export of this module is Component, produces a type of thing I am
// calling a 'data merge factory'. You create a data merging factory like so:
//
//    const shazzam = Component('shazzam', {a: 1, b: 2})
//    const <dmf> = Component(<name>, <state>)
//
// You can call the data merge factory with state again, and it will return another
// data merge factory with the new state merged in:
//
//    const shazzam2 = shazzam({a: -1})
//
// When you call a data merge factory with _no_ state (no argument), then it returns
// an object literal of the state it has accumulated:
//
//    const shaz1 = shazzam()   // {a: 1, b: 2}
//    const shaz2 = shazzam2()  // {a: -1, b: 2}
//
// Beyond this idea, we are also:
//
//   * adding on a loose type system via type.Type
//   * adding the notion of a 'name' to a Component. This name gets expressed
//     via the type system.
//
// This is meant to be the Component part of an Entity Component System (or
// Component/Entity System, which seems to be interchangeable). But generally,
// a better name for this pattern is DataClass or DataFactory.

import { Events } from './events'
import { Type } from './type'
import { Registry } from './registry'
import {
    merge,
    isObject,
    isString,
    getClone,
    getKeys,
    getValues,
    getIterator
} from './utils'

const registry = Registry()
const events = Events()

const ComponentType = Type('Component')
const ComponentInstance = Type('component')

const makeComponentFunction = function (name, state) {

    let ComponentFunction = function (newState) {

        if (!newState) {
            let c = merge({}, state, {clone: true})
            ComponentInstance.set(c, name)
            return c
        }

        // TODO: validate on recursive keyHash here

        return makeComponentFunction(
            name,
            merge.all([
                {},
                state,
                newState
            ], {clone: true})
        )
    }

    ComponentType.set(ComponentFunction, name)

    return ComponentFunction
}

const make = (context) => {

    const Component = (name, state={}) => {

        if (!isString(name) || !name) {
            throw Error('A component must have a name.')
        }

        if (context.registry[name] !== undefined) {
            let msg = 'Duplicate Component name: ' + name
            throw Error(msg)
        }

        let ComponentFunction = makeComponentFunction(name, state)

        context.registry[name] = ComponentFunction

        return ComponentFunction
    }

    Component[Symbol.iterator] = getIterator(() => getValues(context.registry))

    Component.get = (name) => context.registry[name]

    Component.toName = (o) => {

        let name = ComponentType.check(o) || InstanceType.check(o)

        if (name) return name

        let keys = getKeys(o)

        if (keys.length === 1) return keys[0]

        throw Error('toName did not receive a Component, component, or literal with one key')
    }

    Component.toInstance = (o, current=null) => Component.toComponent(o, current)()

    Component.toComponent = (o, current=null) => {

        let componentType = ComponentType.check(o)

        if (componentType) {
            return Component.componentToComponent(o, current)
        }

        let instanceType = ComponentInstance.check(o)

        if (instanceType) {
            return Component.instanceToComponent(o, instanceType, current)
        }

        if (!isObject(o)) {
            throw 'Invalid argument :o to toInstance: ' + o
        }

        return Component.literalToComponent(o, current)
    }

    Component.componentToComponent = (component, current=null) => {

        if (!current) return component

        let instance = component()
        let comp = component(current)(instance)

        return comp

    }

    Component.instanceToComponent = (instance, instanceType=null, current=null) => {

        instanceType = instanceType || ComponentInstance.check(instance)
        let component = Component.get(instanceType)
        let comp = component(current || {})(instance)

        return comp
    }

    Component.literalToComponent = (literal, current) => {

        let keys = Object.keys(literal)

        if (keys.length !== 1) {
            throw Error('Invalid object argument :literal to literalToInstance: ' + keys.join('/'))
        }

        let componentType = keys[0]
        let component = Component.get(componentType)

        if (!component) throw Error(`No such component '${componentType}'`)

        let instance = literal[componentType]
        let comp = component(current || {})(instance)

        return comp
    }

    return Component
}

const Component = make({registry, events})

export { Component, ComponentType, ComponentInstance, make }