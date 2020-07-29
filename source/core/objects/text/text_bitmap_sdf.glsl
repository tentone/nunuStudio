/**
 * Shader object used to render single channel SDF data.
 *
 * Contains only the fragment shader code, the vertex is the same for every render mode.
 * 
 * Details about signed distance fields for vetorial shapes rendering.
 *    - https:// steamcdn-a.akamaihd.net/apps/valve/2007/SIGGRAPH2007_AlphaTestedMagnification.pdf
 */
varying vec2 vUv;
uniform sampler2D map;
uniform vec3 color;
uniform float smoothing;
uniform float threshold;

void main()
{
	float distance = texture2D(map, vUv).a;
	float alpha = smoothstep(threshold - smoothing, threshold + smoothing, distance);
	gl_FragColor = vec4(color, alpha);
}