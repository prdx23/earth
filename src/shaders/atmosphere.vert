#version 300 es

precision highp float;
precision highp int;


in vec4 a_position;
in vec3 a_color;
out vec3 v_color;
out vec3 v_model_normal;
out vec3 v_matrix_normal;
out vec4 v_position;


// uniform mat4 u_view_matrix;
// uniform mat4 u_projection_matrix;
uniform mat4 u_view_projection_matrix;
uniform mat4 u_matrix;


// temp uniforms
const float earth_diameter = 1274.2 / 2.0;
const float atmos_height = 80.0;
out vec4 v_center;


void main() {
    // add height for atmosphere
    vec4 position = a_position;
    position.xyz += position.xyz * vec3(atmos_height / earth_diameter);

    v_color = a_color;
    v_model_normal = position.xyz;
    v_matrix_normal = mat3(u_matrix) * position.xyz;
    v_position = u_matrix * position;

    v_center = vec4(0,0,0,1); // planet center temp


    // gl_Position = u_projection_matrix * u_view_matrix * u_matrix * position;
    gl_Position = u_view_projection_matrix * u_matrix * position;
}
