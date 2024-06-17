#version 300 es

precision highp float;
precision highp int;


out vec4 fragColor;

in vec3 v_scatter_light;
in vec4 v_position;

uniform vec3 u_light_direction;
uniform vec3 u_camera_position;

const float gamma = 2.2;
#define PI 3.1415926535898


void main() {

    vec3 light_direction = normalize(u_light_direction);
    vec3 ray_direction = normalize(v_position.xyz - u_camera_position);

    float cos_theta = dot(-light_direction, normalize(-ray_direction));
    float phase = (3.0 / 4.0) * (1.0 + pow(cos_theta, 2.0));
    float sun_intensity = 1.0;

    vec3 scatter_light = sun_intensity * phase * v_scatter_light;
    vec4 output_color = vec4(scatter_light, 1.0);

    // reinhard hdr tone mapping
    output_color.rgb = output_color.rgb / (output_color.rgb + vec3(1.0));

    // gamma correction
    output_color.rgb = pow(output_color.rgb, vec3(1.0 / gamma));

    fragColor = output_color;

}

