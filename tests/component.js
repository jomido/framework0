
import { equals, notEquals } from './utils'

import { position, size } from './components'
import { Component, ComponentType, ComponentInstance } from '../src/component'

const tests = {

    'Component Class instantiation': function (t) {

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
                `${desc} component keys check`
            )
        }

        for (let desc in components) {
            let { ComponentClass, expected } = components[desc]
            testAttrs(desc, ComponentClass, expected)
        }

        t.end()
    },
    'Component class is in registry': function (t) {

        const foo1 = Component.get('foo1')
        equals(t,
            ComponentType.check(foo1),
            'foo1',
            'foo1 is in registry'
        )

        t.end()
    },
    'Component Class cannot create two with same name': function (t) {

        const bar1 = Component('bar1')

        t.throws(
            () => Component('bar1'),
            /Duplicate Component name/,
            'Should not be able to create two "bar1" components'
        )

        t.end()
    },
    'Component Class lookup': function (t) {

        const foo1 = Component.get('foo1')
        const foo2 = Component.get('foo2')
        const nonexistent = Component.get('nonexistent')

        t.ok(foo1 && ComponentType.check(foo1), 'foo1 is a Component')
        t.ok(foo2 && ComponentType.check(foo1), 'foo2 is a Component')
        t.ok(
            !nonexistent && !(ComponentType.check(nonexistent)),
            'nonexistent is falsey and not a Component'
        )

        t.end()
    },
    'Component Class accumulation, instancing and immutability': function (t) {

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