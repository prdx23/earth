
import { webgl } from "../engine/webgl"
import { Matrix4, Vec3 } from "../math"
import { generateSphere } from "../mesh/sphere"



export class Earth {

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

        const sphere = generateSphere(5)
        this.vertexCount = sphere.triangles.length * 3

        this.shader = await webgl.loadShader(gl, 'earth')

        this.vao = gl.createVertexArray()
        gl.bindVertexArray(this.vao)


        webgl.loadAttribute(
            gl, 'a_position', this.shader, sphere.points, 3, gl.FLOAT, false
        )

        webgl.loadAttribute(
            gl, 'a_color', this.shader, sphere.colors, 3, gl.UNSIGNED_BYTE, true
        )


        const texture1 = await webgl.loadTexture(
            gl, 'src/textures/world.200410.3x5400x2700.jpg'
            // gl, 'untracked/NASA_Earth_Textures/earth_color_10K.jpg'
        )

        const texture2 = await webgl.loadTexture(
            gl, 'src/textures/earth_landocean_8K.png'
            // gl, 'untracked/NASA_Earth_Textures/earth_landocean_4K.png'
        )

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texture1)
        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, texture2)


        const uniforms = [
            'u_time', 'u_view_projection_matrix', 'u_matrix',
            'u_land_texture', 'u_water_texture',
            'u_light_direction', 'u_view_direction',
        ]
        for (const uniform of uniforms) {
            this.uniforms[uniform] = gl.getUniformLocation(this.shader, uniform)!
        }


        this.matrix.scale(100, 100, 100)

    }


    renderInit(gl: WebGL2RenderingContext) {
        gl.useProgram(this.shader)
        gl.bindVertexArray(this.vao)
        gl.uniform1i(this.uniforms.u_land_texture, 0)
        gl.uniform1i(this.uniforms.u_water_texture, 1)
    }


    render(
        gl: WebGL2RenderingContext,
        t: number,
        viewProjectionMatrix: Matrix4,
        lightDirection: Vec3,
        viewDirection: Vec3,
    ) {

        gl.useProgram(this.shader)
        gl.bindVertexArray(this.vao)

        gl.uniform1f(this.uniforms.u_time, t)

        gl.uniform3f(
            this.uniforms.u_light_direction,
            lightDirection.x, lightDirection.y, lightDirection.z
        )

        gl.uniform3f(
            this.uniforms.u_view_direction,
            viewDirection.x, viewDirection.y, viewDirection.z
        )

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
