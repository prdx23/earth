
import { Vec3, Matrix4, Quaternion } from "../math"



export class Camera {

    position: Vec3
    target: Vec3
    fov: number
    aspect: number
    near: number
    far: number

    _matrix: Matrix4
    _lookAtMatrix: Matrix4
    _projectionMatrix: Matrix4
    _viewProjectionMatrix: Matrix4


    constructor(fov: number, aspect: number, near: number, far: number) {
        this.position = Vec3.zero()
        this.target = Vec3.zero()
        this.fov = fov
        this.aspect = aspect
        this.near = near
        this.far = far
        this._matrix = Matrix4.identity()
        this._lookAtMatrix = Matrix4.identity()
        this._projectionMatrix = Matrix4.identity()
            .perspective(fov, aspect, near, far)
        this._viewProjectionMatrix = Matrix4.identity()
    }


    lookAt(target: Vec3): void {
        this.target.copy(target)
        this._lookAtMatrix
            .identity()
            .lookAt(this.position, target, Vec3.up)
    }


    updateProjectionMatrix(): void {
        this._projectionMatrix.perspective(
            this.fov, this.aspect, this.near, this.far
        )
    }


    viewProjectionMatrix(): Matrix4 {
        this._matrix
            .identity()
            .translate(this.position.x, this.position.y, this.position.z)
            .multiply(this._lookAtMatrix)

        return this._viewProjectionMatrix
            .copy(this._projectionMatrix)
            .multiply(this._matrix.inverse())
    }

}


export class OrbitCamera {

    distance: number
    angle: { x: number, y: number }

    _qh: Quaternion
    _qv: Quaternion
    _matrix: Matrix4


    constructor() {
        this.distance = 0
        this.angle = { x: 0, y: 0 }
        this._qh = Quaternion.identity()
        this._qv = Quaternion.identity()
        this._matrix = Matrix4.identity()
    }


    updateCamera(camera: Camera): void {
        this._qh.setAxisAngle(Vec3.up, this.angle.x * Math.PI / 180)
        this._qv.setAxisAngle(Vec3.right, this.angle.y * Math.PI / 180)

        this._matrix
            .identity()
            .multiply(this._qh.matrix())
            .multiply(this._qv.matrix())
            .translate(0, 0, this.distance)

        camera.position.setTranslationFromMatrix(this._matrix)
        camera.lookAt(camera.target)
    }

}
