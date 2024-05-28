
import { createProgram, initWebgl, loadBuffer } from './webgl'



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

    // @ts-expect-error importing shader file
    const vsSource = (await import('./shaders/main.vert?raw')).default
    // @ts-expect-error importing shader file
    const fsSource = (await import('./shaders/main.frag?raw')).default

    const program = createProgram(gl, vsSource, fsSource)

    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)

    const positions = [
        200, 200,
        200, 400,
        400, 400,
    ]
    loadBuffer(gl, new Float32Array(positions), gl.STATIC_DRAW)

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.vertexAttribPointer(
        positionAttributeLocation,
        2,           // size,
        gl.FLOAT,    // type,
        false,       // normalize,
        0,           // stride,
        0,           // offset
    )

    const colors = [
        255, 0, 0,
        0, 255, 0,
        0, 0, 255,
    ]
    loadBuffer(gl, new Uint8Array(colors), gl.STATIC_DRAW)

    const colorAttributeLocation = gl.getAttribLocation(program, 'a_color')
    gl.enableVertexAttribArray(colorAttributeLocation)
    gl.vertexAttribPointer(
        colorAttributeLocation,
        3,           // size,
        gl.UNSIGNED_BYTE,    // type,
        true,       // normalize,
        0,           // stride,
        0,           // offset
    )


    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')

    // render

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)
    gl.bindVertexArray(vao)

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

    gl.drawArrays(
        gl.TRIANGLES,  // primitive type
        0,             // offset
        3,             // count
    )

}


export function render() {
}

