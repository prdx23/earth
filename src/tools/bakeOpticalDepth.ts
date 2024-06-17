
import { Vec3 } from '../math';
import { Atmosphere } from '../objects/atmosphere'
import { Earth } from '../objects/earth'



function sphere_intersect(ro: Vec3, rd: Vec3, ce: Vec3, ra: number) {
    const oc = Vec3.zero().copy(ro).subtract(ce)
    const b = oc.dot(rd)
    const c = oc.dot(oc) - (ra * ra)
    let h = (b * b) - c
    if (h < 0.0) { return new Vec3(-1.0, -1.0, 0.0) }
    h = Math.sqrt(h)
    return new Vec3(-b - h, -b + h, 0.0)
}



function calcOpticalDepth(x: number, y: number): number {

    const atmos_height = Atmosphere.height
    const earth_radius = Earth.radius
    const atmos_radius = earth_radius + atmos_height
    const earth_center = Earth.center

    const cos_theta = (x * 2.0) - 1.0
    const height = y * atmos_height

    const ray_origin = new Vec3(0, earth_radius + height, 0)
    const ray_direction = new Vec3(
        1 - (cos_theta * cos_theta), cos_theta, 0
    )
    ray_direction.normalize()

    const ray_length = sphere_intersect(
        ray_origin, ray_direction, earth_center, atmos_radius
    ).y


    // const inc = sphere_intersect(
    //     ray_origin, ray_direction, earth_center, earth_radius
    // )
    // if (inc.y >= 0.0) {
    //     ray_length = inc.x
    // }

    const num_of_samples = 64
    const step = ray_length / num_of_samples
    const current_point = Vec3.zero()
        .copy(ray_origin)
        .add(Vec3.scale(ray_direction, step * 0.5))

    let total_depth = 0
    const scale_height = 0.1 * atmos_height

    for (let i = 0; i < num_of_samples; i++) {

        const h = (
            Vec3.subtract(current_point, earth_center).length()
        ) - earth_radius

        // if (h < 0) {
        //     break
        // }

        const density = Math.exp((-h) / scale_height)
        total_depth += density * step
        current_point.add(Vec3.scale(ray_direction, step))
    }

    return total_depth
}



export function generateOpticalDepthTable(size: number) {

    const data = new Float32Array(size * size)

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            data[(y * size) + x] = calcOpticalDepth(x / size, y / size)
        }
    }

    return data

}
