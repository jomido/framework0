
import stampit from 'stampit'
import { Component } from './component'
import { Entity } from './entity'
import { Registry } from './registry'
import { Events } from './events'
import { isString, getIterator, getValues } from './utils'
import { Type } from './type'

const SystemType = Type('System')
const SystemInstance = Type('system')

const registry = Registry()
const events = Events()

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

const make = (context) => {

    const System = (name, ...states) => {

        if (!isString(name)) throw Error('System name arg must be a string.')

        if (context.registry[name] !== undefined) {
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
        context.registry[name] = SystemFunction

        return SystemFunction
    }

    System.get = (name) => context.registry[name]

    System[Symbol.iterator] = getIterator(() => getValues(context.registry))

    return System
}

const System = make({registry, events})

export { System, SystemType, SystemInstance, make }