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

import { Type } from './type.js'
import { merge, isObject, isString, getClone } from './utils.js'

const registry = {}

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

const Component = (name, state={}) => {

    if (!isString(name) || !name) {
        throw Error('A component must have a name.')
    }

    if (registry[name] !== undefined) {
        let msg = 'Duplicate Component name: ' + name
        throw msg
    }

    let ComponentFunction = makeComponentFunction(name, state)

    registry[name] = ComponentFunction

    return ComponentFunction

}

Component.get = (name) => registry[name]

Component.toInstance = (o, current=null) => Component.toComponent(o, current)()

Component.toComponent = (o, current=null) => {

    // maybe support single top-level key object literals here too

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

export { Component, ComponentType, ComponentInstance }