
import { Camera } from './engine/camera'
import { webgl } from './engine/webgl'
import { Quaternion, Vec3 } from './math'
import { LoadingSphere } from './objects/loadingSphere'
import { Earth } from './objects/earth'


export async function loading(
    gl: WebGL2RenderingContext, canvas: HTMLCanvasElement,
) {

    const sphere = new LoadingSphere()
    const sphere2 = new LoadingSphere()
    await sphere.load(gl)
    await sphere2.load(gl)

    const camera = new Camera(
        20 * Math.PI / 180,
        1,
        Earth.radius * 8, Earth.radius * 12,
    )
    camera.position.set(0, 3185, 5516)
    camera.lookAt(Vec3.zero())

    let earthRotationAngle = 0
    const q = Quaternion.identity()

    let viewProjectionMatrix = camera.viewProjectionMatrix()

    const fps = 60
    const fpsInterval = 1000 / fps
    let now = 0
    let then = window.performance.now()
    let elapsed = 0

    function loop(dt: number) {

        if (webgl.loading.status) { requestAnimationFrame(loop) }

        now = dt
        elapsed = now - then

        if (elapsed < fpsInterval) { return }
        then = now - (elapsed % fpsInterval)


        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT);

        webgl.resizeToScreen(gl)
        camera.aspect = canvas.width / canvas.height

        camera.fov = Math.sin((Earth.radius * 1.4) / (Earth.radius * 10)) * 2
        if (canvas.height > canvas.width) {
            camera.fov *= canvas.height / canvas.width
        }

        camera.updateProjectionMatrix()
        viewProjectionMatrix = camera.viewProjectionMatrix()

        earthRotationAngle += (25.0 * elapsed / 1000) % 360
        sphere.matrix.identity()
            .multiply(q.setAxisAngle(
                Vec3.front, -23.5 * Math.PI / 180
            ).matrix())
            .multiply(q.setAxisAngle(
                Vec3.up, earthRotationAngle * Math.PI / 180
            ).matrix())
            .scale(Earth.radius, Earth.radius, Earth.radius)

        sphere2.matrix.identity()
            .copy(sphere.matrix)
            .scale(0.3, 0.3, 0.3)

        sphere.render(gl, viewProjectionMatrix)
        sphere2.render(gl, viewProjectionMatrix)

    }
    loop(0)
}


