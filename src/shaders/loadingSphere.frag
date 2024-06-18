#version 300 es

precision highp float;
precision highp int;


out vec4 fragColor;
in vec3 v_position;


void main() {
    fragColor = vec4(mix(
        vec3(249.0 / 255.0, 107.0 / 255.0, 136.0 / 255.0),
        vec3(111.0 / 255.0, 176.0 / 255.0, 255.0 / 255.0),
        (v_position.y + 1.0) * 0.5
    ), 1.0);
}

