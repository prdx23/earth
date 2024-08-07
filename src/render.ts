
import { webgl } from './engine/webgl'
import { Camera, OrbitCamera } from './engine/camera'
import { keys, setupInputHandlers } from './engine/keys'
import { Earth } from './objects/earth'
import { Cube } from './objects/cube'
import { Vec3 } from './math'
import { Atmosphere } from './objects/atmosphere'
import { Stars } from './objects/stars'
import { loading } from './loading'
import { Moon } from './objects/moon'



let gl: WebGL2RenderingContext
let canvas: HTMLCanvasElement


const earth = new Earth()
const atmosphere = new Atmosphere()
const moon = new Moon()
const cube = new Cube()
const stars = new Stars()


export async function init() {


    const glctx = webgl.init(2000, 2000)

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

    await moon.load(gl)
    await atmosphere.load(gl)
    await cube.load(gl)
    await stars.load(gl)

    setupInputHandlers()

    webgl.loading.status = false
    document.getElementById('loading')!.style.display = 'none'
    document.getElementById('content')!.style.display = 'block'
    setTimeout(() => {
        document.getElementById('controls')!.classList.add('fade-out')
    }, 5000)

    gl.enable(gl.CULL_FACE)
    gl.enable(gl.DEPTH_TEST)

    const camera = new Camera(
        20 * Math.PI / 180, 1, Earth.radius * 3, Earth.radius * 28,
    )
    // camera.target.set(0, -Earth.radius * 0.2, 0)
    // camera.position.set(0, 400, 1800)
    // camera.lookAt(Vec3.origin)

    const orbitCam = new OrbitCamera()
    orbitCam.distance = Earth.radius * 10
    orbitCam.angle = { x: -30, y: -24 }
    orbitCam.updateCamera(camera)
    let cameraUntouched = true
    let viewProjectionMatrix = camera.viewProjectionMatrix()


    const lightPosition = new Vec3(1000, 0, Earth.radius + 1000)
    const lightDirection = Vec3.zero().subtract(lightPosition)

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
        // gl.blendFunc(gl.ONE, gl.ONE)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        // if (keys.any) {
        //     cameraUntouched = false
        // }

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
                orbitCam.angle.x - (0.01 * elapsed / 1000)
            ) % 360
            orbitCam.updateCamera(camera)
        }

        camera.updateProjectionMatrix()
        viewProjectionMatrix = camera.viewProjectionMatrix()

        // cube.matrix.identity()
        //     // .multiply(q.setAxisAngle(Vec3.up, ((frames * -0.05) % 360) * Math.PI / 180).matrix())
        //     .translate(1000, 0, Earth.radius + 1000)
        //     .scale(100, 100, 100)
        // lightPosition.setTranslationFromMatrix(cube.matrix)
        // lightDirection.set(0, 0, 0).subtract(lightPosition)



        moon.render(
            gl, elapsed,
            viewProjectionMatrix, lightDirection, camera.position
        )

        earth.render(
            gl, elapsed,
            viewProjectionMatrix, lightDirection, camera.position
        )

        gl.enable(gl.BLEND)

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        stars.render(gl, viewProjectionMatrix)

        gl.blendFunc(gl.ONE, gl.ONE)
        atmosphere.render(
            gl, viewProjectionMatrix, lightDirection, camera.position
        )

        gl.disable(gl.BLEND)

    }
    loop(0)
}

