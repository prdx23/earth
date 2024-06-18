
import { webgl } from '../engine/webgl'
import { Matrix4 } from '../math'

import vertex from '../shaders/main.vert'
import fragment from '../shaders/main.frag'

export class Cube {

    vao: WebGLVertexArrayObject | null
    vertexCount: number
    matrix: Matrix4
    shader: WebGLProgram | null
    uniforms: Record<string, WebGLUniformLocation>

    constructor() {
        this.vao = null
        this.matrix = Matrix4.identity()
        this.vertexCount = 6 * 6
        this.shader = null
        this.uniforms = {}
    }


    async load(gl: WebGL2RenderingContext) {

        this.shader = webgl.loadShader(gl, vertex, fragment)

        this.vao = gl.createVertexArray()
        gl.bindVertexArray(this.vao)


        webgl.loadAttribute(
            gl, 'a_position', this.shader,
            new Float32Array(data3dCube), 3, gl.FLOAT, false
        )

        webgl.loadAttribute(
            gl, 'a_color', this.shader,
            new Uint8Array(data3dCubeColor), 3, gl.UNSIGNED_BYTE, true
        )


        const uniforms = [
            'u_time', 'u_view_projection_matrix', 'u_matrix',
        ]
        for (const uniform of uniforms) {
            this.uniforms[uniform] = gl.getUniformLocation(this.shader, uniform)!
        }


    }


    render(gl: WebGL2RenderingContext, t: number, viewProjectionMatrix: Matrix4) {

        gl.useProgram(this.shader)
        gl.bindVertexArray(this.vao)

        gl.uniform1f(this.uniforms.u_time, t)

        gl.uniformMatrix4fv(
            this.uniforms['u_view_projection_matrix'],
            false,
            viewProjectionMatrix.matrix
        )

        gl.uniformMatrix4fv(
            this.uniforms['u_matrix'],
            false,
            this.matrix.matrix
        )

        gl.drawArrays(
            gl.TRIANGLES,
            // gl.LINE_LOOP,
            0, // offset
            this.vertexCount
        )

    }






}



const data3dCube = [
    // front
    -1, -1, +1,
    +1, -1, +1,
    +1, +1, +1,

    -1, -1, +1,
    +1, +1, +1,
    -1, +1, +1,

    // right
    +1, -1, +1,
    +1, -1, -1,
    +1, +1, -1,

    +1, -1, +1,
    +1, +1, -1,
    +1, +1, +1,

    // back
    +1, -1, -1,
    -1, -1, -1,
    +1, +1, -1,

    +1, +1, -1,
    -1, -1, -1,
    -1, +1, -1,

    // left
    -1, -1, -1,
    -1, -1, +1,
    -1, +1, +1,

    -1, -1, -1,
    -1, +1, +1,
    -1, +1, -1,

    // top
    -1, +1, +1,
    +1, +1, +1,
    +1, +1, -1,

    -1, +1, +1,
    +1, +1, -1,
    -1, +1, -1,

    // bottom
    -1, -1, +1,
    +1, -1, -1,
    +1, -1, +1,

    -1, -1, +1,
    -1, -1, -1,
    +1, -1, -1,
]

const data3dCubeColor = [
    // front
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    80,  70, 120,
    80,  70, 120,
    80,  70, 120,

    // right
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,

    // back
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    80,  70, 120,
    80,  70, 120,
    80,  70, 120,

    // left
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,

    // top
    76, 170, 100,
    76, 170, 100,
    76, 170, 100,
    140, 170, 80,
    140, 170, 80,
    140, 170, 80,

    // bottom
    76, 170, 100,
    76, 170, 100,
    76, 170, 100,
    140, 170, 80,
    140, 170, 80,
    140, 170, 80,
]
