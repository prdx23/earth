
import { webgl } from "../engine/webgl"
import { Matrix4, Vec3 } from "../math"
import { generateSphere } from "../mesh/sphere"



export class Earth {

    static radius = 1274.2 / 2.0
    static center = Vec3.zero()
    static scalingFactor = 10000.0

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


        sphere.points.forEach((x, i, a) => a[i] = x * Earth.radius)
        webgl.loadAttribute(
            gl, 'a_position', this.shader, sphere.points, 3, gl.FLOAT, false
        )

        const texture1 = await webgl.loadTexture(
            gl, 'src/textures/world.200410.3x5400x2700.jpg'
            // gl, 'untracked/NASA_Earth_Textures/earth_color_10K.jpg'
        )
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

        const texture2 = await webgl.loadTexture(
            gl, 'src/textures/earth_landocean_4K.png'
            // gl, 'src/textures/specular_map_8k.jpg'
            // gl, 'untracked/NASA_Earth_Textures/earth_landocean_8K.png'
        )
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)

        const texture3 = await webgl.loadTexture(
            gl, 'src/textures/earth_nightlights_10K.jpg'
        )
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)

        const texture4 = await webgl.loadTexture(
            gl, 'src/textures/earth_clouds_8K.jpg'
        )
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)


        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texture1)
        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, texture2)
        gl.activeTexture(gl.TEXTURE2)
        gl.bindTexture(gl.TEXTURE_2D, texture3)
        gl.activeTexture(gl.TEXTURE3)
        gl.bindTexture(gl.TEXTURE_2D, texture4)


        const uniforms = [
            'u_time', 'u_view_projection_matrix', 'u_matrix',
            'u_land_texture', 'u_water_texture',
            'u_nightlights_texture', 'u_clouds_texture',
            'u_light_direction', 'u_camera_position',
        ]
        for (const uniform of uniforms) {
            this.uniforms[uniform] = gl.getUniformLocation(this.shader, uniform)!
        }

        gl.useProgram(this.shader)
        gl.bindVertexArray(this.vao)
        gl.uniform1i(this.uniforms.u_land_texture, 0)
        gl.uniform1i(this.uniforms.u_water_texture, 1)
        gl.uniform1i(this.uniforms.u_nightlights_texture, 2)
        gl.uniform1i(this.uniforms.u_clouds_texture, 3)

    }


    render(
        gl: WebGL2RenderingContext,
        t: number,
        viewProjectionMatrix: Matrix4,
        lightDirection: Vec3,
        cameraPosition: Vec3,
    ) {

        gl.useProgram(this.shader)
        gl.bindVertexArray(this.vao)

        gl.uniform1f(this.uniforms.u_time, t)

        gl.uniform3f(
            this.uniforms.u_light_direction,
            lightDirection.x, lightDirection.y, lightDirection.z
        )

        gl.uniform3f(
            this.uniforms.u_camera_position,
            cameraPosition.x, cameraPosition.y, cameraPosition.z
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
