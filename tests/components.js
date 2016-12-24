
import { Component } from '../src/component.js'

// components for testing
const position = Component('position', {x: 0, y: 0})
const size = Component('size', {w: 10, h: 10})
const container = Component('container', {children: []})
const element = Component('element', {template: 'div'})
const empty = Component('empty')
const deep = Component('deep', {a: 1, b: {c: 2, d: [2, 3, 4]}})
const arr = Component('arr', [1, 2, 3])

export {
    arr,
    container,
    deep,
    element,
    position,
    size,
    empty
}
