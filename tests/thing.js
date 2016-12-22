
import { equals, getKeyHash, getValues } from './utils'

import { position, size } from './components'
import { Entity } from '../src/entity'

const pos = position({x: 8, y: 8})
const Thing = Entity(
    'Thing',
    pos,
    size
)

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
                    position: {x: 8, y: 8},
                    size: defaults.size,
                    components: 'position/size'
                }
            },
            viaComponent: {
                thing: Thing(position),
                expected: {
                    position: defaults.position,
                    size: defaults.size,
                    components: 'position/size'
                }
            },
            viaComponents: {
                thing: Thing(position, size),
                expected: {
                    position: defaults.position,
                    size: defaults.size,
                    components: 'position/size'
                }
            },
            viaComponentInstance: {
                thing: Thing(position({x:2, y:2})),
                expected: {
                    position: {x: 2, y: 2},
                    size: defaults.size,
                    components: 'position/size'
                }
            },
            viaComponentInstances: {
                thing: Thing(position({x:2, y:2}), size({w: 3, h: 3})),
                expected: {
                    position: {x: 2, y: 2},
                    size: {w: 3, h: 3},
                    components: 'position/size'
                }
            },
            viaLiteral: {
                thing: Thing({position: {x:2, y:2}}),
                expected: {
                    position: {x: 2, y: 2},
                    size: defaults.size,
                    components: 'position/size'
                }
            },
            viaLiterals: {
                thing: Thing({position: {x:2, y:2}}, {size: {w:3, h:3}}),
                expected: {
                    position: {x: 2, y: 2},
                    size: {w: 3, h: 3},
                    components: 'position/size'
                }
            },
            viaBigLiteral: {
                thing: Thing({position: {x:2, y:2}, size: {w:3, h:3}}),
                expected: {
                    position: {x: 2, y: 2},
                    size: {w: 3, h: 3},
                    components: 'position/size'
                }
            }
        }

        let testAttrs = (desc, thing, expected) => {

            let c = thing.components

            t.ok(thing, `${desc} thing is truthy`)
            t.ok(c, `${desc} components is truthy `)
            t.ok(
                getKeyHash(c) === expected.components,
                `${desc} component list is {${expected.components}}`
            )
            t.ok(c.position, `${desc} position is truthy `)
            t.ok(c.size, `${desc} size is truth`)
            t.ok(
                c.position.x === expected.position.x,
                `${desc} position.x is ${expected.position.x}`
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

        thing1.get(position)
        thing1.get('position')
        thing1.get('position.x')
        t.end()
    }
}

export { tests }