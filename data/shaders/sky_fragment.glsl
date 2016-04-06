uniform vec3 top_color;
uniform vec3 bottom_color;
uniform float offset;
uniform float exponent;

varying vec3 vWorldPosition;

void main()
{
	float h = normalize(vWorldPosition + offset).y;
	gl_FragColor = vec4(mix(bottom_color, top_color, max(pow(max(h , 0.0), exponent), 0.0)), 1.0);
}