import {ShaderChunk} from "three";
import ParticleShaderVertex from "./chunks/particle_vertex.glsl";
import ParticleShaderVertexFunctions from "./chunks/particle_vertex_functions.glsl"; 
import ParticleShaderDefines from "./chunks/particle_defines.glsl";
import ParticleShaderUniforms from "./chunks/particle_uniforms.glsl";
import ParticleShaderAttributes from "./chunks/particle_attributes.glsl";
import ParticleShaderVaryings from "./chunks/particle_varyings.glsl";
import ParticleShaderBranchAvoiding from "./chunks/particle_branch_avoiding.glsl";
import ParticleShaderRotateTexture from "./chunks/particle_rotate_texture.glsl";

var ParticleShaders =
{
	vertex:
	[
		ParticleShaderDefines,
		ParticleShaderUniforms,
		ParticleShaderAttributes,
		ParticleShaderVaryings,

		ShaderChunk.common,
		ShaderChunk.logdepthbuf_pars_vertex,
		ShaderChunk.fog_pars_vertex,

		ParticleShaderBranchAvoiding,
		ParticleShaderVertexFunctions,
		
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

		ParticleShaderVaryings,
		ParticleShaderBranchAvoiding,

		"void main() {",
		"    vec3 outgoingLight = vColor.xyz;",
		"    ",
		"    #ifdef ALPHATEST",
		"       if(vColor.w < float(ALPHATEST)) discard;",
		"    #endif",

		ParticleShaderRotateTexture,
		ShaderChunk.logdepthbuf_fragment,

		"    outgoingLight = vColor.xyz * rotatedTexture.xyz;",
		"    gl_FragColor = vec4(outgoingLight.xyz, rotatedTexture.w * vColor.w);",

		ShaderChunk.fog_fragment,
		"}"
	].join("\n")
};

export {ParticleShaders};
