
// Reference: https://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation#From_a_quaternion_to_an_orthogonal_matrix
// Reference: https://github.com/toji/gl-matrix/blob/master/src/quat.js

import { Matrix4 } from "./matrix"
import { Vec3 } from "./vector"



export class Quaternion {


    w: number
    x: number
    y: number
    z: number
    _matrix: Matrix4


    constructor(w: number, x: number, y: number, z: number) {
        this.w = w
        this.x = x
        this.y = y
        this.z = z
        this._matrix = Matrix4.identity()
    }


    static identity(): Quaternion {
        return new Quaternion(1, 0, 0, 0)
    }

    identity() {
        this.w = 1
        this.x = 0
        this.y = 0
        this.z = 0
    }


    static axisAngle(axis: Vec3, angleInRadians: number): Quaternion {
        const angle = angleInRadians / 2
        const sin = Math.sin(angle)
        const cos = Math.cos(angle)
        return new Quaternion(cos, sin * axis.x, sin * axis.y, sin * axis.z)
    }


    setAxisAngle(axis: Vec3, angleInRadians: number): Quaternion {
        const angle = angleInRadians / 2
        const sin = Math.sin(angle)
        this.w = Math.cos(angle)
        this.x = sin * axis.x
        this.y = sin * axis.y
        this.z = sin * axis.z
        return this
    }


    normalize(): Quaternion {
        const invlen = 1 / (
            this.w * this.w + this.x * this.x +
            this.y * this.y + this.z * this.z
        )
        this.w *= invlen
        this.x *= invlen
        this.y *= invlen
        this.z *= invlen
        return this
    }


    multiply(other: Quaternion): Quaternion {

        const aw = this.w
        const ax = this.x
        const ay = this.y
        const az = this.z
        const bw = other.w
        const bx = other.x
        const by = other.y
        const bz = other.z

        this.w = aw * bw - ax * bx - ay * by - az * bz
        this.x = ax * bw + aw * bx + ay * bz - az * by
        this.y = ay * bw + aw * by + az * bx - ax * bz
        this.z = az * bw + aw * bz + ax * by - ay * bx

        return this
    }


    matrix(): Matrix4 {

        const w = this.w
        const x = this.x
        const y = this.y
        const z = this.z

        const s = 2 / (w * w + x * x + y * y + z * z)
        const xs = x * s
        const ys = y * s
        const zs = z * s
        const wx = w * xs
        const wy = w * ys
        const wz = w * zs
        const xx = x * xs
        const xy = x * ys
        const xz = x * zs
        const yy = y * ys
        const yz = y * zs
        const zz = z * zs

        // | 1 - yy - zz     xy - wz         xz + wy      |
        // | xy + wz         1 - xx - zz     yz - wx      |
        // | xz - wy         yz + wx         1 - xx - yy  |

        this._matrix.set(
            1 - yy - zz,   xy + wz,       xz - wy,      0,
            xy - wz,       1 - xx - zz,   yz + wx,      0,
            xz + wy,       yz - wx,       1 - xx - yy,  0,
            0,             0,             0,            1,
        )
        return this._matrix
    }


    // matrix(): Matrix4 {

    //     // | w² + x² - y² - z²   2xy - 2wz           2xz + 2wy          |
    //     // | 2xy + 2wz           w² - x² + y² - z²   2yz - 2wx          |
    //     // | 2xz - 2wy           2yz + 2wx           w² - x² - y² + z²  |

    //     const w = this.w
    //     const x = this.x
    //     const y = this.y
    //     const z = this.z

    //     const w2 = w * w
    //     const x2 = x * x
    //     const y2 = y * y
    //     const z2 = z * z

    //     const _2xy = 2 * x * y
    //     const _2xz = 2 * x * z
    //     const _2yz = 2 * y * z
    //     const _2wx = 2 * w * x
    //     const _2wy = 2 * w * y
    //     const _2wz = 2 * w * z

    //     return new Matrix4([
    //         w2 + x2 - y2 - z2,  _2xy + _2wz,        _2xz - _2wy,       0,
    //         _2xy - _2wz,        w2 - x2 + y2 - z2,  _2yz + _2wx,       0,
    //         _2xz + _2wy,        _2yz - _2wx,        w2 - x2 - y2 + z2, 0,
    //         0,                  0,                  0,                 1,
    //     ])
    // }


}
