
import { Universe } from '../src/universe.js'
import { position, size, empty, arr, deep, element } from './components.js'
import { type } from '../src/type'

import { equals, notEquals } from './utils'

let earth = null

const tests = {

    'Universe instantiation': function (t) {

        const universe = Universe()

        t.ok(universe, 'universe is truthy')

        equals(t,
            Universe.get(),
            universe,
            'default universes are the same'
        )

        equals(t,
            Universe.get().Entity,
            universe.Entity,
            'default universe api\'s are the same'
        )

        earth = Universe('earth')

        notEquals(t,
            earth,
            universe,
            'default universe and namespaced universe are not the same'
        )

        notEquals(t,
            earth.Entity,
            universe.Entity,
            'default universe and namespaced universe are not the same'
        )

        t.throws(
            () => Universe('earth'),
            /Duplicate universe name/,
            'Cannot create two universes with same name'
        )

        t.end()
    },
    'Universe earth Component': function (t) {

        let size = earth.Component('size', {w: 10, h: 10})
        let position = earth.Component('position', {x: 0, y: 0})

        equals(t,
            earth.Component.get('position'),
            position,
            'Component.get("position") is position'
        )

        equals(t,
            earth.Component.get('size'),
            size,
            'Component.get("size") is size'
        )

        let aaa = earth.Component('aaa')

        let components = []
        for (let component of earth.Component) {
            components.push(component)
        }

        equals(t,
            components.length,
            3,
            'Component is iterable'
        )

        equals(t,
            components[0],
            aaa,
            'Component is a sorted iterable'
        )

        t.end()
    },
    'Universe earth Entity': function (t) {

        let Foo = earth.Entity('Foo', earth.Component.get('position'))
        let Bar = earth.Entity('Bar', earth.Component.get('size'))

        equals(t,
            earth.Entity.get('Foo'),
            Foo,
            'Entity.get("Foo") is foo'
        )

        equals(t,
            earth.Entity.get('Bar'),
            Bar,
            'Component.get("Bar") is Bar'
        )

        let Cat = earth.Entity('Cat')

        let entities = []
        for (let entity of earth.Entity) {
            entities.push(entity)
        }

        equals(t,
            entities.length,
            3,
            'Entity is iterable'
        )

        equals(t,
            entities[0],
            Bar,
            'Entity is a sorted iterable'
        )

        t.end()
    }

}

export { tests }