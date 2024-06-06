import { Vec3 } from "./math/vector";



class Triangle {

    v1: Vec3
    v2: Vec3
    v3: Vec3

    constructor(v1: Vec3, v2: Vec3, v3: Vec3) {
        this.v1 = v1
        this.v2 = v2
        this.v3 = v3
    }

    flat(): number[] {
        return [
            this.v1.x, this.v1.y, this.v1.z,
            this.v2.x, this.v2.y, this.v2.z,
            this.v3.x, this.v3.y, this.v3.z,
        ]
    }

    normalize(): void {
        this.v1.normalize()
        this.v2.normalize()
        this.v3.normalize()
    }

    subdivide(depth: number): Triangle[] {

        if (depth == 0) {
            return [this]
        }

        const v1v2mid = Vec3.midpoint(this.v1, this.v2)
        const v2v3mid = Vec3.midpoint(this.v2, this.v3)
        const v1v3mid = Vec3.midpoint(this.v1, this.v3)

        const triangles = [
            new Triangle(this.v1, v1v2mid, v1v3mid),
            new Triangle(v1v2mid, this.v2, v2v3mid),
            new Triangle(v1v3mid, v2v3mid, this.v3),
            new Triangle(v1v2mid, v2v3mid, v1v3mid),
        ]

        return Triangle.subdivideAll(triangles, depth - 1)

    }


    static subdivideAll(triangles: Triangle[], depth: number): Triangle[] {
        if (depth == 0) { return triangles }
        return triangles.flatMap(x => x.subdivide(depth))
    }

}



export function generateIcosahedron(depth: number = 1) {

    // golden ratio
    const phi = (1 + Math.sqrt(5)) / 2
    const s = 1 / 2
    const l = phi / 2

    const v1  = new Vec3(-l,  0, -s)
    const v2  = new Vec3(+l,  0, -s)
    const v3  = new Vec3(+l,  0, +s)
    const v4  = new Vec3(-l,  0, +s)
    const v5  = new Vec3(-s, +l,  0)
    const v6  = new Vec3(+s, +l,  0)
    const v7  = new Vec3(+s, -l,  0)
    const v8  = new Vec3(-s, -l,  0)
    const v9  = new Vec3( 0, +s, -l)
    const v10 = new Vec3( 0, +s, +l)
    const v11 = new Vec3( 0, -s, +l)
    const v12 = new Vec3( 0, -s, -l)

    const triangles = Triangle.subdivideAll([

        // front top
        new Triangle(v4, v10, v5),
        new Triangle(v5, v10, v6),
        new Triangle(v6, v10, v3),

        // front
        new Triangle(v4, v11, v10),
        new Triangle(v11, v3, v10),

        // front down
        new Triangle(v8, v11, v4),
        new Triangle(v7, v11, v8),
        new Triangle(v3, v11, v7),

        // right
        new Triangle(v3, v2, v6),
        new Triangle(v7, v2, v3),

        // back top
        new Triangle(v2, v9, v6),
        new Triangle(v6, v9, v5),
        new Triangle(v5, v9, v1),

        // back
        new Triangle(v2, v12, v9),
        new Triangle(v9, v12, v1),

        // back down
        new Triangle(v7, v12, v2),
        new Triangle(v8, v12, v7),
        new Triangle(v1, v12, v8),

        // left
        new Triangle(v1, v4, v5),
        new Triangle(v8, v4, v1),

    ], depth)

    const points = []
    for (const triangle of triangles) {
        triangle.normalize()
        points.push(...triangle.flat())
    }


    const colors = [

        // front top
        [200,  70, 120],
        [80,  70, 120],
        // [200,  70, 120],

        // front
        [80, 70, 200],
        [160, 160, 220],

        // front down
        // [200,  70, 120],
        // [80,  70, 120],
        // [200,  70, 120],

        // right
        [76, 170, 100],
        [140, 170, 80],

        // back top
        // [80,  70, 120],
        // [200,  70, 120],
        // [80,  70, 120],

        // // back
        // [160, 160, 220],
        // [80, 70, 200],

        // // back down
        // [80,  70, 120],
        // [200,  70, 120],
        // [80,  70, 120],

        // // left
        // [140, 170, 80],
        // [76, 170, 100],
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
