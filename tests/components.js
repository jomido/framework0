
import { Component } from '../src/component.js'

// components for testing
const position = Component('position', {x: 0, y: 0})
const size = Component('size', {w: 10, h: 10})
const container = Component('container', {children: []})
const element = Component('element', {template: 'div'})

export {
    container,
    element,
    position,
    size
}
