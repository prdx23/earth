
import { Vec3 } from '../math'
import { Earth } from '../objects/earth'
import { choice, rng } from '../utils'


export function generateStars(NPARTICLES: number) {

    const colorOptions = [
        [155, 176, 255],
        [170, 191, 255],
        [202, 215, 255],
        [248, 247, 255],
        [255, 244, 234],

        [202, 215, 255],
        [248, 247, 255],
        [255, 244, 234],
        [202, 215, 255],
        [248, 247, 255],
        [255, 244, 234],
        [202, 215, 255],
        [248, 247, 255],
        [255, 244, 234],

        [255, 210, 161],
        [255, 204, 111],
        [255, 128, 112],

        // '#9bb0ff',
        // '#aabfff',
        // '#cad7ff',
        // '#f8f7ff',
        // '#fff4ea',
        // '#ffd2a1',
        // '#ffcc6f',
        // '#ff8070',
    ]

    const vertices = []
    const colors = []
    const sizes = []

    for (let i = 0; i < NPARTICLES; i++ ) {
        const v = new Vec3(
            (Math.random() * 2.0) - 1.0,
            (Math.random() * 2.0) - 1.0,
            (Math.random() * 2.0) - 1.0,
        )
        v.normalize()
        v.scale((Math.random() * 0.4) + 0.6)
        v.scale(Earth.radius * 18)

        vertices.push(v.x)
        vertices.push(v.y)
        vertices.push(v.z)

        const color = choice(colorOptions)
        colors.push(color[0])
        colors.push(color[1])
        colors.push(color[2])

        const size = choice([rng(20, 40), rng(20, 30), rng(20, 25)]) / 10
        sizes.push(size)
    }

    return {
        vertices: new Float32Array(vertices),
        colors: new Uint8Array(colors),
        sizes: new Float32Array(sizes),
    }

}
