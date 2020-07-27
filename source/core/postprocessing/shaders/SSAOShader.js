import {Vector2} from "three";
import SSAOShaderFragment from "./ssao_fragment.glsl";
import SSAOShaderVertex from "./ssao_vertex.glsl";

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

	vertexShader: SSAOShaderVertex,

	fragmentShader: SSAOShaderFragment
};

export {SSAOShader};