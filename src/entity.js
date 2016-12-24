
import stampit from 'stampit'

import {

    merge,
    isObject,
    isArray,
    isString,
    keyLength,
    getPropByPath,
    setPropByPath

} from './utils.js'

import {

    Component,
    ComponentType,
    ComponentInstance

} from './component.js'

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

    if (paths.length === 0) return Entity.definition(entity)

    let values = []

    for (let path of paths) {

        let realPath = isString(path) ? path : (
            ComponentType.check(path)
            || ComponentInstance.check(path)
        )

        let pathParts = realPath.split('.')
        let componentName = pathParts[0]

        if (!isString(realPath)) {
            values.push(undefined)
            continue
        }

        let value = getPropByPath(entity, 'components.' + realPath)
        let clone

        if (isObject(value)) {
            if (pathParts.length === 1)  { // i don't like this
                clone = Component.get(componentName)(value)()  // returns a clone
            }
            else {
                clone = merge({}, value, {clone: true})
            }
        }
        else if (isArray(value)) {
            // this probably doesn't work...
            if (pathParts.length === 1)  { // i don't like this
                clone = Component.get(componentName)(value)()
            }
            else {
                clone = merge([], value, {clone: true})
            }
        }
        else {
            clone = value
        }

        values.push(clone)
    }

    if (values.length == 1) return values[0]

    return values
}

const setComponentByString = (entity, pathValue) => {

    if (pathValue.length > 2) throw Error('too many args to set entity component via path string')

    let [path, value] = pathValue
    let pathParts = path.split('.')
    let componentName = pathParts[0]
    let realPath = pathParts.slice(1, pathParts.length).join('.')
    let instance = Component.get(componentName)()

    setPropByPath(instance, realPath, value)

    entity.set(instance)

    let componentNames = [componentName]

    return componentNames
}

const setComponentValues = (entity, definitions) => {

    let componentNames
    let componentName

    if (isString(definitions[0])) return setComponentByString(entity, definitions)

    for (let definition of definitions) {

        componentNames = setComponent(entity.components, definition, true)

        for (componentName of componentNames) {
            entity.components[componentName] = entity.components[componentName]()
        }
    }
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

const setComponent = (o, state, failIfNew=false) => {

    let componentNames = []

    if (type.isPlainObject(state) && keyLength(state) > 1) {
        for (let componentName in state) {
            componentNames = setComponent(
                o,
                {[componentName]: state[componentName]},
                failIfNew
            )
        }

        return componentNames
    }

    let component = Component.toComponent(state)
    let componentName = ComponentType.check(component)

    if (failIfNew && !(componentName in o)) {
        throw Error('Entity has no component "' + componentName + '"')
    }

    o[componentName] = component

    componentNames.push(componentName)

    return componentNames
}

const Entity = (name, ...components) => {

    if (!(isString(name))) {
        throw Error('Entity first argument must be a string (a name).')
    }

    if (registry[name] !== undefined) {
        let msg = 'Duplicate Entity name: ' + name
        throw Error(msg)
    }

    let comps = {}

    for (let component of components) {

        if (!component) throw Error(
            'component passed to Entity is bad: ' + component
        )

        setComponent(comps, component)
    }

    let EntityFunction = (...states) => {

        // a :state is either a component or an object literal
        // whose keys are component names, and whose values are override
        // data for the corresponding component

        let entity = BaseStamp()
        entity.components = merge({}, comps, {clone: true})

        for (let state of states) {
            setComponent(entity.components, state, true)
        }

        // turn all components into instances
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

const make = (context) => {
    return { Entity }
}

export { Entity, EntityType, EntityInstance, make }
