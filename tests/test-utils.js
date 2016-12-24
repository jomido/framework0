
import { getKeyHash, getValueHash, equals } from './utils'

const tests = {

    'utils.getKeyHash': function (t) {

        let o = {b: 0, a: 0}

        equals(t,
            getKeyHash(o),
            'a/b',
            'o key hash'
        )

        let o2 = {c: 0, a: {d: 7, x: 432}, b: 2}

        equals(t,
            getKeyHash(o2),
            'a/b/c/d/x',
            'o2 key hash'
        )

        let o3 = {c: 0, a: {d: 7, x: {y: 0}}, b: 2}

        equals(t,
            getKeyHash(o3, {maxDepth: 1}),
            'a/b/c',
            'o3 key hash depth 1'
        )

        equals(t,
            getKeyHash(o3, {maxDepth: 2}),
            'a/b/c/d/x',
            'o3 key hash depth 2'
        )

        equals(t,
            getKeyHash(o3, {maxDepth: 3}),
            'a/b/c/d/x/y',
            'o3 key hash depth 3'
        )

        equals(t,
            getKeyHash(o3),
            'a/b/c/d/x/y',
            'o3 key hash infinite depth'
        )

        t.end()
    },
    'utils.getValueHash': function (t) {

        let o = {b: 0, a: 0}

        equals(t,
            getValueHash(o),
            '0,0',
            'o value hash'
        )

        let o2 = {b: 0, a: '0'}

        equals(t,
            getValueHash(o2),
            '"0",0',
            'o2 value hash'
        )

        let o3 = {b: 0, a: {c: [1, 3, {x: 7}, 5]}, d: 8}

        equals(t,
            getValueHash(o3),
            '1,3,7,5,0,8',
            'o3 value hash'
        )

        t.end()
    }
}

export { tests }