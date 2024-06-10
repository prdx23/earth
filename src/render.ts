
import { Shader, initWebgl } from './engine/webgl'
import { Camera, OrbitCamera } from './engine/camera'
import { keys, setupInputHandlers } from './engine/keys'
import { Matrix4 } from './math/matrix'

// import { data3dCube, data3dCubeColor } from './mesh/cube'
// import { generateIcosahedron } from './mesh/icosahedron'
import { generateSphere } from './mesh/sphere'



let gl: WebGL2RenderingContext
const width =  4000
const height = 4000


const sphere = generateSphere(5)


export async function init() {


    const glctx = initWebgl(width, height)

    if( !glctx ) {
        alert('webgl2 not available!')
        return
    }

    gl = glctx
    document.body.appendChild(gl.canvas as HTMLCanvasElement)

    const shader = new Shader('texture', 'texture')
    await shader.load(gl, [
        // 'u_view_matrix', 'u_projection_matrix', 'u_matrix',
        'u_view_projection_matrix', 'u_matrix',
    ])



    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)


    const bufferPos = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferPos)
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data3dCube), gl.STATIC_DRAW)
    gl.bufferData(gl.ARRAY_BUFFER, sphere.points, gl.STATIC_DRAW)


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
    gl.bufferData(gl.ARRAY_BUFFER, sphere.colors, gl.STATIC_DRAW)


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


    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)


    const image = new Image()
    // image.src = 'src/textures/cloud_combined_2048.jpg'
    // image.src = 'src/textures/land_ocean_ice_cloud_2048.jpg'
    image.src = 'src/textures/world.200410.3x5400x2700.jpg'
    // image.src = 'src/textures/world.200410.3x21600x10800.jpg'

    image.addEventListener('load', function() {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image)
        gl.generateMipmap(gl.TEXTURE_2D)


    const textureC = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, textureC)

    const imageC = new Image()
    imageC.src = 'src/textures/cloud_combined_2048.jpg'

    imageC.addEventListener('load', function() {
        gl.bindTexture(gl.TEXTURE_2D, textureC)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, imageC)
        gl.generateMipmap(gl.TEXTURE_2D)
    render(vao!, shader)
    })

      gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, textureC);

    })


    setupInputHandlers()

    // render(vao!, shader)

}


export function render(vao: WebGLVertexArrayObject, shader: Shader) {


    gl.enable(gl.CULL_FACE)
    gl.enable(gl.DEPTH_TEST)


    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(shader.program)
    gl.bindVertexArray(vao)

      var u_image0Location = gl.getUniformLocation(shader.program, "u_texture");
      var u_image1Location = gl.getUniformLocation(shader.program, "u_cloud");


  // set which texture units to render with.
  gl.uniform1i(u_image0Location, 0);  // texture unit 0
  gl.uniform1i(u_image1Location, 1);  // texture unit 1


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

        const timeUniformLocation = gl.getUniformLocation(shader.program, 'u_time')

    const objectMatrix = Matrix4.identity()
        // .multiply(Quaternion.axisAngle(new Vec3(0, 1, 0), t * 0.03 * 1 * Math.PI / 180).matrix())
        .scale(100, 100, 100)


    function loop(dt: number) {
        t = dt - start

        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)


        // gl.useProgram(shader.program)
        // gl.bindVertexArray(vao)

        gl.uniform1f(timeUniformLocation, t)



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
            sphere.triangles.length * 3,
        )

        requestAnimationFrame(loop)
    }
    loop(0)
}

