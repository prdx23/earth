#version 300 es

precision highp float;
precision highp int;


out vec4 fragColor;
in vec3 v_color;

in vec3 v_normal;

uniform float u_time;
uniform sampler2D u_land_texture;
uniform sampler2D u_water_texture;

uniform vec3 u_light_direction;
uniform vec3 u_view_direction;

#define PI 3.1415926535898


void main() {

    vec3 normal = normalize(v_normal);
    vec3 light_direction = normalize(u_light_direction);
    vec3 view_direction = normalize(u_view_direction);


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
    float diffuse_light = diffuse_intensity * clamp(
        dot(normal, -light_direction), 0.0, 1.0
    );


    // specular highlights
    float shininess = 64.0;
    float specular_intensity = 1.0;
    float specular_light = pow(clamp(
        dot(view_direction, reflect(-light_direction, normal)), 0.0, 1.0
    ), shininess);
    specular_light *= specular_intensity * is_water;
    // specular_light *= specular_intensity * ceil(diffuse_light);


    // ambient light
    float ambient_light = 0.05;


    vec4 color = texture(u_land_texture, uv);
    // vec4 color = texture(u_water_texture, uv);
    // vec4 color = vec4(0.0, 1.0, 1.0, 1.0);
    // color.rgb *= diffuse_light;
    // color.rgb *= specular_light;
    // color.rgb *= ambient_light;

    color.rgb =
        (color.rgb * diffuse_light) +
        (color.rgb * specular_light) +
        (color.rgb * ambient_light);


    fragColor = color;
}

