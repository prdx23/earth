#version 300 es

precision highp float;
precision highp int;

in vec4 a_position;
in float a_size;
in vec3 a_color;
out vec3 v_color;

uniform mat4 u_view_projection_matrix;

void main() {
    v_color = a_color;
    gl_Position = u_view_projection_matrix * a_position;
    gl_PointSize = a_size;
}
