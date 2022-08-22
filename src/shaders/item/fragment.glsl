uniform float time;
varying vec2 vUv;
uniform sampler2D textr;
uniform float u_lerpValue;

void main()	{
    vec4 color = texture2D(textr, vUv);
    color.a *= u_lerpValue;
    gl_FragColor = color;
}