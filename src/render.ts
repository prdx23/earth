
import { Shader, initWebgl } from './engine/webgl'
import { data3dCube, data3dCubeColor } from './data/cube'
import { Camera } from './engine/camera'
import { keys, setupInputHandlers } from './engine/keys'
import { Matrix4 } from './math/matrix'
import { Vec3 } from './math/vector'
import { Quaternion } from './math/quaternion'


let gl: WebGL2RenderingContext
const width = 800
const height = 800



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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data3dCube), gl.STATIC_DRAW)


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
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(data3dCubeColor), gl.STATIC_DRAW)


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
        1, 2000,
    )
    camera.position.set(0, 300, 1800)
    const cameraTarget = Vec3.zero()


    const start = document.timeline.currentTime as number
    let t

    const q = Quaternion.identity()

    function loop(dt: number) {
        t = dt - start

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


        camera.lookAt(cameraTarget)

        gl.uniformMatrix4fv(
            shader.locations['u_view_projection_matrix'],
            false,
            camera.viewProjectionMatrix().matrix
        )



        const objectMatrix = Matrix4.identity()
            .scale(50, 50, 50)
            // .rotateY(t * 0.1 * 1 * Math.PI / 180)
            // .rotateX(t * 0.1 * 1 * Math.PI / 180)




        if (keys.left) {
            q.multiply(Quaternion.axisAngle(new Vec3(0, 1, 0), 0.01))
            q.multiply(Quaternion.axisAngle(new Vec3(1, 0, 0), 0.01))
            q.multiply(Quaternion.axisAngle(new Vec3(1, 0, 1), 0.01))
        }

        if (keys.right) {
            q.multiply(Quaternion.axisAngle(new Vec3(0, 1, 0), -0.01))
            q.multiply(Quaternion.axisAngle(new Vec3(1, 0, 0), -0.01))
            q.multiply(Quaternion.axisAngle(new Vec3(1, 0, 1), -0.01))
        }

        objectMatrix.multiply(q.matrix())








        gl.uniformMatrix4fv(
            shader.locations['u_matrix'],
            false,
            new Float32Array(objectMatrix.matrix)
        )



        gl.drawArrays(
            gl.TRIANGLES,  // primitive type
            0,             // offset
            6 * 6             // count
        )

        requestAnimationFrame(loop)
    }
    loop(0)
}

