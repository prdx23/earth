#version 300 es

precision highp float;
precision highp int;


out vec4 fragColor;
in vec3 v_color;

in vec3 v_normal;

uniform float u_time;
uniform sampler2D u_texture;
uniform sampler2D u_cloud;

uniform vec3 u_inverse_light_direction;

#define PI 3.1415926535898


void main() {

    vec3 normal = normalize(v_normal);
    vec3 inverse_light_direction = normalize(u_inverse_light_direction);


    // sphere normals -> lambert cylindrical
    vec2 uv = vec2(
        (atan(normal.x, normal.z) / PI + 1.0) / 2.0,
        asin(normal.y) / -PI + 0.5
    );


    // diffuse directional light
    float light = dot(normal, inverse_light_direction);


    vec4 color = texture(u_texture, uv);
    color.rgb *= light;


    fragColor = color;
}

