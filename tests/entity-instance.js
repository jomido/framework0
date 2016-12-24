
import { equals, getKeyHash, getAllValues, getValueHash } from './utils'
import { position, size, empty, deep, arr } from './components'

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
const Ar = Entity('Ar', arr)

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
            equals(t,
                getKeyHash(c, {maxDepth: 1}),
                expected.components,
                `${desc} component hash`
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
        let definitionValues = getAllValues(definition)

        let thing1Definition = thing1.get()

        equals(t,
            getKeyHash(thing1Definition),
            definitionKeys,
            'thing1 definition keys === initial definition keys'
        )

        let thing1Values = getAllValues(thing1Definition)
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
        let newPosition = position(newData)

        thing1.set(newPosition)

        equals(t,
            thing1.get('position.x'),
            newData.x,
            'via component set, instance position.x'
        )

        newData = {x: -77}
        newPosition = position(newData)()

        thing1.set(newPosition)

        equals(t,
            thing1.get('position.x'),
            newData.x,
            'via component instance set, instance position.x'
        )

        newData = {x: 55}

        thing1.set('position.x', newData.x)

        equals(t,
            thing1.get('position.x'),
            newData.x,
            'via path set, instance position.x'
        )

        newData = {x: 33}

        thing1.set({position: {x: newData.x}})

        equals(t,
            thing1.get('position.x'),
            newData.x,
            'via literal set, instance position.x'
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

        const ar = Ar()

        equals(t,
            ar.get(arr)[0],
            1,
            'arr[0] is 1'
        )
        t.end()
    },
    'Entity instance api immutability': function (t) {

        // TODO: deep components do not work at all, apparently... :)
        let data = {deep: {a: 4, b: {c: 5, d: [6, 7, 8]}}}
        let de = DeepEntity(data)

        t.ok(de.get() !== de.get(), 'subsequent gets are different')

        let _deep = de.get('deep')
        let newBC = -5
        _deep.b.c = newBC

        equals(t,
            de.get(deep).b.c,
            data.deep.b.c,
            'deep.b.c is still the same'
        )

        let newBC2 = 1000
        de.set('deep.b.c', newBC2)

        equals(t,
            _deep.b.c,
            newBC,
            '_deep.b.c is still the same'
        )

        equals(t,
            de.get(deep).b.c,
            newBC2,
            '_deep.b.c is still the same'
        )

        let newBD = [1, 2, 3]
        de.set('deep.b.d', newBD)

        equals(t,
            getValueHash(_deep.b.d),
            getValueHash(data.deep.b.d),
            '_deep.b.d is still the same'
        )

        t.end()
    }
}

export { tests }