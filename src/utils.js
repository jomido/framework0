const merge = require('deepmerge')
const o = {}

const isObject = (obj) => obj && o.toString.call(obj) === '[object Object]'
const isFunction = (fn) => fn && o.toString.call(fn) === '[object Function]'
const isArray = (obj) => Object.prototype.toString.call(obj) === '[object Array]'
const isString = (obj) => ({}).toString.call(obj) === '[object String]'
const isNumber = (obj) => typeof obj === 'number'
const isDomElement = (obj) => obj.tagName ? true : false
const isDomNode = (obj) => obj.nodeName ? true : false
const isEmpty = (obj) => {

    if (isArray(obj) && obj.length === 0) return true
    if (isObject(obj) && Object.keys(obj).length === 0) return true
    if (isString(obj) && obj.length === 0) return true
    return false
}

const getPropByPath = (o, s) => {

    `
    Given an object literal o, and a string path s, find the value
    located on o that maps to s:

      o = {a: {one: 1, two: 2}, b: 3}

      s = 'a.one' -> 1
      s = 'b'     -> 3
      s = 'a'     -> {one: 1, two: 2}
    `

    if (o === undefined) {
        return o
    }

    let idx = s.indexOf('.')

    if (idx === -1) {
        return o[s]
    }

    return getPropByPath(
        o[s.substring(0, idx)],
        s.substring(idx + 1, s.length)
    )
}

const setPropByPath = (o, s, v) => {

    `
    Given an object literal o, a string path s, and a value v, set
    the value located on o that maps to s, to v:

        o = {a: {one: 1, two: 2}, b: 3}
        v = 100

        s = 'a.one' -> sets o.a.one to 100
    `

    let idx = s.indexOf('.')

    if (idx === -1) {
        o[s] = v
        return
    }

    let head = s.substring(0, idx)
    let tail = s.substring(idx + 1, s.length)

    idx = tail.indexOf('.')

    if (idx === -1) {
        o[head][tail] = v
    }
    else {
        if (head.length === 0) { // head is 0 if path starts with a '.'!
            setPropByPath(o, tail, v)
        }
        else {
            setPropByPath(o[head], tail, v)
        }
    }
}

const deletePropByPath = (o, s) => {

    `
    Given an object literal o and a string path s, delete
    the leaf of the path located on o:

        o = {a: {one: 1, two: 2}, b: 3}
        s = 'a.one' -> deletes o.a.one
    `

    let idx = s.indexOf('.')

    if (idx === -1) {
        delete o[s]
        return
    }

    let head = s.substring(0, idx)
    let tail = s.substring(idx + 1, s.length)

    idx = tail.indexOf('.')

    if (idx === -1) {

        if (!(isObject(o[head]))) return
        delete o[head][tail]
    }
    else {
        if (head.length === 0) { // head is 0 if path starts with a '.'!
            deletePropByPath(o, tail)
        }
        else {
            deletePropByPath(o[head], tail)
        }
    }
}

const capitalize = (str, lowercaseRest=true) => {

    if (lowercaseRest) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    }

    return str.charAt(0).toUpperCase() + str.slice(1)
}

export {
    capitalize,
    deletePropByPath,
    getPropByPath,
    isArray,
    isDomElement,
    isDomNode,
    isEmpty,
    isFunction,
    isNumber,
    isObject,
    isString,
    merge,
    setPropByPath
}