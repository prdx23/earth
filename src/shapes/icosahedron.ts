

export const icosahedron = generateIcosahedron()


export function generateIcosahedron() {

    // golden ratio
    const phi = (1 + Math.sqrt(5)) / 2
    const s = 1 / 2
    const l = phi / 2

    const v1  = { x: -l, y:  0, z: -s }
    const v2  = { x: +l, y:  0, z: -s }
    const v3  = { x: +l, y:  0, z: +s }
    const v4  = { x: -l, y:  0, z: +s }
    const v5  = { x: -s, y: +l, z:  0 }
    const v6  = { x: +s, y: +l, z:  0 }
    const v7  = { x: +s, y: -l, z:  0 }
    const v8  = { x: -s, y: -l, z:  0 }
    const v9  = { x:  0, y: +s, z: -l }
    const v10 = { x:  0, y: +s, z: +l }
    const v11 = { x:  0, y: -s, z: +l }
    const v12 = { x:  0, y: -s, z: -l }


    const vertices = [

        // front top
        v4, v10, v5,
        v5, v10, v6,
        v6, v10, v3,

        // front
        v4, v11, v10,
        v11, v3, v10,

        // front down
        v8, v11, v4,
        v7, v11, v8,
        v3, v11, v7,

        // right
        v3, v2, v6,
        v7, v2, v3,

        // back top
        v2, v9, v6,
        v6, v9, v5,
        v5, v9, v1,

        // back
        v2, v12, v9,
        v9, v12, v1,

        // back down
        v7, v12, v2,
        v8, v12, v7,
        v1, v12, v8,

        // left
        v1, v4, v5,
        v8, v4, v1,

    ]

    const colors = [

        // front top
        [200,  70, 120],
        [80,  70, 120],
        [200,  70, 120],

        // front
        [80, 70, 200],
        [160, 160, 220],

        // front down
        [200,  70, 120],
        [80,  70, 120],
        [200,  70, 120],

        // right
        [76, 170, 100],
        [140, 170, 80],

        // back top
        [80,  70, 120],
        [200,  70, 120],
        [80,  70, 120],

        // back
        [160, 160, 220],
        [80, 70, 200],

        // back down
        [80,  70, 120],
        [200,  70, 120],
        [80,  70, 120],

        // left
        [140, 170, 80],
        [76, 170, 100],
    ]


    const vertexColors = []
    for (let i = 0; i < vertices.length / 3; i++) {
        vertexColors.push(...colors[i % colors.length])
        vertexColors.push(...colors[i % colors.length])
        vertexColors.push(...colors[i % colors.length])
    }

    const points = []
    for (const vertex of vertices) {
        points.push(vertex.x)
        points.push(vertex.y)
        points.push(vertex.z)
    }

    return {
        points: new Float32Array(points),
        colors: new Uint8Array(vertexColors),
        vertices: vertices,
        vertexColors: vertexColors,
    }

}
