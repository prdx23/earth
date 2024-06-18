

import { webgl } from '../engine/webgl'
import { Matrix4 } from '../math'
import { generateSphere } from '../mesh/sphere'

import vertex from '../shaders/loadingSphere.vert'
import fragment from '../shaders/loadingSphere.frag'


export class LoadingSphere {

    vao: WebGLVertexArrayObject | null
    vertexCount: number
    matrix: Matrix4
    shader: WebGLProgram | null
    uniforms: Record<string, WebGLUniformLocation>

    constructor() {
        this.vao = null
        this.matrix = Matrix4.identity()
        this.vertexCount = 0
        this.shader = null
        this.uniforms = {}
    }


    async load(gl: WebGL2RenderingContext) {

        const sphere = generateSphere(1)
        this.vertexCount = sphere.triangles.length * 3

        this.shader = webgl.loadShader(gl, vertex, fragment)

        this.vao = gl.createVertexArray()
        gl.bindVertexArray(this.vao)

        webgl.loadAttribute(
            gl, 'a_position', this.shader,
            sphere.points, 3, gl.FLOAT, false
        )

        const uniforms = [
            'u_view_projection_matrix', 'u_matrix',
        ]
        for (const uniform of uniforms) {
            this.uniforms[uniform] = gl.getUniformLocation(this.shader, uniform)!
        }

    }


    render(gl: WebGL2RenderingContext, viewProjectionMatrix: Matrix4) {

        gl.useProgram(this.shader)
        gl.bindVertexArray(this.vao)

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
            // gl.TRIANGLES,
            // gl.LINE_LOOP,
            gl.LINE_STRIP,
            0, // offset
            this.vertexCount
        )

    }

}

