
import stampit from 'stampit'
import { Component } from './component'
import { Entity } from './entity'
import { isString } from './utils'
import { Type } from './type'

const SystemType = Type('System')
const SystemInstance = Type('system')

const registry = []

const methods = {

    run(...entities) {

        console.log(`${this.name} runs against ${entities.length} entities.`)
    }
}

const init = function (componentNames) {

    this.components = new Set(componentNames)
}

const BaseStamp = stampit()
    .methods(methods)
    .init(init)

const System = (name, ...states) => {

    if (!isString(name)) throw Error('System name arg must be a string.')

    if (registry[name] !== undefined) {
        let msg = 'Duplicate Entity name: ' + name
        throw Error(msg)
    }

    const componentNames = states.map(Component.toName)

    let SystemFunction = () => {

        const system = BaseStamp(componentNames)
        system.name = name

        SystemInstance.set(system, name)

        return system
    }

    SystemType.set(SystemFunction, name)
    registry[name] = SystemFunction

    return SystemFunction
}

System.get = (name) => registry[name]

const make = (context) => {
    return { System }
}

export { System, SystemType, SystemInstance, make }