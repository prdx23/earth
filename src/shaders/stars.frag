#version 300 es

precision highp float;
precision highp int;

out vec4 fragColor;
in vec3 v_color;

// const float gamma = 2.2;

void main() {

    vec4 output_color = vec4(0.0, 0.0, 0.0, 1.0);
    float color = 1.0 - (distance(gl_PointCoord, vec2(0.5, 0.5)) * 2.0);
    output_color.rgb = v_color * 0.7;
    output_color.a = color;

    // reinhard hdr tone mapping
    // output_color.rgb = output_color.rgb / (output_color.rgb + vec3(1.0));

    // gamma correction
    // output_color.rgb = pow(output_color.rgb, vec3(1.0 / gamma));

    fragColor = output_color;

}
