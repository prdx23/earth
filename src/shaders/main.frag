#version 300 es


precision highp float;
out vec4 fragColor;
in vec3 v_color;

void main() {
    fragColor = vec4(v_color, 1);
}

