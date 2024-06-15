import { loadImage } from "../utils"


type Gl = WebGL2RenderingContext



export const webgl = {


    init(width: number, height: number): Gl | null {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.style.width = `${Math.floor(width / height * 1000)}px`
        canvas.style.height = `${1000}px`

        const gl = canvas.getContext('webgl2')
        return gl
    },


    async loadShader(gl: Gl, filename: string): Promise<WebGLProgram> {

        function createShader(gl: Gl, type: number, source: string) {
            const shader = gl.createShader(type)!
            gl.shaderSource(shader, source)
            gl.compileShader(shader)

            if( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
                console.error(`Shader Error: \n${gl.getShaderInfoLog(shader)}`)
                gl.deleteShader(shader)
            }

            return shader
        }

        const vertexShader = createShader(
            gl,
            gl.VERTEX_SHADER,
            (await import(`../shaders/${filename}.vert?raw`)).default
        )

        const fragmentShader = createShader(
            gl,
            gl.FRAGMENT_SHADER,
            (await import(`../shaders/${filename}.frag?raw`)).default,
        )

        const program = gl.createProgram()!
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)

        if( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
            console.error('Program Error: ', gl.getProgramInfoLog(program))
            gl.deleteProgram(program)
        }

        return program
    },


    loadAttribute(
        gl: Gl, name: string, shader: WebGLProgram, data: ArrayBufferLike,
        size: number, type: number, normalize: boolean,
        stride: number = 0, offset: number = 0
    ): void {

        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

        const position = gl.getAttribLocation(shader, name)
        if (position == -1) {
            console.warn(`Attribute Error: ${name} not found`)
            return
        }

        gl.enableVertexAttribArray(position)
        gl.vertexAttribPointer(position, size, type, normalize, stride, offset)

        gl.bindBuffer(gl.ARRAY_BUFFER, null)
    },


    async loadTexture(gl: Gl, path: string): Promise<WebGLTexture | null> {
        const image = await loadImage(path)
        const texture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image)
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        // gl.generateMipmap(gl.TEXTURE_2D)
        return texture
    }


}
