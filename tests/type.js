import { Type, type } from '../src/type.js'

const typeName = 'BlartNab'
const tests = {

    'Type instantiation': function (t) {

        const BlartNab = Type(typeName)

        t.ok(BlartNab, `${typeName} is truthy`)
        t.throws(
            () => Type(typeName),
            /Duplicate Type name/,
            'should not be able to create the same named type more than once'
        )

        t.end()
    },
    'Type lookup': function (t) {

        const BlartNab = Type.get('BlartNab')

        t.ok(BlartNab), `${typeName} is truthy`

        t.end()
    },
    'Type\'s type is type': function (t) {

        const BlartNab = Type.get('BlartNab')

        t.ok(
            BlartNab[type.symbol] === 'type',
            'Type has "type" for ty[e symbol'
        )

        t.end()
    },
    'Type assignment': function (t) {

        let o = {}

        const BlartNab = Type.get('BlartNab')

        BlartNab.set(o)

        t.ok(
            o[BlartNab.symbol] === true,
            'typed object has true for BlartNab symbol'
        )

        t.ok(
            o[type.symbol] === 'BlartNab',
            'typed object has "BlartNab" for type symbol'
        )

        t.end()
    },
    'Type assignment with token': function (t) {

        let o = {}

        const BlartNab = Type.get('BlartNab')

        BlartNab.set(o, 'gwibble')

        t.ok(
            o[BlartNab.symbol] === 'gwibble',
            'typed object has "gwibble" for BlartNab symbol'
        )

        t.ok(
            o[type.symbol] === 'BlartNab',
            'typed object has "BlartNab" for type symbol'
        )

        t.end()
    },
    'Type checking via type class': function (t) {

        let o = {}
        let o2 = {}

        const BlartNab = Type.get('BlartNab')

        BlartNab.set(o)
        BlartNab.set(o2, 'gwibble')

        t.ok(
            BlartNab.check(o) === true,
            'o is a BlartNab via true'
        )

        t.ok(
            BlartNab.check(o2) === 'gwibble',
            'o2 is a BlartNab via "gwibble"'
        )

        t.end()
    },
    'Type checking via type': function (t) {

        let o = {}
        let o2 = {}

        const BlartNab = Type.get('BlartNab')

        BlartNab.set(o)
        BlartNab.set(o2, 'gwibble')

        t.ok(
            type.check(o) === 'BlartNab',
            'o is a "BlartNab"'
        )

        t.ok(
            type.check(o2) === 'BlartNab',
            'o2 is a "BlartNab"'
        )

        t.ok(
            type.check(BlartNab) === 'type',
            'BlartNab is a "type"'
        )

        t.end()
    }
}

const runOnFail = () => {
    window.Type = Type
    window.type = type
}

export { tests, runOnFail }