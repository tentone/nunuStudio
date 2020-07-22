import {Vector2} from "three";

/**
 * Screen-space ambient occlusion shader
 *    - http:// devlog-martinsh.blogspot.com (assembled by Martins Upitis)
 *    - http:// www.gamedev.net/topic/550699-ssao-no-halo-artifacts/ (original technique is made by ArKano22)
 *
 * Modified to use RGBA packed depth texture (use clear color 1,1,1,1 for depth pass)
 *
 * @static
 * @class SSAOShader
 * @author alteredq / http:// alteredqualia.com/
 */
var SSAOShader =
{
	uniforms:
	{
		tDiffuse: {value: null},
		tDepth: {value: null},
		size: {value: new Vector2(512, 512)},
		cameraNear: {value: 1},
		cameraFar: {value: 100},
		radius: {value: 32},
		onlyAO: {value: 0},
		aoClamp: {value: 0.25},
		lumInfluence: {value: 0.7}
	},

	vertexShader: "\n\
	varying vec2 vUv;\n\
	void main()\n\
	{\n\
		vUv = uv;\n\
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\
	}",

	fragmentShader: "\n\
	uniform float cameraNear;\n\
	uniform float cameraFar;\n\
\n\
	#ifdef USE_LOGDEPTHBUF\n\
		uniform float logDepthBufFC;\n\
	#endif\n\
\n\
	uniform float radius; // ao radius \n\
	uniform bool onlyAO; // use only ambient occlusion pass?\n\
\n\
	uniform vec2 size; // texture width, height\n\
	uniform float aoClamp; // depth clamp - reduces haloing at screen edges\n\
\n\
	uniform float lumInfluence; // how much luminance affects occlusion\n\
\n\
	uniform sampler2D tDiffuse;\n\
	uniform sampler2D tDepth;\n\
\n\
	varying vec2 vUv;\n\
\n\
	#define DL 2.399963229728653 // PI *(3.0 - sqrt(5.0))\n\
	#define EULER 2.718281828459045\n\
\n\
	// user variables\n\
	const int samples = 64; // ao sample count\n\
	const bool useNoise = true; // use noise instead of pattern for sample dithering\n\
	const float noiseAmount = 0.0004; // dithering amount\n\
	const float diffArea = 0.4; // self-shadowing reduction\n\
	const float gDisplace = 0.4; // gauss bell center\n\
\n\
	// RGBA depth\n\
	#include <packing>\n\
\n\
	// generating noise / pattern texture for dithering\n\
	vec2 rand(const vec2 coord)\n\
	{\n\
		vec2 noise;\n\
\n\
		if(useNoise)\n\
		{\n\
			float nx = dot(coord, vec2(12.9898, 78.233));\n\
			float ny = dot(coord, vec2(12.9898, 78.233) * 2.0);\n\
			noise = clamp(fract(43758.5453 * sin(vec2(nx, ny))), 0.0, 1.0);\n\
		}\n\
		else\n\
		{\n\
			float ff = fract(1.0 - coord.s *(size.x / 2.0));\n\
			float gg = fract(coord.t *(size.y / 2.0));\n\
			noise = vec2(0.25, 0.75) * vec2(ff) + vec2(0.75, 0.25) * gg;\n\
		}\n\
\n\
		return(noise * 2.0  - 1.0) * noiseAmount;\n\
	}\n\
\n\
	float readDepth(const in vec2 coord) {\n\
\n\
		float cameraFarPlusNear = cameraFar + cameraNear;\n\
		float cameraFarMinusNear = cameraFar - cameraNear;\n\
		float cameraCoef = 2.0 * cameraNear;\n\
\n\
		#ifdef USE_LOGDEPTHBUF\n\
			float logz = unpackRGBAToDepth(texture2D(tDepth, coord));\n\
			float w = pow(2.0, (logz / logDepthBufFC)) - 1.0;\n\
			float z = (logz / w) + 1.0;\n\
		#else\n\
			float z = unpackRGBAToDepth(texture2D(tDepth, coord));\n\
		#endif\n\
\n\
		return cameraCoef /(cameraFarPlusNear - z * cameraFarMinusNear);\n\
	}\n\
\n\
	float compareDepths(const in float depth1, const in float depth2, inout int far)\n\
	{\n\
		float garea = 8.0; // gauss bell width\n\
		float diff =(depth1 - depth2) * 100.0; // depth difference (0-100)\n\
\n\
		// reduce left bell width to avoid self-shadowing\n\
		if(diff < gDisplace)\n\
		{\n\
			garea = diffArea;\n\
\n\
		}\n\
		else\n\
		{\n\
			far = 1;\n\
		}\n\
\n\
		float dd = diff - gDisplace;\n\
		float gauss = pow(EULER, -2.0 *(dd * dd) /(garea * garea));\n\
		return gauss;\n\
	}\n\
\n\
	float calcAO(float depth, float dw, float dh)\n\
	{\n\
		vec2 vv = vec2(dw, dh);\n\
		vec2 coord1 = vUv + radius * vv;\n\
		vec2 coord2 = vUv - radius * vv;\n\
\n\
		float temp1 = 0.0;\n\
		float temp2 = 0.0;\n\
\n\
		int far = 0;\n\
		temp1 = compareDepths(depth, readDepth(coord1), far);\n\
\n\
		// DEPTH EXTRAPOLATION\n\
		if(far > 0)\n\
		{\n\
			temp2 = compareDepths(readDepth(coord2), depth, far);\n\
			temp1 +=(1.0 - temp1) * temp2;\n\
		}\n\
\n\
		return temp1;\n\
	}\n\
\n\
	void main()\n\
	{\n\
		vec2 noise = rand(vUv);\n\
		float depth = readDepth(vUv);\n\
\n\
		float tt = clamp(depth, aoClamp, 1.0);\n\
\n\
		float w =(1.0 / size.x) / tt +(noise.x *(1.0 - noise.x));\n\
		float h =(1.0 / size.y) / tt +(noise.y *(1.0 - noise.y));\n\
\n\
		float ao = 0.0;\n\
\n\
		float dz = 1.0 / float(samples);\n\
		float l = 0.0;\n\
		float z = 1.0 - dz / 2.0;\n\
\n\
		for(int i = 0; i <= samples; i ++)\n\
		{\n\
			float r = sqrt(1.0 - z);\n\
\n\
			float pw = cos(l) * r;\n\
			float ph = sin(l) * r;\n\
			ao += calcAO(depth, pw * w, ph * h);\n\
			z = z - dz;\n\
			l = l + DL;\n\
		}\n\
\n\
		ao /= float(samples);\n\
		ao = 1.0 - ao;\n\
\n\
		vec3 color = texture2D(tDiffuse, vUv).rgb;\n\
\n\
		vec3 lumcoeff = vec3(0.299, 0.587, 0.114);\n\
		float lum = dot(color.rgb, lumcoeff);\n\
		vec3 luminance = vec3(lum);\n\
\n\
		vec3 final = vec3(color * mix(vec3(ao), vec3(1.0), luminance * lumInfluence)); // mix(color * ao, white, luminance)\n\
\n\
		if(onlyAO)\n\
		{\n\
			final = vec3(mix(vec3(ao), vec3(1.0), luminance * lumInfluence)); // ambient occlusion only\n\
		}\n\
\n\
		gl_FragColor = vec4(final, 1.0);\n\
	}"
};

export {SSAOShader};