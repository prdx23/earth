
import { webgl } from "../engine/webgl"
import { Matrix4, Vec3 } from "../math"
import { generateSphere } from "../mesh/sphere"
import { Earth } from "./earth"



export class Atmosphere {

    static height = 80.0

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

        this.shader = await webgl.loadShader(gl, 'atmosphere')

        this.vao = gl.createVertexArray()
        gl.bindVertexArray(this.vao)


        sphere.points.forEach(
            (x, i, a) => a[i] = x * (Earth.radius + Atmosphere.height)
        )
        webgl.loadAttribute(
            gl, 'a_position', this.shader, sphere.points, 3, gl.FLOAT, false
        )


        const uniforms = [
            'u_time', 'u_view_projection_matrix', 'u_matrix',
            'u_light_direction', 'u_camera_position',
            'earth_radius', 'atmos_height', 'atmos_radius', 'earth_center',
        ]
        for (const uniform of uniforms) {
            this.uniforms[uniform] = gl.getUniformLocation(this.shader, uniform)!
        }

        gl.useProgram(this.shader)
        gl.bindVertexArray(this.vao)
        gl.uniform1f(this.uniforms.earth_radius, Earth.radius)
        gl.uniform1f(this.uniforms.atmos_height, Atmosphere.height)
        gl.uniform1f(
            this.uniforms.atmos_radius, Earth.radius + Atmosphere.height
        )
        gl.uniform3f(
            this.uniforms.earth_center,
            Earth.center.x, Earth.center.y, Earth.center.z
        )

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
