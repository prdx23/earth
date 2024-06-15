#version 300 es

precision highp float;
precision highp int;

out vec4 fragColor;
in vec2 v_texture_cords;

uniform sampler2D u_water_texture;
uniform sampler2D u_clouds_texture;
uniform sampler2D u_nightlights_texture;


void main() {

    vec4 output_color = vec4(1.0, 0.0, 0.0, 1.0);

    vec4 water = texture(u_water_texture, v_texture_cords);
    output_color.r = (water.r + water.g + water.b) / 3.0;

    vec4 clouds = texture(u_clouds_texture, v_texture_cords);
    output_color.g = (clouds.r + clouds.g + clouds.b) / 3.0;

    vec4 lights = texture(u_nightlights_texture, v_texture_cords);
    output_color.b = (lights.r + lights.g + lights.b) / 3.0;

    // if (!(output_color.r == output_color.g && output_color.g == output_color.b)) {
    //     output_color.rgb = vec3(1.0, 0.0, 0.0);
    // }

    fragColor = output_color;
}

