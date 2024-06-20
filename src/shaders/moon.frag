#version 300 es

precision highp float;
precision highp int;


out vec4 fragColor;

in vec3 v_model_normal;
in vec3 v_matrix_normal;
in vec4 v_position;

uniform sampler2D u_moon_texture;
uniform vec3 u_light_direction;


const float gamma = 2.2;
#define PI 3.1415926535898


void main() {

    vec3 normal = normalize(v_matrix_normal);
    vec3 light_direction = normalize(u_light_direction);


    // sphere normals -> lambert cylindrical
    vec3 model_normal = normalize(v_model_normal);
    vec2 uv = vec2(
        (atan(model_normal.x, model_normal.z) / PI + 1.0) / 2.0,
        asin(model_normal.y) / -PI + 0.5
    );



    // diffuse directional light
    float diffuse_intensity = 1.0;
    float diffuse_light = diffuse_intensity * pow(
        max(0.0, dot(normal, -light_direction)),
        gamma
    );

    // ambient light
    float ambient_light = 0.0001;


    // align near side to earth
    uv = vec2(uv.x + 0.25, uv.y);
    vec3 moon_surface = pow(texture(u_moon_texture, uv).rgb, vec3(gamma));
    moon_surface =
        (moon_surface * diffuse_light) +
        (moon_surface * ambient_light);


    vec4 output_color = vec4(1.0, 0.0, 0.0, 1.0);
    output_color.rgb = moon_surface;


    // reinhard hdr tone mapping
    output_color.rgb = output_color.rgb / (output_color.rgb + vec3(1.0));

    // gamma correction
    output_color.rgb = pow(output_color.rgb, vec3(1.0 / gamma));

    fragColor = output_color;
}

