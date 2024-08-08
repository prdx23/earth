
import { Vec3, Matrix4, Quaternion } from "../math"
import { keys, mouse } from "./keys"



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

    static angleSpeed = 0.5
    static dragSpeed = 0.1
    static yLimitLower = -89
    static yLimitUpper = 89
    static zoomLimitLower = -4 * Math.PI / 180
    static zoomLimitUpper = 60 * Math.PI / 180

    distance: number
    angle:  { x: number, y: number }
    offset: { x: number, y: number }
    fovDelta: number

    _qh: Quaternion
    _qv: Quaternion
    _matrix: Matrix4


    constructor() {
        this.distance = 0
        this.angle = { x: 0, y: 0 }
        this.offset = { x: 0, y: 0 }
        this.fovDelta = 0
        this._qh = Quaternion.identity()
        this._qv = Quaternion.identity()
        this._matrix = Matrix4.identity()
    }


    handleInput(camera: Camera): void {

        if (keys.any) {

            if (keys.zoomIn && camera.fov + this.fovDelta > OrbitCamera.zoomLimitLower) {
                this.fovDelta -= 0.005
            }

            if (keys.zoomOut && camera.fov + this.fovDelta < OrbitCamera.zoomLimitUpper) {
                this.fovDelta += 0.005
            }

            if (keys.left) {
                this.angle.x -= OrbitCamera.angleSpeed
            }

            if (keys.right) {
                this.angle.x += OrbitCamera.angleSpeed
            }

            if (keys.up && this.angle.y > OrbitCamera.yLimitLower) {
                this.angle.y -= OrbitCamera.angleSpeed
            }

            if (keys.down && this.angle.y < OrbitCamera.yLimitUpper) {
                this.angle.y += OrbitCamera.angleSpeed
            }

            this.updateCamera(camera)
        }

        if (mouse.dragging) {

            this.offset.x = mouse.offsetX * OrbitCamera.dragSpeed

            const newY = this.angle.y + mouse.offsetY * OrbitCamera.dragSpeed
            if (newY > OrbitCamera.yLimitLower && newY < OrbitCamera.yLimitUpper) {
                this.offset.y = mouse.offsetY * OrbitCamera.dragSpeed
            }

            this.updateCamera(camera)
        }

        if (mouse.zoom != 0) {
            const delta = mouse.zoom * 0.0001
            if (
                camera.fov + this.fovDelta + delta > OrbitCamera.zoomLimitLower &&
                camera.fov + this.fovDelta + delta < OrbitCamera.zoomLimitUpper
            ) {
                this.fovDelta += delta
                mouse.zoom = 0
                this.updateCamera(camera)
            }
        }

        if (mouse.finalize) {
            this.angle.x += this.offset.x
            this.angle.y += this.offset.y
            this.offset.x = 0
            this.offset.y = 0
            mouse.finalize = false
            this.updateCamera(camera)
        }
    }


    updateCamera(camera: Camera): void {
        const angleX = (this.angle.x + this.offset.x) * Math.PI / 180
        const angleY = (this.angle.y + this.offset.y) * Math.PI / 180
        this._qh.setAxisAngle(Vec3.up, angleX)
        this._qv.setAxisAngle(Vec3.right, angleY)

        this._matrix
            .identity()
            .multiply(this._qh.matrix())
            .multiply(this._qv.matrix())
            .translate(0, 0, this.distance)

        camera.position.setTranslationFromMatrix(this._matrix)
        camera.lookAt(camera.target)
    }

}
