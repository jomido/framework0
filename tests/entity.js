
import { equals, notEquals } from './utils'

import { position, size } from './components'
import { Entity, EntityType, EntityInstance } from '../src/entity'

const tests = {

    'Entity Class instantiation': function (t) {

        let entities = {
            noComponents: {
                EntityClass: Entity('Foo1'),
                expected: {
                    components: '',
                    EntityTypeName: 'Foo1'
                }
            },
            oneComponent: {
                EntityClass: Entity('Foo2', position),
                expected: {
                    components: 'position',
                    EntityTypeName: 'Foo2'
                }
            },
            twoComponents: {
                EntityClass: Entity('Foo3', position, size),
                expected: {
                    components: 'position/size',
                    EntityTypeName: 'Foo3'
                }
            }
            ,
            objectLiterals: {
                EntityClass: Entity(
                    'Foo4',
                    {position: {x: 0, y: 0}},
                    {size: {w: 0, h: 0}}
                ),
                expected: {
                    components: 'position/size',
                    EntityTypeName: 'Foo4'
                }
            }
        }

        let testAttrs = (desc, EntityClass, expected) => {

            equals(
                t,
                EntityType.check(EntityClass),
                expected.EntityTypeName,
                `${desc} EntityType check`
            )

            let instance = EntityClass()
            let c = instance.components

            equals(
                t,
                EntityInstance.check(instance),
                expected.EntityTypeName,
                `${desc} EntityInstance check`
            )
            t.ok(instance, `${desc} instance is truthy`)
            t.ok(c, `${desc} components is truthy `)

            equals(
                t,
                Object.keys(c).sort().join('/'),
                expected.components,
                `${desc} component list check`
            )
        }

        for (let desc in entities) {
            let { EntityClass, expected } = entities[desc]
            testAttrs(desc, EntityClass, expected)
        }

        t.end()
    },
    'Entity lookup': function (t) {

        const Foo1 = Entity.get('Foo1')
        const nonexistent = Entity.get('nonexistent')

        t.ok(Foo1, 'Foo1 is truthy')
        equals(t,
            EntityType.check(Foo1),
            'Foo1',
            'Foo1 is an Entity Class'
        )

        t.ok(!nonexistent, 'nonexistent is falsey')
        equals(t,
            EntityType.check(nonexistent),
            false,
            'nonexistent is an Entity Class'
        )

        t.end()
    },
    'Entity instance check': function (t) {

        const Foo1 = Entity.get('Foo1')
        const foo1 = Foo1()

        t.ok(foo1, 'foo1 is truthy')
        equals(t,
            EntityInstance.check(foo1),
            'Foo1',
            'foo1 is an Entity Instance'
        )
        notEquals(t,
            EntityType.check(foo1),
            'Foo1',
            'foo1 is not an Entity Class'
        )

        t.end()
    }
}

const runOnFail = () => {

    console.log('ruh roh')
    window.Entity = Entity
    window.EntityType = EntityType
    window.EntityInstance = EntityInstance
}

export { tests, runOnFail }