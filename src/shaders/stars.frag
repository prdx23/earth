#version 300 es

precision highp float;
precision highp int;

out vec4 fragColor;
in vec4 v_position;

// uniform sampler2D u_stars_colors;
uniform mat4 u_inv_view_projection_matrix;

const float gamma = 2.2;

// The MIT License
// noise() Copyright © 2013 Inigo Quilez
// https://www.shadertoy.com/view/XsXfRH

float hash(ivec3 p) {
    int n = p.x*3 + p.y*113 + p.z*311;
    n = (n << 13) ^ n;
    n = n * (n * n * 15731 + 789221) + 1376312589;
    return -1.0+2.0*float( n & 0x0fffffff)/float(0x0fffffff);
}

// return value noise (in x) and its derivatives (in yzw)
vec4 noise(in vec3 x) {
    ivec3 i = ivec3(floor(x));
    vec3 w = fract(x);
    vec3 u = w*w*(3.0-2.0*w);
    vec3 du = 6.0*w*(1.0-w);
    float a = hash(i+ivec3(0,0,0));
    float b = hash(i+ivec3(1,0,0));
    float c = hash(i+ivec3(0,1,0));
    float d = hash(i+ivec3(1,1,0));
    float e = hash(i+ivec3(0,0,1));
    float f = hash(i+ivec3(1,0,1));
    float g = hash(i+ivec3(0,1,1));
    float h = hash(i+ivec3(1,1,1));
    float k0 =   a;
    float k1 =   b - a;
    float k2 =   c - a;
    float k3 =   e - a;
    float k4 =   a - b - c + d;
    float k5 =   a - c - e + g;
    float k6 =   a - b - e + f;
    float k7 = - a + b + c - d + e - f - g + h;
    return vec4( k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y + k5*u.y*u.z + k6*u.z*u.x + k7*u.x*u.y*u.z,
                 du * vec3( k1 + k4*u.y + k6*u.z + k7*u.y*u.z,
                            k2 + k5*u.z + k4*u.x + k7*u.z*u.x,
                            k3 + k6*u.x + k5*u.y + k7*u.x*u.y ) );
}


void main() {

    vec4 t = u_inv_view_projection_matrix * v_position;
    vec3 view = normalize(t.xyz / t.w);

    vec4 output_color = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 random = noise(view * 2000.0);
    if (random.x > 0.94) {
        output_color.rgb = vec3(random.y * 10.0);
    }

    // reinhard hdr tone mapping
    output_color.rgb = output_color.rgb / (output_color.rgb + vec3(1.0));

    // gamma correction
    output_color.rgb = pow(output_color.rgb, vec3(1.0 / gamma));

    fragColor = output_color;
}
