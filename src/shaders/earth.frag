#version 300 es

precision highp float;
precision highp int;


out vec4 fragColor;

in vec3 v_color;
in vec3 v_normal;
in vec4 v_position;

uniform float u_time;
uniform sampler2D u_land_texture;
uniform sampler2D u_water_texture;
uniform sampler2D u_nightlights_texture;
uniform vec3 u_light_direction;
uniform vec3 u_camera_position;

const float gamma = 2.2;
#define PI 3.1415926535898


void main() {

    vec3 normal = normalize(v_normal);
    vec3 light_direction = normalize(u_light_direction);
    // vec3 light_direction = normalize(v_position.xyz - -u_light_direction);


    // sphere normals -> lambert cylindrical
    vec2 uv = vec2(
        (atan(normal.x, normal.z) / PI + 1.0) / 2.0,
        asin(normal.y) / -PI + 0.5
    );


    vec4 water_texture = texture(u_water_texture, uv);
    float is_water = clamp(
        ceil(water_texture.r + water_texture.g + water_texture.b), 0.0, 1.0
    );


    // diffuse directional light
    float diffuse_intensity = 1.0;
    float diffuse_light = diffuse_intensity * max(
        0.0, dot(normal, -light_direction)
    );


    // specular highlights
    float shininess = 256.0;
    float specular_intensity = 5.0;
    vec3 view_direction = normalize(u_camera_position - v_position.xyz);
    vec3 half_dir = normalize(-light_direction + view_direction);
    float specular_light = pow(max(0.0, dot(normal, half_dir)), shininess);
    // specular_light *= specular_intensity;
    specular_light *= specular_intensity * ceil(diffuse_light);
    specular_light *= is_water;


    // ambient light
    float ambient_light = 0.001;


    vec4 earth_surface = vec4(pow(texture(u_land_texture, uv).rgb, vec3(gamma)), 1.0);
    // vec4 earth_surface = texture(u_water_texture, uv);
    // vec4 earth_surface = vec4(0.0, 1.0, 1.0, 1.0);
    // earth_surface.rgb *= diffuse_light;
    // earth_surface.rgb *= specular_light;
    // earth_surface.rgb *= ambient_light;

    earth_surface.rgb =
        (earth_surface.rgb * diffuse_light) +
        (earth_surface.rgb * specular_light) +
        (earth_surface.rgb * ambient_light);


    float sun_facing = clamp(-1.0 * dot(
        normal, normalize(v_position.xyz - (u_light_direction * 2.0))
    ), 0.0, 1.0);
    vec3 night_lights = texture(u_nightlights_texture, uv).rgb;
    night_lights = night_lights * vec3(0.6, 0.5, 0.4) * vec3(0.3);


    // vec4 output_color = vec4(earth_surface.rgb, 1.0);
    vec4 output_color = vec4(
        mix(
            earth_surface.rgb,
            night_lights.rgb,
            sun_facing
        ),
        1.0
    );

    // reinhard hdr tone mapping
    output_color.rgb = output_color.rgb / (output_color.rgb + vec3(1.0));

    // gamma correction
    output_color.rgb = pow(output_color.rgb, vec3(1.0 / gamma));

    fragColor = output_color;
}

