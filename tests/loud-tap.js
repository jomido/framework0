
const isOk = (line) => line.indexOf('ok') === 0
const notOk = (line) => line.indexOf('not ok') === 0
const refresh = () => window.location.href = window.location.href
const setProp = (o, prop, val) => {
    if (o[prop] !== val) o[prop] = val
}
const colors = {
    PENDING: '#FCD62A',
    FAILING: '#F28E82',
    PASSING: '#8ECA6C'
}

const loud = function({silenceOks=false}) {

    const state = {ok: true, started: false}
    const olog = console.log.bind(console)
    const pre = document.body.appendChild(document.createElement('pre'))

    console.log = function(line) {

        state.started = true
        if (state.ok === false) return

        let result = parse(line)
        state.ok = result === false ? false : true
        style()

        if (silenceOks && result === true) return

        olog.apply(arguments)
        pre.appendChild(document.createTextNode(line + '\n'))
    }

    const parse = (line) => {

        if (typeof line !== 'string') line = line + '';
        if (isOk(line)) return true
        if (notOk(line)) return false
    }

    const style = () => {

        let s = document.body.style
        let prop = 'backgroundColor'

        if (state.started === false) setProp(s, prop, colors.PENDING)
        else if (!state.ok) setProp(s, prop, colors.FAILING)
        else setProp(s, prop, colors.PASSING)
    }

    let api = {
        undo() { console.log = olog },
        redo({seconds, stopOnFail=false, runOnFail=null}) {

            setTimeout(() => {
                if (state.ok) return refresh()
                if (!stopOnFail) return refresh()
                api.undo()
                if (runOnFail) runOnFail()
            }, seconds)

        },
        scrollToEnd () { window.scrollTo(0, document.body.scrollHeight) }
    }

    style()

    return api
}

export { loud }
