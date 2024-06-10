
import { webgl } from './engine/webgl'
import { Camera, OrbitCamera } from './engine/camera'
import { keys, setupInputHandlers } from './engine/keys'
import { Earth } from './objects/earth'



let gl: WebGL2RenderingContext
const width =  4000
const height = 4000


const earth = new Earth()


export async function init() {


    const glctx = webgl.init(width, height)

    if( !glctx ) {
        alert('webgl2 not available!')
        return
    }

    gl = glctx
    document.body.appendChild(gl.canvas as HTMLCanvasElement)

    await earth.load(gl)


    setupInputHandlers()
    render()

}


export function render() {


    gl.enable(gl.CULL_FACE)
    gl.enable(gl.DEPTH_TEST)


    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)


    const camera = new Camera(
        30 * Math.PI / 180,
        // gl.canvas.clientWidth / gl.canvas.clientHeight,
        width / height,
        1, 3000,
    )
    // camera.position.set(0, 400, 1800)
    // camera.lookAt(Vec3.origin)

    const orbitCam = new OrbitCamera()
    orbitCam.distance = 800
    orbitCam.angle = { x: -30, y: -30 }
    orbitCam.updateCamera(camera)

    let viewProjectionMatrix = camera.viewProjectionMatrix()

    const start = document.timeline.currentTime as number
    let t


    earth.renderInit(gl)



    function loop(dt: number) {
        t = dt - start

        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)


        if (keys.any) {

            if (keys.zoomIn && orbitCam.distance > 150) {
                orbitCam.distance -= 4
            }

            if (keys.zoomOut && orbitCam.distance < 1000) {
                orbitCam.distance += 4
            }

            if (keys.left) {
                orbitCam.angle.x -= 1
            }

            if (keys.right) {
                orbitCam.angle.x += 1
            }

            if (keys.up && orbitCam.angle.y > -89) {
                orbitCam.angle.y -= 1
            }

            if (keys.down && orbitCam.angle.y < 89) {
                orbitCam.angle.y += 1
            }

            orbitCam.updateCamera(camera)
        }

        // camera.matrix
        //     .identity()
        //     .translate(camera.position.x, camera.position.y, camera.position.z)
        //     .lookAt(camera.position, cameraTarget, Vec3.up)

        viewProjectionMatrix = camera.viewProjectionMatrix()

        earth.render(gl, t, viewProjectionMatrix)


        requestAnimationFrame(loop)
    }
    loop(0)
}

