
import { webgl } from "../engine/webgl"
import { Matrix4 } from "../math"


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

        this.shader = await webgl.loadShader(gl, 'stars')

        this.vao = gl.createVertexArray()
        gl.bindVertexArray(this.vao)

        const vertices = new Float32Array([
          -1, -1,
           1, -1,
          -1,  1,

          -1,  1,
           1, -1,
           1,  1,
        ])

        webgl.loadAttribute(
            gl, 'a_position', this.shader,
            vertices, 2, gl.FLOAT, false
        )


        // gl.activeTexture(gl.TEXTURE4)
        // const texture = await webgl.loadTexture(
        //     gl, 'src/textures/stars_colors.png'
        // )
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)

        const uniforms = [
            'u_inv_view_projection_matrix', 'u_stars_colors'
        ]
        for (const uniform of uniforms) {
            this.uniforms[uniform] = gl.getUniformLocation(this.shader, uniform)!
        }

        // gl.useProgram(this.shader)
        // gl.bindVertexArray(this.vao)
        // gl.uniform1i(this.uniforms.u_stars_texture, 4)

    }


    render(gl: WebGL2RenderingContext, invViewProjectionMatrix: Matrix4) {

        gl.useProgram(this.shader)
        gl.bindVertexArray(this.vao)

        gl.uniformMatrix4fv(
            this.uniforms['u_inv_view_projection_matrix'],
            false,
            invViewProjectionMatrix.matrix
        )

        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount)
    }

}
