#version 300 es


in vec2 a_position;
in vec3 a_color;
uniform vec2 u_resolution;
out vec3 v_color;

void main() {
    v_color = a_color;
    vec2 clipspace = ((a_position / u_resolution) * 2.0) - 1.0;
    gl_Position = vec4(clipspace * vec2(1, -1), 0, 1);
}
