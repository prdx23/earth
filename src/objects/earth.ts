
import { webgl } from '../engine/webgl'
import { Matrix4, Quaternion, Vec3 } from '../math'
import { generateSphere } from '../mesh/sphere'
import { loadImage } from '../utils'


import vertex from '../shaders/earth.vert'
import fragment from '../shaders/earth.frag'


const q = Quaternion.identity()


export class Earth {

    static radius = 1274.2 / 2.0
    static tilt = 23.5
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

        this.shader = webgl.loadShader(gl, vertex, fragment)

        this.vao = gl.createVertexArray()
        gl.bindVertexArray(this.vao)


        sphere.points.forEach((x, i, a) => a[i] = x * Earth.radius)
        webgl.loadAttribute(
            gl, 'a_position', this.shader, sphere.points, 3, gl.FLOAT, false
        )


        gl.activeTexture(gl.TEXTURE0)
        const image0 = await loadImage('src/textures/optimized/earth_4k.png')
        const texture0 = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, texture0)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image0)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)


        gl.activeTexture(gl.TEXTURE1)
        const image1 = await loadImage('src/textures/optimized/data_4k.png')
        const texture1 = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, texture1)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)


        const uniforms = [
            'u_time', 'u_view_projection_matrix', 'u_matrix',
            'u_earth_texture', 'u_data_texture',
            'u_light_direction', 'u_camera_position',
        ]
        for (const uniform of uniforms) {
            this.uniforms[uniform] = gl.getUniformLocation(this.shader, uniform)!
        }

        gl.useProgram(this.shader)
        gl.bindVertexArray(this.vao)
        gl.uniform1i(this.uniforms.u_earth_texture, 0)
        gl.uniform1i(this.uniforms.u_data_texture, 1)


        this.matrix.identity()
            .multiply(Quaternion.axisAngle(
                Vec3.front, -Earth.tilt * Math.PI / 180
            ).matrix())

    }


    render(
        gl: WebGL2RenderingContext,
        elapsed: number,
        viewProjectionMatrix: Matrix4,
        lightDirection: Vec3,
        cameraPosition: Vec3,
    ) {

        q.setAxisAngle(
            Vec3.up,
            ((1.0 * elapsed / 1000) % 360) * Math.PI / 180
        )
        this.matrix.multiply(q.matrix())

        gl.useProgram(this.shader)
        gl.bindVertexArray(this.vao)

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
