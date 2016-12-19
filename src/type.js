
import { isString } from './utils.js'

// bootstrap for 'type' Type
const typeSymbol = Symbol.for('type')
const checkType = (o) => o[typeSymbol]
const setAsType = (o) => {
    o[typeSymbol] = true
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
        throw msg
    }

    const symbol = Symbol.for(name)
    const check = (o) => o[symbol]
    const setAs = (o, token=null) => {
        o[symbol] = token || true
        o[typeSymbol] = name
    }
    const typeDefinition = {
        symbol: symbol,
        check: check,
        set: setAs
    }

    type.set(typeDefinition)

    registry[name] = typeDefinition

    return typeDefinition
}


Type.get = (o) => {

    if (isString(o)) return registry(o)

    let oType = type.check(o)

    if (oType) return registry(oType)
}

export { Type, type }

//
// type system notes (a.k.a. fun with Symbols)
//
// `type.check(<o>)` returns the string name of o's type, if it has one
//
// `let SomeType = Type.get('SomeType')` creates a new type called SomeType
//
// `let SomeInstance = Type.get('someType'`) creates a new type that is
// conventially the instance of SomeType.
//
// `SomeType.setAs(<o>)` will set the type of o to SomeType. The expression
// `SomeType.check(<o>)` will return `true`.
//
// `SomeType.setAs(<o>, token)` will set the type of o to SomeType, with the
// token `token`. The expression `SomeType.check(<o>)` will return `token`.