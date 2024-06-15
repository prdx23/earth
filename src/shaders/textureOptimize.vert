#version 300 es

in vec4 a_position;
in vec2 a_texture_cords;
out vec2 v_texture_cords;

void main() {
    v_texture_cords = a_texture_cords;
    gl_Position = a_position;
}

