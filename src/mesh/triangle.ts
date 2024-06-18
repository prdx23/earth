
import { Vec3 } from "../math/vector";



export class Triangle {

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
            new Triangle(v2v3mid, this.v3, v1v3mid),
            new Triangle(v1v3mid, this.v1, v1v2mid),
            new Triangle(v1v2mid, this.v2, v2v3mid),
            new Triangle(v1v3mid, v1v2mid, v2v3mid),
        ]

        return Triangle.subdivideAll(triangles, depth - 1)
    }


    static subdivideAll(triangles: Triangle[], depth: number): Triangle[] {
        if (depth == 0) { return triangles }
        return triangles.flatMap(x => x.subdivide(depth))
    }

}
