#version 300 es

precision highp float;
precision highp int;


out vec4 fragColor;

in vec4 v_position;

uniform vec3 u_light_direction;
uniform vec3 u_camera_position;
uniform float earth_radius;
uniform float atmos_radius;
uniform float atmos_height;
uniform vec3 earth_center;


const float gamma = 2.2;
#define PI 3.1415926535898



vec2 sphere_intersect(in vec3 ro, in vec3 rd, in vec3 ce, float ra) {
    vec3 oc = ro - ce;
    float b = dot(oc, rd);
    float c = dot(oc, oc) - ra*ra;
    float h = b*b - c;
    if (h<0.0) { return vec2(-1.0); }
    h = sqrt(h);
    return vec2(-b-h, -b+h);
}


float density_at_point(in vec3 point) {
    float height = distance(point, earth_center) - earth_radius;
    // float scale_height = atmos_height * 1000.0 / earth_scaling_factor;
    // float scale_height = 8500.0 / earth_scaling_factor;
    float scale_height = 0.10 * atmos_height;
    float density = exp(-height / scale_height);
    // float height01 = height / atmos_height;
    // float falloff = 26.1;
    // float density = exp(-height01 * falloff) * (1.0 - height01);
    return density;
}


float optical_depth(in vec3 ray_origin, in vec3 ray_direction, in float ray_length) {
    int num_of_samples = 10;
    float step = ray_length / float(num_of_samples);
    vec3 current_point = ray_origin + (ray_direction * (step * 0.5));
    float total_depth = 0.0;

    for (int i = 0; i < num_of_samples; i++) {
        float density = density_at_point(current_point);
        total_depth += density * step;
        current_point += ray_direction * step;
    }

    return total_depth;
}


vec3 calc_scatter_light(
    in vec3 ray_origin, in vec3 ray_direction, float ray_length,
    in vec3 light_direction
) {

    vec3 scattering_coefficient = vec3(0.00519673, 0.0121427, 0.0296453);
    int num_of_samples = 10;
    float step = ray_length / float(num_of_samples);
    vec3 current_point = ray_origin + (ray_direction * (step * 0.5));
    vec3 light = vec3(0.0);

    for (int i = 0; i < num_of_samples; i++) {

        float distance_to_sun = sphere_intersect(
            current_point, -light_direction, earth_center, atmos_radius
        ).y;

        float optical_depth_to_sun = optical_depth(
            current_point, -light_direction, distance_to_sun
        );

        float optical_depth_to_camera = optical_depth(
            current_point, -ray_direction, (step * float(i)) + 0.5
        );

        vec3 transmittance = exp(
            scattering_coefficient * -(optical_depth_to_sun + optical_depth_to_camera)
        );

        float density = density_at_point(current_point);

        light += transmittance * density * step;

        current_point += ray_direction * step;
    }

    float cos_theta = dot(-light_direction, normalize(-ray_direction));
    // float phase = (3.0 / (16.0 * PI)) * (1.0 + pow(cos_theta, 2.0));
    float phase = (3.0 / 4.0) * (1.0 + pow(cos_theta, 2.0));

    float sun_intensity = 1.0;

    return sun_intensity * scattering_coefficient * phase * light;
    // return scattering_coefficient * light;
}


void main() {

    vec4 output_color = vec4(0.0, 0.0, 0.0, 0.0);
    vec3 light_direction = normalize(u_light_direction);
    vec3 ray_origin = v_position.xyz;
    vec3 ray_direction = normalize(v_position.xyz - u_camera_position);
    float ray_length = -1.0;

    vec2 intersect_earth = sphere_intersect(
        ray_origin, ray_direction, earth_center, earth_radius
    );

    vec2 intersect_atmos = sphere_intersect(
        ray_origin, ray_direction, earth_center, atmos_radius
    );

    if (intersect_atmos.y >= 0.0) {
        ray_length = intersect_atmos.y - intersect_atmos.x;
        if (intersect_earth.y >= 0.0) {
            ray_length = intersect_earth.x - intersect_atmos.x;
        }
        // output_color.rgb = vec3(0.0, 0.0, (ray_length) / (atmos_radius * 2.0));
    }

    output_color.rgb = calc_scatter_light(
        ray_origin, ray_direction, ray_length, light_direction
    );

    // reinhard hdr tone mapping
    output_color.rgb = output_color.rgb / (output_color.rgb + vec3(1.0));

    // gamma correction
    output_color.rgb = pow(output_color.rgb, vec3(1.0 / gamma));

    fragColor = output_color;

}

