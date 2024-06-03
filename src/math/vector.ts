

export class Vec3 {

    x: number
    y: number
    z: number

    constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }

    set(x: number, y: number, z: number): void {
        this.x = x
        this.y = y
        this.z = z
    }

    // setX(x: number): void {
    //     this.x = x
    // }

    // setY(y: number): void {
    //     this.y = y
    // }

    // setZ(z: number): void {
    //     this.z = z
    // }

    // clone(): Vec3 {
    //     return new Vec3(this.x, this.y, this.z)
    // }

    // static copy(a: Vec3, b: Vec3): void {
    //     a.x = b.x
    //     a.y = b.y
    //     a.z = b.z
    // }

    copy(other: Vec3): Vec3 {
        this.x = other.x
        this.y = other.y
        this.z = other.z
        return this
    }

    static zero(): Vec3 {
        return new Vec3(0, 0, 0)
    }


    static readonly origin = new Vec3(0, 0, 0)
    static readonly up = new Vec3(0, 1, 0)
    static readonly right = new Vec3(1, 0, 0)
    static readonly front = new Vec3(0, 0, 1)


    // --------------------------

    // static add(a: Vec3, b: Vec3): Vec3 {
    //     return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z)
    // }

    // static subtract(a: Vec3, b: Vec3): Vec3 {
    //     return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z)
    // }

    // static multiply(a: Vec3, b: Vec3): Vec3 {
    //     return new Vec3(a.x * b.x, a.y * b.y, a.z * b.z)
    // }

    // static divide(a: Vec3, b: Vec3): Vec3 {
    //     return new Vec3(a.x / b.x, a.y / b.y, a.z / b.z)
    // }

    // --------------------------


    add(other: Vec3): Vec3 {
        this.x += other.x
        this.y += other.y
        this.z += other.z
        return this
    }

    subtract(other: Vec3): Vec3 {
        this.x -= other.x
        this.y -= other.y
        this.z -= other.z
        return this
    }

    multiply(other: Vec3): Vec3 {
        this.x *= other.x
        this.y *= other.y
        this.z *= other.z
        return this
    }

    divide(other: Vec3): Vec3 {
        this.x /= other.x
        this.y /= other.y
        this.z /= other.z
        return this
    }

    scale(value: number): Vec3 {
        this.x *= value
        this.y *= value
        this.z *= value
        return this
    }

    sqLen(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }

    normalize(): Vec3 {
        if (this.isZero()) { return this }
        const invlen = 1 / this.length()
        this.x *= invlen
        this.y *= invlen
        this.z *= invlen
        return this
    }

    // asUnit(): Vec3 {
    //     if (this.isZero()) { return Vec3.zero() }
    //     const len = this.length()
    //     return new Vec3(this.x / len, this.y / len, this.z / len)
    // }

    dot(other: Vec3): number {
        return this.x * other.x + this.y * other.y + this.z * other.z
    }

    cross(other: Vec3): Vec3 {
        return new Vec3(
            (this.y * other.z) - (this.z * other.y),
            (this.z * other.x) - (this.x * other.z),
            (this.x * other.y) - (this.y * other.x),
        )
    }


    isZero(): boolean {
        return this.x == 0 && this.y == 0 && this.z == 0
    }

}
