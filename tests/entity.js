
import { equals } from './utils'

import { position, size } from '../src/components'
import { Entity, EntityType, EntityInstance } from '../src/entity'

const tests = {

    'Ways of instantiating an entity class': function (t) {

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
    }
}

const runOnFail = () => {

    console.log('ruh roh')
    window.Entity = Entity
    window.EntityType = EntityType
    window.EntityInstance = EntityInstance
}

export { tests, runOnFail }