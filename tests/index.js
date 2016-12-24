
import { tests as utilsTests } from './test-utils'
import { tests as typeTests } from './type'
import { tests as entityTests } from './entity'
import { tests as entityInstanceTests } from './entity-instance'
import { tests as componentTests } from './component'
import { tests as systemTests, runOnFail } from './system'

import { loud } from './loud-tap'

let api = loud({silenceOks: true})
let test = require('tape')

let allTests = [
    utilsTests,
    typeTests,
    entityTests,
    componentTests,
    entityInstanceTests,
    systemTests,
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
