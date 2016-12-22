
import { isArray, isObject } from '../src/utils'

const equals = (t, a, b, prefix=null) => {

    let [ result, msg ] = [true, '']

    prefix = prefix ? prefix + ': ' : ''

    if (a !== b) [ result, msg ] = [
        false,
        `${prefix} expected: ${b}, got ${a}`
    ]

    t.ok(result, msg)
}

const notEquals = (t, a, b, prefix=null) => {

    let [ result, msg ] = [true, '']

    prefix = prefix ? prefix + ': ' : ''

    if (a === b) [ result, msg ] = [
        false,
        `${prefix} expected to not equal ${b}, but it did`
    ]

    t.ok(result, msg)
}

const getKeyHash = (o) => Object.keys(o).sort().join('/')

const getValues = (o) => {

    let values = []

    if (isArray(o)) {
        for (let arrVal of o.sort()) {
            for (let innerValue of getValues(arrVal)) values.push(innerValue)
        }
    }
    else if (isObject(o)) {

        let keys = Object.keys(o).sort()

        for (let k of keys) {
            for (let innerValue of getValues(o[k])) values.push(innerValue)
        }
    }
    else {
        values.push(o)
    }

    return values
}
export { equals, notEquals, getKeyHash, getValues }