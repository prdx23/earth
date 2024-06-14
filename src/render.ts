
import { webgl } from './engine/webgl'
import { Camera, OrbitCamera } from './engine/camera'
import { keys, setupInputHandlers } from './engine/keys'
import { Earth } from './objects/earth'
import { Cube } from './objects/cube'
import { Quaternion, Vec3 } from './math'
import { Atmosphere } from './objects/atmosphere'



let gl: WebGL2RenderingContext
const width =  2000
const height = 2000


const earth = new Earth()
const atmosphere = new Atmosphere()
const cube = new Cube()


export async function init() {


    const glctx = webgl.init(width, height)

    if( !glctx ) {
        alert('webgl2 not available!')
        return
    }

    gl = glctx
    document.body.appendChild(gl.canvas as HTMLCanvasElement)

    await earth.load(gl)
    await atmosphere.load(gl)
    await cube.load(gl)


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
        20 * Math.PI / 180,
        // gl.canvas.clientWidth / gl.canvas.clientHeight,
        width / height,
        1000, Earth.radius * 10,
    )
    // camera.position.set(0, 400, 1800)
    // camera.lookAt(Vec3.origin)

    const orbitCam = new OrbitCamera()
    orbitCam.distance = Earth.radius * 8
    orbitCam.angle = { x: -30, y: -30 }
    orbitCam.updateCamera(camera)

    let viewProjectionMatrix = camera.viewProjectionMatrix()

    const start = document.timeline.currentTime as number
    let t


    earth.renderInit(gl)
    atmosphere.renderInit(gl)


    const q = Quaternion.identity()

    const lightPosition = Vec3.zero()
    const lightDirection = Vec3.zero()
    const viewDirection = Vec3.zero()


    function loop(dt: number) {
        t = dt - start

        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)


        gl.blendFunc(gl.ONE, gl.ONE)
        // gl.blendFunc( gl.SRC_ALPHA, gl.DST_ALPHA )
        // gl.blendFunc( gl.SRC_ALPHA, gl.ONE )
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


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

        earth.matrix.identity()
            .multiply(q.setAxisAngle(Vec3.front, -23.5 * Math.PI / 180).matrix())
            .multiply(q.setAxisAngle(Vec3.up, t * -0.005 * Math.PI / 180).matrix())
            .scale(Earth.radius, Earth.radius, Earth.radius)


        atmosphere.matrix.copy(earth.matrix)


        cube.matrix.identity()
            .multiply(q.setAxisAngle(Vec3.up, t * -0.05 * Math.PI / 180).matrix())
            .translate(0, 0, Earth.radius + 1000)
            .scale(100, 100, 100)
        lightPosition.setTranslationFromMatrix(cube.matrix)
        lightDirection.set(0, 0, 0).subtract(lightPosition)

        // viewDirection.copy(camera.target).subtract(camera.position)

        gl.enable(gl.BLEND)

        earth.render(
            gl, t, viewProjectionMatrix, lightDirection, camera.position
        )

        atmosphere.render(
            gl, t, viewProjectionMatrix, lightDirection, camera.position
        )
        gl.disable(gl.BLEND);

        cube.render(gl, t, viewProjectionMatrix)

        requestAnimationFrame(loop)
    }
    loop(0)
}

