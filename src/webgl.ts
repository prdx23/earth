

export type Gl = WebGL2RenderingContext


export function createProgram(gl: Gl, vsSource: string, fsSource: string) {

    function createShader(gl: Gl, type: number, source: string) {
        const shader = gl.createShader(type)!
        gl.shaderSource(shader, source)
        gl.compileShader(shader)

        if( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
            console.error('Shader Error: ', gl.getShaderInfoLog(shader), source)
            gl.deleteShader(shader)
        }

        return shader
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource)

    const program = gl.createProgram()!
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
        console.error('Program Error: ', gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
    }

    return program
}


export function loadBuffer(gl: Gl, data: ArrayBuffer, drawType: number) {
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, drawType)
    return buffer
}


export function initWebgl(width: number, height: number) {

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.style.width = `${Math.floor(width / height * 800)}px`
    canvas.style.height = `${800}px`

    const gl = canvas.getContext('webgl2')
    return gl
}


