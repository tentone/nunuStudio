/*
 * Shader object used to render single channel MSDF data.
 *
 * Contains only the fragment shader code, the vertex is the same for every render mode.
 * 
 * Details about Multi‐Channel Signed Distance Fields for vetorial shapes rendering.
 *    - https:// onlinelibrary.wiley.com/doi/full/10.1111/cgf.13265
 */

varying vec2 vUv;
uniform sampler2D map;
uniform vec3 color;
uniform float smoothing;
uniform float threshold;

float median(float r, float g, float b)
{
	return max(min(r, g), min(max(r, g), b));
}

void main()
{
	vec3 smpl = texture2D(map, vUv).rgb;
	float sigDist = median(smpl.r, smpl.g, smpl.b) - 0.5;
	float alpha = clamp(sigDist / fwidth(sigDist) + 0.5, 0.0, 1.0);
	gl_FragColor = vec4(color, 1.0 - alpha);
}
