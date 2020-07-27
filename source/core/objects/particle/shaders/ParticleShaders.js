import {ParticleShaderChunks} from "./ParticleShaderChunks.js";
import {ShaderChunk} from "three";
import ParticleShaderVertex from "./particle_vertex.glsl";
import ParticleShaderDefines from "./chunks/particle_defines.glsl";
import ParticleShaderUniforms from "./chunks/particle_uniforms.glsl";
var ParticleShaders =
{
	vertex:
	[
		ParticleShaderDefines,
		ParticleShaderUniforms,
		ParticleShaderChunks.attributes,
		ParticleShaderChunks.varyings,

		ShaderChunk.common,
		ShaderChunk.logdepthbuf_pars_vertex,
		ShaderChunk.fog_pars_vertex,

		ParticleShaderChunks.branchAvoidanceFunctions,
		ParticleShaderChunks.unpackColor,
		ParticleShaderChunks.unpackRotationAxis,
		ParticleShaderChunks.floatOverLifetime,
		ParticleShaderChunks.colorOverLifetime,
		ParticleShaderChunks.paramFetchingFunctions,
		ParticleShaderChunks.forceFetchingFunctions,
		ParticleShaderChunks.rotationFunctions,

		"void main() {", 
		
		ParticleShaderVertex,

		ShaderChunk.logdepthbuf_vertex,
		ShaderChunk.fog_vertex,

		"}"
	].join("\n"),

	fragment:
	[
		ParticleShaderUniforms,

		ShaderChunk.common,
		ShaderChunk.fog_pars_fragment,
		ShaderChunk.logdepthbuf_pars_fragment,

		ParticleShaderChunks.varyings,

		ParticleShaderChunks.branchAvoidanceFunctions,

		"void main() {",
		"    vec3 outgoingLight = vColor.xyz;",
		"    ",
		"    #ifdef ALPHATEST",
		"       if(vColor.w < float(ALPHATEST)) discard;",
		"    #endif",

		ParticleShaderChunks.rotateTexture,

		ShaderChunk.logdepthbuf_fragment,

		"    outgoingLight = vColor.xyz * rotatedTexture.xyz;",
		"    gl_FragColor = vec4(outgoingLight.xyz, rotatedTexture.w * vColor.w);",

		ShaderChunk.fog_fragment,

		"}"
	].join("\n")
};

export {ParticleShaders};