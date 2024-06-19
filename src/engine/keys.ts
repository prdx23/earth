



export const keys: Record<string, boolean> = {
    any: false,
    up: false, down: false, left: false, right: false,
    zoomOut: false, zoomIn: false,
}


const keyMapping: Record<string, string> = {
    KeyW: 'up',
    KeyA: 'left',
    KeyS: 'down',
    KeyD: 'right',
    ArrowUp: 'up',
    ArrowLeft: 'left',
    ArrowDown: 'down',
    ArrowRight: 'right',
    Minus: 'zoomOut',
    Equal: 'zoomIn',
}
const keysWhitelist = Object.keys(keyMapping)


export const mouse = {
    dragging: false,
    prevX: 0,
    prevY: 0,
    offsetX: 0,
    offsetY: 0,
    finalize: false,
    zoom: 0,
}


export function setupInputHandlers() {

    window.addEventListener('keydown', (event) => {
        if (event.isComposing || event.keyCode === 229 || event.repeat) {
            return
        }
        if (keysWhitelist.includes(event.code)) {
            keys[keyMapping[event.code]] = true
            keys.any = true
        }
    })


    window.addEventListener('keyup', (event) => {
        if (keysWhitelist.includes(event.code)) {
            keys[keyMapping[event.code]] = false

            keys.any = false
            keys.any = Object.values(keys).some(x => x)
        }
    })


    function handleMouseDown(px: number, py: number) {
        mouse.dragging = true
        mouse.prevX = px
        mouse.prevY = py
    }

    function handleMouseMove(px: number, py: number) {
        if (mouse.dragging) {
            mouse.offsetX = mouse.prevX - px
            mouse.offsetY = mouse.prevY - py
        }
    }

    function handleMouseUp() {
        mouse.dragging = false
        mouse.finalize = true
        mouse.offsetX = 0
        mouse.offsetY = 0
        mouse.prevX = 0
        mouse.prevY = 0
    }

    window.addEventListener('mousedown', (event) => {
        handleMouseDown(event.pageX, event.pageY)
    })

    window.addEventListener('mousemove', (event) => {
        handleMouseMove(event.pageX, event.pageY)
    })

    window.addEventListener('mouseup', () => {
        handleMouseUp()
    })

    window.addEventListener('touchstart', (event) => {
        event.preventDefault()
        handleMouseDown(event.touches[0].pageX, event.touches[0].pageY)
    })

    window.addEventListener('touchmove', (event) => {
        event.preventDefault()
        handleMouseMove(event.touches[0].pageX, event.touches[0].pageY)
    })

    window.addEventListener('touchend', (event) => {
        event.preventDefault()
        handleMouseUp()
    })

    window.addEventListener('wheel', (event) => {
        mouse.zoom = event.deltaY
    })
}
