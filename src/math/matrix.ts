
// Reference: https://github.com/toji/gl-matrix/blob/master/src/mat4.js
// Reference: https://webgl2fundamentals.org/


import { Vec3 } from "./vector"


export class Matrix4 {


    matrix: Float32Array


    constructor(values: number[]) {
        this.matrix = new Float32Array(values)
    }


    // clone(): Matrix4 {
    //     return new Matrix4([
    //         this.matrix[0], this.matrix[1], this.matrix[2], this.matrix[3],
    //         this.matrix[4], this.matrix[5], this.matrix[6], this.matrix[7],
    //         this.matrix[8], this.matrix[9], this.matrix[10], this.matrix[11],
    //         this.matrix[12], this.matrix[13], this.matrix[14], this.matrix[15],
    //     ])
    // }

    static copy(a: Matrix4, b: Matrix4): void {
        a.matrix[0]  = b.matrix[0]
        a.matrix[1]  = b.matrix[1]
        a.matrix[2]  = b.matrix[2]
        a.matrix[3]  = b.matrix[3]
        a.matrix[4]  = b.matrix[4]
        a.matrix[5]  = b.matrix[5]
        a.matrix[6]  = b.matrix[6]
        a.matrix[7]  = b.matrix[7]
        a.matrix[8]  = b.matrix[8]
        a.matrix[9]  = b.matrix[9]
        a.matrix[10] = b.matrix[10]
        a.matrix[11] = b.matrix[11]
        a.matrix[12] = b.matrix[12]
        a.matrix[13] = b.matrix[13]
        a.matrix[14] = b.matrix[14]
        a.matrix[15] = b.matrix[15]
    }


