
import { webgl } from '../engine/webgl'
import { loadImage } from '../utils'

import vertex from '../shaders/textureOptimize.vert'
import fragment from '../shaders/textureOptimize.frag'


export async function run() {

    const gl: WebGL2RenderingContext = webgl.init(4000, 2000)!

    document.body.appendChild(gl.canvas as HTMLCanvasElement)

    const shader = webgl.loadShader(gl, vertex, fragment)

    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)

    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,

      -1,  1,
       1, -1,
       1,  1,
    ])

    webgl.loadAttribute(
        gl, 'a_position', shader, vertices, 2, gl.FLOAT, false
    )

    const textureCords = new Float32Array([
        0.0, 1.0,
        1.0, 1.0,
        0.0, 0.0,

        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,
    ])

    webgl.loadAttribute(
        gl, 'a_texture_cords', shader, textureCords, 2, gl.FLOAT, false
    )


    const uLocations: Record<string, WebGLUniformLocation> = {}

    const uniforms = [
        'u_water_texture',
        'u_clouds_texture',
        'u_nightlights_texture',
    ]
    for (const uniform of uniforms) {
        uLocations[uniform] = gl.getUniformLocation(shader, uniform)!
    }


    gl.activeTexture(gl.TEXTURE0)
    const image0 = await loadImage(
        'untracked/NASA_Earth_Textures/earth_landocean_8K.png'
    )
    const texture0 = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture0)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image0)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)


    gl.activeTexture(gl.TEXTURE1)
    const image1 = await loadImage(
        'src/textures/earth_clouds_8K.jpg'
    )
    const texture1 = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture1)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image1)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)


    gl.activeTexture(gl.TEXTURE2)
    const image2 = await loadImage(
        'src/textures/earth_nightlights_10K.jpg'
    )
    const texture2 = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture2)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)


    gl.useProgram(shader)
    gl.bindVertexArray(vao)

    gl.uniform1i(uLocations.u_water_texture, 0)
    gl.uniform1i(uLocations.u_clouds_texture, 1)
    gl.uniform1i(uLocations.u_nightlights_texture, 2)


    gl.drawArrays(gl.TRIANGLES, 0, 6)

}
