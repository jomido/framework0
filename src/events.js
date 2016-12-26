
const eventMap = {}

const trigger = (eventName, data) => {

    let eventMap = eventMap[eventName]

    if (!eventMap) return false

    for (let [owner, fnSet] of eventMap.entries()) {

        for (let fn of fnSet) {

            setTimeout(() => { fn.call(owner, data) }, 0)
        }
    }

    return true
}

const register = (owner, fn, eventName) => {

    let eventMap = eventMap[eventName]

    if (!eventMap) {
        eventMap = new Map()
        this.eventMap[eventName] = eventMap
    }

    if (!(eventMap.has(owner))) {
        eventMap.set(owner, new Set())
    }

    eventMap.get(owner).add(fn)
}

let unregister = (owner, fn, eventName) => {

    if (!(eventName in this.eventMap)) return false

    let eventMap = this.eventMap[eventName]

    if (!(eventMap.has(owner))) return false

    let fnSet = eventMap.get(owner)

    if (!(fnSet.has(fn))) return false

    fnSet.delete(fn)

    return true
}

const Events = (namespace=null) => {

    namespace = namespace || ''

    const events = {

        trigger(eventName, data={}) {

            return trigger(
                namespace ? `${namespace}:${eventName}` : eventName,
                data
            )
        },
        on(eventName, fn) {

            return bus.register(
                events,
                fn,
                namespace ? `${namespace}:${eventName}` : eventName
            )
        },
        off(eventName, fn) {

            return bus.unregister(
                events,
                fn,
                namespace ? `${namespace}:${eventName}` : eventName
            )
        }
        // once() {}
    }
}

export { Events }
