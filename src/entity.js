
import stampit from 'stampit'

import {
    merge, isObject, isArray, isString,
    getPropByPath } from './utils.js'

import { ComponentType, ComponentInstance } from './component.js'
import { Type, type } from './type.js'

const EntityType = Type('Entity')
const EntityInstance = Type('entity')

const registry = {}

const state = { id: null }

let entityId = 0

const next = () => {
    let id = entityId
    entityId += 1
    return id
}

const hasComponents = (entity, components) => {

    for (let component of components) {

        let path = component
        let componentName = ComponentType.check(path)

        if (componentName) path = componentName
        if (!isString(path)) return false
        if (!entity.components[path]) return false
    }

    return true
}

const addComponents = (entity, components) => {

    for (let component of components) {

        let componentName = ComponentType.check(component)

        if (!componentName) continue
        if (componentName in entity.components) continue

        let instance = component()
        entity.components[componentName] = instance
    }

    return entity
}

const removeComponents = (entity, components) => {

    for (let component of components) {

        let componentName = ComponentType.check(component)

        if (!componentName) continue
        if (!(componentName in entity.components)) continue

        delete entity.components[componentName]
    }

    return entity
}

const getComponentValues = (entity, paths) => {

    if (paths.length === 0) {

        // return a "definition"
        return Entity.definition(entity)
    }

    let values = []

    for (let path of paths) {

        let realPath

        let componentType = ComponentType.check(path)
        if (componentType) realPath = componentType

        if (!realPath) {
            let instanceType = ComponentInstance.check(path)
            if (instanceType) realPath = instanceType
        }

        if (!realPath) realPath = path

        if (!isString(realPath)) {
            values.push(undefined)
            continue
        }

        let value = getPropByPath(entity, 'components.' + realPath)
        let clone

        if (isObject(value)) {
            clone = Component.get(realPath)(value)()  // merge({}, value, {clone: true})
        }
        else if (isArray(value)) {
            clone = Component.get(realPath)(value)()  // merge([], value, {clone: true})
        }
        else {
            clone = value
        }

        values.push(clone)
    }

    if (values.length == 1) return values[0]

    return values
}

const setComponentValues = (entity, definitions) => {

    // maybe clone entire component on setting any value; that way we can
    // do diffs on components to assert when a system should run against
    // the entity

    // definitions can be object literals, components, or component instances
}

const api = {
    add (...components) { return addComponents(this, components) },
    remove (...components) { return removeComponents(this, components) },
    get (...paths) { return getComponentValues(this, paths)},
    set (...definitions) { return setComponentValues(this, definitions)},
    has (...components) { return hasComponents(this, components)}
}

const init = function () { this.id = next(entityId) }

const BaseStamp = stampit()
    .props(state)
    .methods(api)
    .init(init)

const Entity = (name, ...components) => {

    if (registry[name] !== undefined) {
        let msg = 'Duplicate Entity name: ' + name
        throw msg
    }

    let comps = {}

    for (let component of components) {
        let componentName = ComponentType.check(component)
        comps[componentName] = component
    }

    let ComponentStamp = stampit().deepProps({
        components: comps
    })

    let EntityStamp = stampit(BaseStamp, ComponentStamp)

    let EntityFunction = (...component_states) => {

        // a :component_state is either a component or an object literal
        // whose keys are component names, and whose values are override
        // data for the corresponding component

        let entity = EntityStamp()

        for (let component_state of component_states) {

            if (isObject(component_state)) {
                for (let component in component_state) {
                    let state = component_state[component]
                    let comp = entity.components[component]
                    if (!comp) {
                        throw 'Entity has no component "' + component + '"'
                    }
                    entity.components[component] = comp(state)
                }
            }
            else if (type.check(component_state) === 'Component') {
                let componentName = ComponentType.check(component_state)
                let comp = entity.components[componentName]
                entity.components[componentName] = comp(component_state())
            }
        }

        for (let component in entity.components) {
            entity.components[component] = entity.components[component]()
        }

        EntityInstance.set(entity, name)
        return entity
    }

    EntityType.set(EntityFunction, name)

    registry[name] = EntityFunction

    return EntityFunction
}

Entity.definition = (entity) => merge(
    {},
    entity.components || {},
    {clone: true}
)

Entity.get = (name) => registry[name]

export { Entity, EntityType, EntityInstance }
