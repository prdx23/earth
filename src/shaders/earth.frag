#version 300 es

precision highp float;
precision highp int;


out vec4 fragColor;

in vec3 v_model_normal;
in vec3 v_matrix_normal;
in vec4 v_position;

uniform float u_time;
uniform sampler2D u_land_texture;
uniform sampler2D u_water_texture;
uniform sampler2D u_nightlights_texture;
uniform sampler2D u_clouds_texture;
uniform vec3 u_light_direction;
uniform vec3 u_camera_position;


const float gamma = 2.2;
#define PI 3.1415926535898


void main() {

    vec3 normal = normalize(v_matrix_normal);
    vec3 light_direction = normalize(u_light_direction);
    // vec3 light_direction = normalize(v_position.xyz - -u_light_direction);


    // sphere normals -> lambert cylindrical
    vec3 model_normal = normalize(v_model_normal);
    vec2 uv = vec2(
        (atan(model_normal.x, model_normal.z) / PI + 1.0) / 2.0,
        asin(model_normal.y) / -PI + 0.5
    );


    // diffuse directional light
    float diffuse_intensity = 1.0;
    float diffuse_light = diffuse_intensity * max(
        0.0,
        // stylized exponential dropoff
        pow(dot(normal, -light_direction), gamma)
        // dot(normal, -light_direction)
    );



    // specular highlights
    vec4 water = texture(u_water_texture, uv);
    float specular_brightness = (water.r + water.g + water.b) / 3.0;
    float shininess = 128.0;
    float specular_intensity = 8.0;
    vec3 view_direction = normalize(u_camera_position - v_position.xyz);
    vec3 half_dir = normalize(-light_direction + view_direction);
    float specular_light = pow(max(0.0, dot(normal, half_dir)), shininess);
    // specular_light *= specular_intensity;
    specular_light *= specular_intensity * ceil(diffuse_light);
    specular_light *= specular_brightness;


    // ambient light
    float ambient_light = 0.0001;



    vec3 earth_surface = pow(texture(u_land_texture, uv).rgb, vec3(gamma));
    // if (specular_brightness > 0.0) {
    //     earth_surface.rgb = vec3(
    //         (earth_surface.r + earth_surface.g + earth_surface.b) / 3.0
    //     );
    // }
    earth_surface =
        (earth_surface * diffuse_light) +
        (earth_surface * specular_light) +
        (earth_surface * ambient_light);


    // vec3 clouds = pow(texture(u_clouds_texture, uv).rgb, vec3(gamma));
    vec3 clouds = texture(u_clouds_texture, uv).rgb;
    float is_clouds = (clouds.r + clouds.g + clouds.b) / 3.0;

    vec3 earth = mix(
        earth_surface,
        (clouds.rgb * diffuse_light) + (clouds.rgb * ambient_light),
        is_clouds
    );


    float sun_facing = clamp(pow(dot(normal, light_direction), 3.0), 0.0, 1.0);
    vec3 night_lights_texture = texture(u_nightlights_texture, uv).rgb;
    night_lights_texture *= vec3(0.6, 0.5, 0.4) * vec3(0.4);

    vec3 night_lights = mix(
        night_lights_texture,
        clouds.rgb * 0.003,
        is_clouds
    );

    // vec4 output_color = vec4(earth_surface.rgb, 1.0);
    vec4 output_color = vec4(
        mix(
            earth,
            night_lights,
            sun_facing
        ),
        1.0
    );

    // output_color.rgb = vec3(0.0);

    // reinhard hdr tone mapping
    output_color.rgb = output_color.rgb / (output_color.rgb + vec3(1.0));

    // gamma correction
    output_color.rgb = pow(output_color.rgb, vec3(1.0 / gamma));

    fragColor = output_color;
}

