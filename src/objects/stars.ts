
import { webgl } from '../engine/webgl'
import { Matrix4 } from '../math'

import vertex from '../shaders/stars.vert'
import fragment from '../shaders/stars.frag'
import { generateStars } from '../tools/generateStars'

export class Stars {

    vao: WebGLVertexArrayObject | null
    vertexCount: number
    shader: WebGLProgram | null
    uniforms: Record<string, WebGLUniformLocation>

    constructor() {
        this.vao = null
        this.vertexCount = 6
        this.shader = null
        this.uniforms = {}
    }


    async load(gl: WebGL2RenderingContext) {

        this.shader = webgl.loadShader(gl, vertex, fragment)

        this.vao = gl.createVertexArray()
        gl.bindVertexArray(this.vao)

        const NPARTICLES = 28000
        this.vertexCount = NPARTICLES

        const starsData = generateStars(NPARTICLES)

        webgl.loadAttribute(
            gl, 'a_position', this.shader,
            starsData.vertices, 3, gl.FLOAT, false
        )

        webgl.loadAttribute(
            gl, 'a_color', this.shader,
            starsData.colors, 3, gl.UNSIGNED_BYTE, true
        )

        webgl.loadAttribute(
            gl, 'a_size', this.shader,
            starsData.sizes, 1, gl.FLOAT, false
        )

        const uniforms = [
            'u_view_projection_matrix',
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

        gl.drawArrays(gl.POINTS, 0, this.vertexCount)
    }

}
