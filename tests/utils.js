
import { isArray, isObject, isString, getKeys } from '../src/utils'

const equals = (t, a, b, prefix=null) => {

    let [ result, msg ] = [true, '']

    prefix = prefix ? prefix + ': ' : ''

    if (a !== b) [ result, msg ] = [
        false,
        `${prefix} expected: ${b}, got ${a}`
    ]

    t.ok(result, msg)

    return result
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

const getAllKeys = (o, {maxDepth=0, depth=0}={}) => {

    if (!isObject(o)) return []

    let keys = getKeys(o)

    if (maxDepth === 0 || maxDepth > depth + 1) {

        for (let k of keys) {
            for (let innerKey of getAllKeys(
                o[k],
                { maxDepth, depth: depth + 1},
            )) keys.push(innerKey)
        }
    }

    return keys
}

const getKeyHash = (o, opts) => getAllKeys(o, opts).join('/')

const getAllValues = (o) => {

    let values = []

    if (isArray(o)) {
        for (let arrVal of o) {
            for (let innerValue of getAllValues(arrVal)) values.push(innerValue)
        }
    }
    else if (isObject(o)) {

        let keys = Object.keys(o).sort()

        for (let k of keys) {
            for (let innerValue of getAllValues(o[k])) values.push(innerValue)
        }
    }
    else if (isString(o)) {

        values.push('"' + o + '"')
    }
    else {
        values.push(o)
    }

    return values
}

const getValueHash = (o) => getAllValues(o).join(',')

export { equals, notEquals, getKeyHash, getValueHash, getAllValues }