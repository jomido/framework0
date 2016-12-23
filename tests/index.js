
import { tests as typeTests, runOnFail } from './type'
import { tests as thingTests } from './thing'
import { tests as entityTests } from './entity'
import { tests as componentTests } from './component'

import { loud } from './loud-tap'

let api = loud({silenceOks: true})
let test = require('tape')

let allTests = [
    typeTests,
    entityTests,
    componentTests,
    thingTests
]

for (let testGroup of allTests) {

    for (let description in testGroup) {

        let fn = testGroup[description]
        test(description, fn)
    }
}

test.onFinish(() => {
    api.scrollToEnd()
    api.redo({seconds: 1000, stopOnFail: true, runOnFail: runOnFail})
})
