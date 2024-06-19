
import { webgl } from './engine/webgl'
import { Camera, OrbitCamera } from './engine/camera'
import { keys, setupInputHandlers } from './engine/keys'
import { Earth } from './objects/earth'
import { Cube } from './objects/cube'
import { Quaternion, Vec3 } from './math'
import { Atmosphere } from './objects/atmosphere'
import { Stars } from './objects/stars'
import { loading } from './loading'



let gl: WebGL2RenderingContext
let canvas: HTMLCanvasElement
const width =  2000
const height = 2000


const earth = new Earth()
const atmosphere = new Atmosphere()
const cube = new Cube()
const stars = new Stars()


export async function init() {


    const glctx = webgl.init(width, height)

    if( !glctx ) {
        document.getElementById('loading-bar')!.innerText = 'error: webgl2 not available!'
        return
    }

    gl = glctx
    canvas = gl.canvas as HTMLCanvasElement
    document.getElementById('webgl-canvas')!.appendChild(canvas)

    loading(gl, canvas)
    await render()
}


async function render() {


    await earth.load(gl)

    webgl.loading.progress += 2
    webgl.updateLoading()

    await atmosphere.load(gl)
    await cube.load(gl)
    await stars.load(gl)

    setupInputHandlers()

    webgl.loading.status = false
    document.getElementById('loading')!.style.display = 'none'
    document.getElementById('content')!.style.display = 'block'

    gl.enable(gl.CULL_FACE)
    gl.enable(gl.DEPTH_TEST)

    const camera = new Camera(
        20 * Math.PI / 180,
        width / height,
        Earth.radius * 2, Earth.radius * 14,
    )
    // camera.target.set(0, -Earth.radius * 0.2, 0)
    // camera.position.set(0, 400, 1800)
    // camera.lookAt(Vec3.origin)

    const orbitCam = new OrbitCamera()
    orbitCam.distance = Earth.radius * 10
    orbitCam.angle = { x: -30, y: -30 }
    orbitCam.updateCamera(camera)
    let cameraUntouched = true
    let viewProjectionMatrix = camera.viewProjectionMatrix()


    let earthRotationAngle = 0
    const q = Quaternion.identity()
    const lightPosition = Vec3.zero()
    const lightDirection = Vec3.zero()

    const fps = 60
    const fpsInterval = 1000 / fps
    let now = 0
    let then = window.performance.now()
    const startTime = then
    let elapsed = 0
    let sinceStart = 0
    let currentFps = 0
    let frames = 0
    const fpstag = document.getElementById('fps')!

    function loop(dt: number) {

        requestAnimationFrame(loop)

        now = dt
        elapsed = now - then

        if (elapsed < fpsInterval) { return }
        then = now - (elapsed % fpsInterval)

        sinceStart = now - startTime
        currentFps = Math.round(1000 / (sinceStart / ++frames) * 100) / 100
        fpstag.innerHTML = `${currentFps}fps`


        gl.clearColor(0, 0, 0, 1)
        gl.blendFunc(gl.ONE, gl.ONE)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        if (keys.any) {
            cameraUntouched = false
        }

        if (cameraUntouched) {
            orbitCam.angle.x = (
                orbitCam.angle.x - (0.1 * elapsed / 1000)
            ) % 360
            orbitCam.updateCamera(camera)
        }

        webgl.resizeToScreen(gl)
        camera.aspect = canvas.width / canvas.height

        camera.fov = Math.sin((Earth.radius * 1.4) / orbitCam.distance) * 2
        if (canvas.height > canvas.width) {
            camera.fov *= canvas.height / canvas.width
        }
        camera.fov += orbitCam.fovDelta


        orbitCam.handleInput(camera)


        if (cameraUntouched) {
            orbitCam.angle.x = (
                orbitCam.angle.x - (0.1 * elapsed / 1000)
            ) % 360
            orbitCam.updateCamera(camera)
        }

        camera.updateProjectionMatrix()
        viewProjectionMatrix = camera.viewProjectionMatrix()

        earthRotationAngle += (1.0 * elapsed / 1000) % 360
        earth.matrix.identity()
            .multiply(q.setAxisAngle(
                Vec3.front, -23.5 * Math.PI / 180
            ).matrix())
            .multiply(q.setAxisAngle(
                Vec3.up, earthRotationAngle * Math.PI / 180
            ).matrix())


        cube.matrix.identity()
            // .multiply(q.setAxisAngle(Vec3.up, ((frames * -0.05) % 360) * Math.PI / 180).matrix())
            .translate(1000, 0, Earth.radius + 1000)
            .scale(100, 100, 100)
        lightPosition.setTranslationFromMatrix(cube.matrix)
        lightDirection.set(0, 0, 0).subtract(lightPosition)


        // cube.render(gl, frames, viewProjectionMatrix)

        earth.render(
            gl, viewProjectionMatrix, lightDirection, camera.position
        )

        stars.render(gl, viewProjectionMatrix.inverse())

        gl.enable(gl.BLEND)
        atmosphere.render(
            gl, viewProjectionMatrix, lightDirection, camera.position
        )
        gl.disable(gl.BLEND);

    }
    loop(0)
}

