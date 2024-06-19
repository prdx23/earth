#version 300 es

precision highp float;
precision highp int;


out vec4 fragColor;

in vec3 v_model_normal;
in vec3 v_matrix_normal;
in vec4 v_position;

uniform sampler2D u_earth_texture;
uniform sampler2D u_data_texture;
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


    vec3 data = texture(u_data_texture, uv).rgb;


    // diffuse directional light
    float diffuse_intensity = 1.0;
    float diffuse_light = diffuse_intensity * max(
        0.0,
        // stylized exponential dropoff
        pow(dot(normal, -light_direction), gamma)
        // dot(normal, -light_direction)
    );



    // specular highlights
    float specular_brightness = data.r;
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



    vec3 earth_surface = pow(texture(u_earth_texture, uv).rgb, vec3(gamma));
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
    vec3 clouds = vec3(data.g);
    float is_clouds = data.g;
    vec3 earth = mix(
        earth_surface,
        (clouds * diffuse_light) + (clouds * ambient_light),
        is_clouds
    );

    float nightlights_intensity = 0.4;
    vec3 nightlights_colortone = vec3(0.6, 0.5, 0.4);
    vec3 nightlights_texture = vec3(data.b);
    nightlights_texture *= nightlights_colortone * nightlights_intensity;

    float nightlight_dropoff = clamp(
        pow(dot(normal, light_direction), gamma),
        0.0, 1.0
    );
    vec3 nightlights = mix(
        nightlights_texture,
        clouds * 0.003,
        is_clouds
    ) * nightlight_dropoff;

    float sun_facing = ceil(max(0.0, dot(normal, -light_direction)));
    vec4 output_color = vec4(0.0, 0.0, 1.0, 1.0);

    if (sun_facing == 1.0) {
        output_color.rgb = earth;
    } else {
        output_color.rgb = nightlights;
    }

    // output_color.rgb = vec3(0.0);

    // reinhard hdr tone mapping
    output_color.rgb = output_color.rgb / (output_color.rgb + vec3(1.0));

    // gamma correction
    output_color.rgb = pow(output_color.rgb, vec3(1.0 / gamma));

    fragColor = output_color;
}

