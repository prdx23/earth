#version 300 es

precision highp float;
precision highp int;


out vec4 fragColor;
in vec3 v_color;

in vec3 v_normal;
uniform float u_time;
uniform sampler2D u_texture;
uniform sampler2D u_cloud;

#define PI 3.1415926535898

void main() {

// u = atan2(n.x, n.z) / (2*pi) + 0.5;
// v = n.y * 0.5 + 0.5;
    vec2 uv = vec2(
        // atan(v_normal.x, v_normal.z) / (2.0*PI) + 0.5,
        // v_normal.y * -0.5 + 0.5
        (atan(v_normal.x, v_normal.z) / PI + 1.0) / 2.0,
        asin(v_normal.y) / -PI + 0.5
    );

    // fragColor = texture(u_texture, uv);
    // fragColor = texture(u_cloud, uv);

    vec4 earth = texture(u_texture, uv);
    vec4 cloud = texture(u_cloud, vec2(uv.x + fract(u_time * 0.00001), uv.y));
    // cloud.a = cloud.r;
    // cloud.a = 1.0;
    // fragColor = vec4(cloud.r, 0, 0, 1);

    fragColor = mix(earth, cloud, cloud.r);
    // fragColor = (earth * (1.0 - cloud.r)) + (cloud * cloud.r);


    // fragColor = cloud;


    // fragColor = texture(u_texture, uv) * ;

    // fragColor = vec4(v_color, 1);
}

