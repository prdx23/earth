

type Gl = WebGL2RenderingContext



export class Shader {

    vertFile: string
    fragFile: string
    program!: WebGLProgram
    locations: Record<string, WebGLUniformLocation>


    constructor(vertFile: string, fragFile: string) {
        this.vertFile = vertFile
        this.fragFile = fragFile
        this.locations = {}
    }


    async load(gl: Gl, locationNames: string[]): Promise<void> {

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

        const vertexShader = createShader(
            gl,
            gl.VERTEX_SHADER,
            (await import(`../shaders/${this.vertFile}.vert?raw`)).default
        )

        const fragmentShader = createShader(
            gl,
            gl.FRAGMENT_SHADER,
            (await import(`../shaders/${this.fragFile}.frag?raw`)).default,
        )

        const program = gl.createProgram()!
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)

        if( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
            console.error('Program Error: ', gl.getProgramInfoLog(program))
            gl.deleteProgram(program)
        }

        this.program = program

        for (const name of locationNames) {
            this.locations[name] = gl.getUniformLocation(program, name)!
        }

    }


}


export function initWebgl(width: number, height: number) {

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.style.width = `${Math.floor(width / height * 1000)}px`
    canvas.style.height = `${1000}px`

    const gl = canvas.getContext('webgl2')
    return gl
}


