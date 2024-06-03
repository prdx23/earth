



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
}
