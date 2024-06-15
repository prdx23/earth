#version 300 es

precision highp float;
precision highp int;


in vec4 a_position;

out vec4 v_position;

uniform mat4 u_view_projection_matrix;
uniform mat4 u_matrix;

void main() {
    v_position = u_matrix * a_position;
    gl_Position = u_view_projection_matrix * u_matrix * a_position;
}