    static identity(): Matrix4 {
        return new Matrix4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ])
    }


    static translation(tx: number, ty: number, tz: number): Matrix4 {
        return new Matrix4([
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            tx, ty, tz, 1,
        ])
    }


    translate(tx: number, ty: number, tz: number): Matrix4 {
        return this.__multiplyInternal(
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            tx, ty, tz, 1,
        )
    }


    static xRotation(angleInRadians: number): Matrix4 {
        const c = Math.cos(angleInRadians)
        const s = Math.sin(angleInRadians)
        return new Matrix4([
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ])
    }


    rotateX(angleInRadians: number): Matrix4 {
        const c = Math.cos(angleInRadians)
        const s = Math.sin(angleInRadians)
        return this.__multiplyInternal(
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        )
    }


    static yRotation(angleInRadians: number): Matrix4 {
        const c = Math.cos(angleInRadians)
        const s = Math.sin(angleInRadians)
        return new Matrix4([
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ])
    }


    rotateY(angleInRadians: number): Matrix4 {
        const c = Math.cos(angleInRadians)
        const s = Math.sin(angleInRadians)
        return this.__multiplyInternal(
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        )
    }


    static zRotation(angleInRadians: number): Matrix4 {
        const c = Math.cos(angleInRadians)
        const s = Math.sin(angleInRadians)
        return new Matrix4([
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ])
    }


    rotateZ(angleInRadians: number): Matrix4 {
        const c = Math.cos(angleInRadians)
        const s = Math.sin(angleInRadians)
        return this.__multiplyInternal(
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        )
    }


    static scaling(sx: number, sy: number, sz: number): Matrix4 {
        return new Matrix4([
            sx, 0,  0,  0,
            0, sy,  0,  0,
            0,  0, sz,  0,
            0,  0,  0,  1,
        ])
    }


    scale(sx: number, sy: number, sz: number): Matrix4 {
        return this.__multiplyInternal(
            sx, 0,  0,  0,
            0, sy,  0,  0,
            0,  0, sz,  0,
            0,  0,  0,  1,
        )
    }


    // ------------------------------


    // static projection(width: number, height: number, depth: number): Matrix4 {
    //     return new Matrix4([
    //         2 / width, 0, 0, 0,
    //         0, -2 / height, 0, 0,
    //         0, 0, 2 / depth, 0,
    //         -1, 1, 0, 1,
    //     ])
    // }


    // static orthographic(
    //     left: number, right: number, bottom: number, top: number,
    //     near: number, far: number
    // ): Matrix4 {
    //     return new Matrix4([
    //         2 / (right - left), 0, 0, 0,
    //         0, 2 / (top - bottom), 0, 0,
    //         0, 0, 2 / (near - far), 0,

    //         (left + right) / (left - right),
    //         (bottom + top) / (bottom - top),
    //         (near + far) / (near - far),
    //         1,
    //     ])
    // }


    static perspective(
        fovInRadians: number, aspect: number, near: number, far: number
    ): Matrix4 {
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fovInRadians)
        const rangeInv = 1.0 / (near - far)
        return new Matrix4([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ])
    }

    static lookAt(cameraPosition: Vec3, target: Vec3, up: Vec3): Matrix4 {
        const cx = cameraPosition.x
        const cy = cameraPosition.y
        const cz = cameraPosition.z

        const zAxis = cameraPosition.subtract(target).normalize()
        const xAxis = up.cross(zAxis).normalize()
        const yAxis = zAxis.cross(xAxis).normalize()

        return new Matrix4([
            xAxis.x, xAxis.y, xAxis.z, 0,
            yAxis.x, yAxis.y, yAxis.z, 0,
            zAxis.x, zAxis.y, zAxis.z, 0,
            cx, cy, cz, 1,
        ])
    }


    // ------------------------------


    __multiplyInternal(
        b00: number, b01: number, b02: number, b03: number,
        b10: number, b11: number, b12: number, b13: number,
        b20: number, b21: number, b22: number, b23: number,
        b30: number, b31: number, b32: number, b33: number,
    ): Matrix4 {

        const a00 = this.matrix[0 * 4 + 0]
        const a01 = this.matrix[0 * 4 + 1]
        const a02 = this.matrix[0 * 4 + 2]
        const a03 = this.matrix[0 * 4 + 3]
        const a10 = this.matrix[1 * 4 + 0]
        const a11 = this.matrix[1 * 4 + 1]
        const a12 = this.matrix[1 * 4 + 2]
        const a13 = this.matrix[1 * 4 + 3]
        const a20 = this.matrix[2 * 4 + 0]
        const a21 = this.matrix[2 * 4 + 1]
        const a22 = this.matrix[2 * 4 + 2]
        const a23 = this.matrix[2 * 4 + 3]
        const a30 = this.matrix[3 * 4 + 0]
        const a31 = this.matrix[3 * 4 + 1]
        const a32 = this.matrix[3 * 4 + 2]
        const a33 = this.matrix[3 * 4 + 3]

        this.matrix[0]  = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30
        this.matrix[1]  = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31
        this.matrix[2]  = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32
        this.matrix[3]  = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33
        this.matrix[4]  = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30
        this.matrix[5]  = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31
        this.matrix[6]  = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32
        this.matrix[7]  = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33
        this.matrix[8]  = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30
        this.matrix[9]  = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31
        this.matrix[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32
        this.matrix[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33
        this.matrix[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30
        this.matrix[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31
        this.matrix[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32
        this.matrix[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33

        return this
    }


    multiply(other: Matrix4): Matrix4 {
        return this.__multiplyInternal(
            other.matrix[0 * 4 + 0],
            other.matrix[0 * 4 + 1],
            other.matrix[0 * 4 + 2],
            other.matrix[0 * 4 + 3],
            other.matrix[1 * 4 + 0],
            other.matrix[1 * 4 + 1],
            other.matrix[1 * 4 + 2],
            other.matrix[1 * 4 + 3],
            other.matrix[2 * 4 + 0],
            other.matrix[2 * 4 + 1],
            other.matrix[2 * 4 + 2],
            other.matrix[2 * 4 + 3],
            other.matrix[3 * 4 + 0],
            other.matrix[3 * 4 + 1],
            other.matrix[3 * 4 + 2],
            other.matrix[3 * 4 + 3],
        )
    }


    inverse(): Matrix4 {

        const m00 = this.matrix[0 * 4 + 0]
        const m01 = this.matrix[0 * 4 + 1]
        const m02 = this.matrix[0 * 4 + 2]
        const m03 = this.matrix[0 * 4 + 3]
        const m10 = this.matrix[1 * 4 + 0]
        const m11 = this.matrix[1 * 4 + 1]
        const m12 = this.matrix[1 * 4 + 2]
        const m13 = this.matrix[1 * 4 + 3]
        const m20 = this.matrix[2 * 4 + 0]
        const m21 = this.matrix[2 * 4 + 1]
        const m22 = this.matrix[2 * 4 + 2]
        const m23 = this.matrix[2 * 4 + 3]
        const m30 = this.matrix[3 * 4 + 0]
        const m31 = this.matrix[3 * 4 + 1]
        const m32 = this.matrix[3 * 4 + 2]
        const m33 = this.matrix[3 * 4 + 3]

        const b00 = m00 * m11 - m01 * m10
        const b01 = m00 * m12 - m02 * m10
        const b02 = m00 * m13 - m03 * m10
        const b03 = m01 * m12 - m02 * m11
        const b04 = m01 * m13 - m03 * m11
        const b05 = m02 * m13 - m03 * m12
        const b06 = m20 * m31 - m21 * m30
        const b07 = m20 * m32 - m22 * m30
        const b08 = m20 * m33 - m23 * m30
        const b09 = m21 * m32 - m22 * m31
        const b10 = m21 * m33 - m23 * m31
        const b11 = m22 * m33 - m23 * m32

        const det = 1.0 / (
            b00 * b11 - b01 * b10 + b02 * b09 +
            b03 * b08 - b04 * b07 + b05 * b06
        )

        return new Matrix4([
            (m11 * b11 - m12 * b10 + m13 * b09) * det,
            (m02 * b10 - m01 * b11 - m03 * b09) * det,
            (m31 * b05 - m32 * b04 + m33 * b03) * det,
            (m22 * b04 - m21 * b05 - m23 * b03) * det,
            (m12 * b08 - m10 * b11 - m13 * b07) * det,
            (m00 * b11 - m02 * b08 + m03 * b07) * det,
            (m32 * b02 - m30 * b05 - m33 * b01) * det,
            (m20 * b05 - m22 * b02 + m23 * b01) * det,
            (m10 * b10 - m11 * b08 + m13 * b06) * det,
            (m01 * b08 - m00 * b10 - m03 * b06) * det,
            (m30 * b04 - m31 * b02 + m33 * b00) * det,
            (m21 * b02 - m20 * b04 - m23 * b00) * det,
            (m11 * b07 - m10 * b09 - m12 * b06) * det,
            (m00 * b09 - m01 * b07 + m02 * b06) * det,
            (m31 * b01 - m30 * b03 - m32 * b00) * det,
            (m20 * b03 - m21 * b01 + m22 * b00) * det,
        ])

        // this.matrix[0]  = (m11 * b11 - m12 * b10 + m13 * b09) * det
        // this.matrix[1]  = (m02 * b10 - m01 * b11 - m03 * b09) * det
        // this.matrix[2]  = (m31 * b05 - m32 * b04 + m33 * b03) * det
        // this.matrix[3]  = (m22 * b04 - m21 * b05 - m23 * b03) * det
        // this.matrix[4]  = (m12 * b08 - m10 * b11 - m13 * b07) * det
        // this.matrix[5]  = (m00 * b11 - m02 * b08 + m03 * b07) * det
        // this.matrix[6]  = (m32 * b02 - m30 * b05 - m33 * b01) * det
        // this.matrix[7]  = (m20 * b05 - m22 * b02 + m23 * b01) * det
        // this.matrix[8]  = (m10 * b10 - m11 * b08 + m13 * b06) * det
        // this.matrix[9]  = (m01 * b08 - m00 * b10 - m03 * b06) * det
        // this.matrix[10] = (m30 * b04 - m31 * b02 + m33 * b00) * det
        // this.matrix[11] = (m21 * b02 - m20 * b04 - m23 * b00) * det
        // this.matrix[12] = (m11 * b07 - m10 * b09 - m12 * b06) * det
        // this.matrix[13] = (m00 * b09 - m01 * b07 + m02 * b06) * det
        // this.matrix[14] = (m31 * b01 - m30 * b03 - m32 * b00) * det
        // this.matrix[15] = (m20 * b03 - m21 * b01 + m22 * b00) * det

    }

}
