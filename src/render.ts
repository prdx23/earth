
import { Shader, initWebgl } from './engine/webgl'
import { data3dCube, data3dCubeColor } from './data/cube'
import { Camera, OrbitCamera } from './engine/camera'
import { keys, setupInputHandlers } from './engine/keys'
import { Matrix4 } from './math/matrix'
import { Vec3 } from './math/vector'
import { Quaternion } from './math/quaternion'

// import { icosahedron } from './shapes/icosahedron'
import { generateIcosahedron } from './mesh'


let gl: WebGL2RenderingContext
const width = 800
const height = 800


const icosahedron = generateIcosahedron(3)


export async function init() {


    const glctx = initWebgl(width, height)

    if( !glctx ) {
        alert('webgl2 not available!')
        return
    }

    gl = glctx
    document.body.appendChild(gl.canvas as HTMLCanvasElement)

    const shader = new Shader('main')
    await shader.load(gl, [
        // 'u_view_matrix', 'u_projection_matrix', 'u_matrix',
        'u_view_projection_matrix', 'u_matrix',
    ])



    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)


    const bufferPos = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferPos)
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data3dCube), gl.STATIC_DRAW)
    gl.bufferData(gl.ARRAY_BUFFER, icosahedron.points, gl.STATIC_DRAW)


    const positionAttributeLocation = gl.getAttribLocation(shader.program, 'a_position')
    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.vertexAttribPointer(
        positionAttributeLocation,
        3,           // size,
        gl.FLOAT,    // type,
        false,       // normalize,
        0,           // stride,
        0,           // offset
    )

    gl.bindBuffer(gl.ARRAY_BUFFER, null)



    const bufferCol = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCol)
    // gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(data3dCubeColor), gl.STATIC_DRAW)
    gl.bufferData(gl.ARRAY_BUFFER, icosahedron.colors, gl.STATIC_DRAW)


    const colorAttributeLocation = gl.getAttribLocation(shader.program, 'a_color')
    gl.enableVertexAttribArray(colorAttributeLocation)
    gl.vertexAttribPointer(
        colorAttributeLocation,
        3,           // size,
        gl.UNSIGNED_BYTE,    // type,
        true,       // normalize,
        0,           // stride,
        0,           // offset
    )

    gl.bindBuffer(gl.ARRAY_BUFFER, null)


    setupInputHandlers()

    render(vao!, shader)

}


export function render(vao: WebGLVertexArrayObject, shader: Shader) {


    gl.enable(gl.CULL_FACE)
    gl.enable(gl.DEPTH_TEST)


    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(shader.program)
    gl.bindVertexArray(vao)



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


    const start = document.timeline.currentTime as number
    let t


    const objectMatrix = Matrix4.identity()
        // .multiply(Quaternion.axisAngle(new Vec3(0, 1, 0), t * 0.03 * 1 * Math.PI / 180).matrix())
        .scale(100, 100, 100)


    function loop(dt: number) {
        // t = dt - start

        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)


        // gl.useProgram(shader.program)
        // gl.bindVertexArray(vao)


        // if (keys.zoomIn) {
        //     if (Math.abs(camera.position.z - cameraTarget.z) > 200) {
        //         camera.position.setZ(camera.position.z - 20)
        //     }
        // }
        // if (keys.zoomOut) {
        //     if (Math.abs(camera.position.z - cameraTarget.z) < 1900) {
        //         camera.position.setZ(camera.position.z + 20)
        //     }
        // }


        if (keys.any) {

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


        gl.uniformMatrix4fv(
            shader.locations['u_view_projection_matrix'],
            false,
            camera.viewProjectionMatrix().matrix
        )



        gl.uniformMatrix4fv(
            shader.locations['u_matrix'],
            false,
            objectMatrix.matrix
        )



        gl.drawArrays(
            gl.TRIANGLES,  // primitive type
            // gl.LINE_LOOP,  // primitive type
            0,             // offset
            // 6 * 6             // count
            icosahedron.triangles.length * 3,
        )

        requestAnimationFrame(loop)
    }
    loop(0)
}

