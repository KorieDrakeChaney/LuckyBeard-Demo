uniform float time;
varying vec2 vUv;
varying vec3 vNormal;
void main()	{
    vUv = uv;
    vNormal = normal;
    vec3 transformed = vec3(position);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.);
}