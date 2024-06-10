
import { generateIcosahedron } from "./icosahedron"
import { Triangle } from "./triangle"


export function generateSphere(depth: number = 1) {

    const icosahedron = generateIcosahedron()
    const triangles = Triangle.subdivideAll(icosahedron.triangles, depth)

    const points = []
    for (const triangle of triangles) {
        triangle.normalize()
        points.push(...triangle.flat())
    }

    const colors = [
        [200,  70, 120],
        [80,  70, 120],
        [80, 70, 200],
        [160, 160, 220],
        [76, 170, 100],
        [140, 170, 80],
    ]

    const vertexColors = []
    for (let i = 0; i < triangles.length; i++) {
        vertexColors.push(...colors[i % colors.length])
        vertexColors.push(...colors[i % colors.length])
        vertexColors.push(...colors[i % colors.length])
    }

    return {
        points: new Float32Array(points),
        colors: new Uint8Array(vertexColors),
        triangles: triangles,
        vertexColors: vertexColors,
    }

}
