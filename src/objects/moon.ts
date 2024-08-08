
import { webgl } from '../engine/webgl'
import { Matrix4, Quaternion, Vec3 } from '../math'
import { generateSphere } from '../mesh/sphere'
import { loadImage } from '../utils'
import { Earth } from './earth'


import vertex from '../shaders/moon.vert'
import fragment from '../shaders/moon.frag'


const q1 = Quaternion.identity()
const q2 = Quaternion.identity()


export class Moon {

    static radius = Earth.radius * 0.2727
    static inclination = 5.145
    static tilt = 6.68
    static distance = 38440 / 10

    vao: WebGLVertexArrayObject | null
    vertexCount: number
    matrix: Matrix4
    shader: WebGLProgram | null
    uniforms: Record<string, WebGLUniformLocation>
    angle: number

    constructor() {
        this.vao = null
        this.matrix = Matrix4.identity()
        this.vertexCount = 0
        this.shader = null
        this.uniforms = {}
        this.angle = 0
    }


    async load(gl: WebGL2RenderingContext) {

        const sphere = generateSphere(3)
        this.vertexCount = sphere.triangles.length * 3

        this.shader = webgl.loadShader(gl, vertex, fragment)

        this.vao = gl.createVertexArray()
        gl.bindVertexArray(this.vao)


        sphere.points.forEach((x, i, a) => a[i] = x * Moon.radius)
        webgl.loadAttribute(
            gl, 'a_position', this.shader, sphere.points, 3, gl.FLOAT, false
        )


        gl.activeTexture(gl.TEXTURE4)
        const image4 = await loadImage('moon_2k.png')
        const texture4 = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, texture4)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image4)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)

        const uniforms = [
            'u_time', 'u_view_projection_matrix', 'u_matrix',
            'u_light_direction', 'u_camera_position',
            'u_moon_texture',
        ]
        for (const uniform of uniforms) {
            this.uniforms[uniform] = gl.getUniformLocation(this.shader, uniform)!
        }

        gl.useProgram(this.shader)
        gl.bindVertexArray(this.vao)
        gl.uniform1i(this.uniforms.u_moon_texture, 4)

    }


    render(
        gl: WebGL2RenderingContext,
        elapsed: number,
        viewProjectionMatrix: Matrix4,
        lightDirection: Vec3,
        cameraPosition: Vec3,
    ) {

        this.angle += (0.5 * elapsed / 1000) % 360

        q1.identity()
            .multiply(q2.setAxisAngle(
                Vec3.right, Moon.inclination * Math.PI / 180
            ))
            .multiply(q2.setAxisAngle(
                Vec3.up, (this.angle) * Math.PI / 180
            ))
            .multiply(q2.setAxisAngle(
                Vec3.front, Moon.tilt * Math.PI / 180
            ))

        this.matrix.identity()
            .multiply(q1.matrix())
            .translate(Moon.distance, 0, 0)


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
