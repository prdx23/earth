
import { Matrix4 } from "../math/matrix";
import { Vec3 } from "../math/vector";



export class Camera {

    position: Vec3
    up: Vec3
    __matrix: Matrix4
    __projectionMatrix: Matrix4
    __viewProjectionMatrix: Matrix4

    constructor(fovInRadians: number, aspect: number, near: number, far: number) {
        this.position = Vec3.zero()
        this.up = new Vec3(0, 1, 0)
        this.__matrix = Matrix4.identity()
        this.__projectionMatrix = Matrix4.perspective(
            fovInRadians, aspect, near, far
        )
        this.__viewProjectionMatrix = Matrix4.identity()
    }


    lookAt(target: Vec3): void {
        this.__matrix = Matrix4.lookAt(this.position, target, this.up)
    }


    viewProjectionMatrix(): Matrix4 {
        Matrix4.copy(this.__viewProjectionMatrix, this.__projectionMatrix)
        return this.__viewProjectionMatrix.multiply(this.__matrix.inverse())
    }

}
