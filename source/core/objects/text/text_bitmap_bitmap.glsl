/**
 * Shader object used to render the bitmap directly without any processing.
 *
 * Contains only the fragment shader code, the vertex is the same for every render mode.
 */
varying vec2 vUv;
uniform sampler2D map;

void main()
{
	gl_FragColor = texture2D(map, vUv);
}
