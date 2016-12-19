//
// The main export of this module is Component, produces a type of thing I am
// calling a 'data merge factory'. You create a component (a 'merging
// object literal') like so:
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
// Beyond this idea, we are also adding on a loose type system via types.Types.
// And we are adding the notion of a 'name' to a Component. The name gets
// expressed via the type system.
//

import { Type } from './type.js'
import { merge } from './utils.js'

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

const Component = (name, state) => {

    if (registry[name] !== undefined) {
        let msg = 'Duplicate Component name: ' + name
        throw msg
    }

    let ComponentFunction = makeComponentFunction(name, state)

    registry[name] = ComponentFunction

    return ComponentFunction

}

Component.get = (name) => registry[name]

export { Component, ComponentType, ComponentInstance }