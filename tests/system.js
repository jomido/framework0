
import { System } from '../src/system.js'
import { position, size, empty, arr, deep, element } from './components.js'

const tests = {

    'System Class instantiation': function (t) {

        const positionSystem = System('position', position)
        const visualSystem = System('visual', position, size, element)

        t.end()
    }

}

export { tests }