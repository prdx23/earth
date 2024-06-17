
import { webgl } from "../engine/webgl"
import { Matrix4, Vec3 } from "../math"
import { generateSphere } from "../mesh/sphere"
import { generateOpticalDepthTable } from "../tools/bakeOpticalDepth"
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
        // this.shader = await webgl.loadShader(gl, 'atmosphereLow')

        this.vao = gl.createVertexArray()
        gl.bindVertexArray(this.vao)


        sphere.points.forEach(
            (x, i, a) => a[i] = x * (Earth.radius + Atmosphere.height)
        )
        webgl.loadAttribute(
            gl, 'a_position', this.shader, sphere.points, 3, gl.FLOAT, false
        )

        const tableSize = 512
        const bakedOpticalDepth = generateOpticalDepthTable(tableSize)

        gl.activeTexture(gl.TEXTURE2)
        const texture2 = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, texture2)
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.R16F,
            tableSize, tableSize, 0, gl.RED, gl.FLOAT, bakedOpticalDepth
        )

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        const uniforms = [
            'u_time', 'u_view_projection_matrix', 'u_matrix',
            'u_light_direction', 'u_camera_position',
            'earth_radius', 'atmos_height', 'atmos_radius', 'earth_center',
            'u_optical_depth_texture',
        ]
        for (const uniform of uniforms) {
            this.uniforms[uniform] = gl.getUniformLocation(this.shader, uniform)!
        }

        gl.useProgram(this.shader)
        gl.bindVertexArray(this.vao)
        gl.uniform1f(this.uniforms.earth_radius, Earth.radius)
        gl.uniform1f(this.uniforms.atmos_height, Atmosphere.height)
        gl.uniform1i(this.uniforms.u_optical_depth_texture, 2)
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
        viewProjectionMatrix: Matrix4,
        lightDirection: Vec3,
        cameraPosition: Vec3,
    ) {

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
