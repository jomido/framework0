
import { equals, notEquals } from './utils'

import { position, size } from '../src/components'
import { Component, ComponentType, ComponentInstance } from '../src/component'

const tests = {

    'Ways of instantiating a component class': function (t) {

        let components = {
            noData: {
                ComponentClass: Component('foo1'),
                expected: {
                    keys: '',
                    ComponentTypeName: 'foo1'
                }
            },
            withData: {
                ComponentClass: Component('foo2', {a: 1, b: 2}),
                expected: {
                    keys: 'a/b',
                    ComponentTypeName: 'foo2'
                }
            }
        }

        let testAttrs = (desc, ComponentClass, expected) => {

            equals(
                t,
                ComponentType.check(ComponentClass),
                expected.ComponentTypeName,
                `${desc} ComponentType check`
            )

            let instance = ComponentClass()

            equals(
                t,
                ComponentInstance.check(instance),
                expected.ComponentTypeName,
                `${desc} ComponentInstance check`
            )
            t.ok(instance, `${desc} instance is truthy`)

            equals(
                t,
                Object.keys(instance).sort().join('/'),
                expected.keys,
                `{desc} component keys check`
            )
        }

        for (let desc in components) {
            let { ComponentClass, expected } = components[desc]
            testAttrs(desc, ComponentClass, expected)
        }

        t.end()
    },
    'Component class accumulation, instancing and immutability': function (t) {

        const data = {a: 1, b: 2}
        const a = Component('a', data)

        let i1 = a()

        notEquals(t, i1, data, 'instance literal !== data literal')
        equals(t, i1.a, data.a, 'a1.a === data.a')
        equals(t, i1.b, data.b, 'a1.b === data.b')

        const override = {a: -1}
        const a2 = a(override)

        t.ok(
            ComponentType.check(a2),
            'a2 is still a ComponentClass'
        )

        let i2 = a2()

        notEquals(t, i2.a, data.a, 'a2.a !== data.a')
        equals(t, i2.a, override.a, 'a2.a === override.a')
        equals(t, i2.b, data.b, 'a2.b === data.b')

        t.end()
    }
}

const runOnFail = () => {

    console.log('ruh roh, component.js')
    window.Component = Component
    window.ComponentType = ComponentType
    window.ComponentInstance = ComponentInstance
}

export { tests, runOnFail }