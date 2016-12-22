// type system notes (a.k.a. fun with Symbols)
//
// `type.check(<o>)` returns the string name of o's type, if it has one
//
// `let SomeType = Type('SomeType')` creates a new type called SomeType
//
// `let SomeInstance = Type('someType'`) creates a new type that is
// conventially the instance of SomeType.
//
// `SomeType.set(<o>)` will set the type of o to SomeType. The expression
// `SomeType.check(<o>)` will return `true`.
//
// `SomeType.setAs(<o>, token)` will set the type of o to SomeType, with the
// token `token`. The expression `SomeType.check(<o>)` will return `token`.

import { isString, isFunction, isObject } from './utils.js'

const isTypeable = (o) => isFunction(o) || isObject(o)

// bootstrap for 'type' Type
const typeSymbol = Symbol.for('type')
const checkType = (o) => isTypeable(o) ? o[typeSymbol] : false
const setAsType = (o) => {
    o[typeSymbol] = 'type'
}
const type = {
    symbol: typeSymbol,
    check: checkType,
    set: setAsType
}

const registry = {
    type: type
}

const Type = (name) => {

    // :name is a string

    if (registry[name] !== undefined) {
        let msg = 'Duplicate Type name: ' + name
        throw Error(msg)
    }

    const symbol = Symbol.for(name)
    const check = (o) => isTypeable(o) ? o[symbol] : false
    const set = (o, token=null) => {
        o[symbol] = token || true
        o[typeSymbol] = name
    }
    const typeDefinition = {
        symbol: symbol,
        check: check,
        set: set
    }

    type.set(typeDefinition)

    registry[name] = typeDefinition

    return typeDefinition
}


Type.get = (o) => {

    if (isString(o)) return registry[o]

    let oType = type.check(o)

    if (oType) return registry(oType)
}

export { Type, type }
