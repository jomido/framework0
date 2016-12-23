
import { equals, getKeyHash, getValues } from './utils'
import { position, size, empty, deep } from './components'

import { isObject, isNumber } from '../src/utils'
import { Entity } from '../src/entity'

const posOverride = {x: 7, y: 7}
const pos = position(posOverride)
const Thing = Entity(
    'Thing',
    pos,
    size
)

const Empty = Entity('Entity', empty)
const DeepEntity = Entity('DeepEntity', deep)

let idOffset = null

const tests = {

    'Entity Instance instantiation': function (t) {

        let defaults = {
            position: position(),
            size: size()
        }

        let things = {
            noArgs: {
                thing: Thing(),
                expected: {
                    position: posOverride,
                    size: defaults.size,
                    components: 'position/size',
                    id: 0
                }
            },
            viaComponent: {
                thing: Thing(position),
                expected: {
                    position: defaults.position,
                    size: defaults.size,
                    components: 'position/size',
                    id: 1
                }
            },
            viaComponents: {
                thing: Thing(position, size),
                expected: {
                    position: defaults.position,
                    size: defaults.size,
                    components: 'position/size',
                    id: 2
                }
            },
            viaComponentInstance: {
                thing: Thing(position({x:2, y:2})),
                expected: {
                    position: {x: 2, y: 2},
                    size: defaults.size,
                    components: 'position/size',
                    id: 3
                }
            },
            viaComponentInstances: {
                thing: Thing(position({x:2, y:2}), size({w: 3, h: 3})),
                expected: {
                    position: {x: 2, y: 2},
                    size: {w: 3, h: 3},
                    components: 'position/size',
                    id: 4
                }
            },
            viaLiteral: {
                thing: Thing({position: {x:2, y:2}}),
                expected: {
                    position: {x: 2, y: 2},
                    size: defaults.size,
                    components: 'position/size',
                    id: 5
                }
            },
            viaLiterals: {
                thing: Thing({position: {x:2, y:2}}, {size: {w:3, h:3}}),
                expected: {
                    position: {x: 2, y: 2},
                    size: {w: 3, h: 3},
                    components: 'position/size',
                    id: 6
                }
            },
            viaBigLiteral: {
                thing: Thing({position: {x:2, y:2}, size: {w:3, h:3}}),
                expected: {
                    position: {x: 2, y: 2},
                    size: {w: 3, h: 3},
                    components: 'position/size',
                    id: 7
                }
            }
        }

        let testAttrs = (desc, thing, expected) => {

            if (idOffset === null) idOffset = thing.id

            let c = thing.components

            t.ok(thing, `${desc} thing is truthy`)
            t.ok(c, `${desc} components is truthy `)
            t.ok(
                thing.id == expected.id + idOffset,
                `${desc} id is ${expected.id}, but was ${thing.id} `
            )
            t.ok(
                getKeyHash(c) === expected.components,
                `${desc} component list is {${expected.components}}`
            )
            t.ok(c.position, `${desc} position is truthy `)
            t.ok(c.size, `${desc} size is truth`)
            t.ok(
                c.position.x === expected.position.x,
                `${desc} position.x is ${expected.position.x}, but was ${c.position.x}`
            )
            t.ok(
                c.position.y === expected.position.y,
                `${desc} position.y is ${expected.position.y}`
            )
            t.ok(
                c.size.w === expected.size.w,
                `${desc} size.w is ${expected.size.w}`
            )
            t.ok(
                c.size.h === expected.size.h,
                `${desc} size.h is ${expected.size.h}`
            )
        }

        for (let desc in things) {
            let { thing, expected } = things[desc]
            testAttrs(desc, thing, expected)
        }

        t.end()
    },
    'Entity Instance api': function (t) {

        const thing1 = Thing()

        let p = pos()
        let s = size()
        let definition = {
            position: p,
            size: s
        }
        let definitionKeys = getKeyHash(definition)
        let definitionValues = getValues(definition)

        let thing1Definition = thing1.get()

        equals(t,
            getKeyHash(thing1Definition),
            definitionKeys,
            'thing1 definition keys === initial definition keys'
        )

        let thing1Values = getValues(thing1Definition)
        let n = 0

        for (let v of thing1Values) {
            equals(t, v, definitionValues[n],
                'thing1 values === initial definition values'
            )
            n += 1
        }

        t.ok(
            isObject(thing1.get(position)),
            'instance position is object via get(component)'
        )

        t.ok(
            isObject(thing1.get('position')),
            'instance position is object via get("position")'
        )

        t.ok(
            isNumber(thing1.get('position.x')),
            'instance position.x is number via path lookup'
        )

        let newData = {x: -7}
        let newPosition = position(newData)+

        thing1.set(newPosition)

        equals(t,
            thing1.get('position.x'),
            -7,
            'via component set, instance position.x'
        )

        t.end()
    },
    'Entity instance verify empty': function (t) {

        let instance = Empty()

        t.ok(
            isObject(instance.components.empty),
            'Empty instance has "empty" object as a component'
        )

        let hashKey = getKeyHash(instance.components.empty)
        equals(t,
            hashKey,
            '',
            'Empty instance\'s "empty" object hash key'
        )

        t.end()
    },
    'Entity instance api immutability': function (t) {

        let data = {deep: {a: 4, b: {c: 5, d: [6, 7, 8]}}}
        let de = DeepEntity(data)

        // t.ok(de.get() !== de.get(), 'subsequent gets are different')

        // let _deep = de.get('deep')
        // _deep.b.c = -5

        // equals(t,
        //     t.get(deep).b.c,
        //     data.deep.b.c,
        //     'deep.b.c is still the same'
        // )

        t.end()
    }
}

export { tests }