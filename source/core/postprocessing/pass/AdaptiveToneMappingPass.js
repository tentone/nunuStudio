import {Pass} from "../Pass.js";
import {Scene} from "../../objects/Scene.js";
import {Mesh} from "../../objects/mesh/Mesh.js";
import {Form} from "../../../editor/components/Form.js";
import {UniformsUtils, CopyShader, ShaderMaterial, NoBlending, LuminosityShader, ToneMapShader, WebGLRenderTarget, LinearMipMapLinearFilter, LinearFilter, RGBAFormat, MeshBasicMaterial} from "three";
/**
 * Generate a texture that represents the luminosity of the current scene, adapted over time to simulate the optic nerve responding to the amount of light it is receiving.
 *
 * Based on a GDC2007 presentation by Wolfgang Engel titled "Post-Processing Pipeline"
 *
 * Full-screen tone-mapping shader based on http:// www.graphics.cornell.edu/~jaf/publications/sig02_paper.pdf
 *
 * class AdaptiveToneMappingPass
 * @module Postprocessing
 * @author miibond
 */
function AdaptiveToneMappingPass(adaptive, resolution)
{
	Pass.call(this);
	var self = this;
	
	this.type = "AdaptiveToneMapping";
	this.needsInit = true;

	this.resolution = resolution !== undefined ? resolution : 256;
	this._adaptive = adaptive !== undefined ? adaptive : true;

	this.luminanceRT = null;
	this.previousLuminanceRT = null;
	this.currentLuminanceRT = null;

	this.copyUniforms = UniformsUtils.clone(CopyShader.uniforms);
	this.materialCopy = new ShaderMaterial(
	{
		uniforms: this.copyUniforms,
		vertexShader: CopyShader.vertexShader,
		fragmentShader: CopyShader.fragmentShader,
		blending: NoBlending,
		depthTest: false
	});

	this.materialLuminance = new ShaderMaterial(
	{
		uniforms: UniformsUtils.clone(LuminosityShader.uniforms),
		vertexShader: LuminosityShader.vertexShader,
		fragmentShader: LuminosityShader.fragmentShader,
		blending: NoBlending
	});

	this.createShader();

	if(ToneMapShader === undefined)
	{
		console.error("nunuStudio: AdaptiveToneMappingPass relies on ToneMapShader");
	}

	this.materialToneMap = new ShaderMaterial(
	{
		uniforms: UniformsUtils.clone(ToneMapShader.uniforms),
		vertexShader: ToneMapShader.vertexShader,
		fragmentShader: ToneMapShader.fragmentShader,
		blending: NoBlending
	});

	this.createQuadScene();

	Object.defineProperties(this,
	{
		/**
		 * Minimum luminance.
		 *
		 * @property minLuminance
		 * @type {number}
		 */
		minLuminance:
		{
			get: function(){return self.adaptLuminanceShader.uniforms["minLuminance"].value;},
			set: function(value){self.adaptLuminanceShader.uniforms["minLuminance"].value = value;}
		},

		/**
		 * Rate of luminance variation (adaptation rate).
		 *
		 * @property tau
		 * @type {number}
		 */
		tau:
		{
			get: function(){return self.adaptLuminanceShader.uniforms["tau"].value;},
			set: function(value){self.adaptLuminanceShader.uniforms["tau"].value = value;}
		},

		/**
		 * Rate of luminance variation (adaptation rate).
		 *
		 * @property tau
		 * @type {number}
		 */
		adaptive:
		{
			get: function(){return self._adaptive;},
			set: function(adaptive)
			{
				if(adaptive)
				{
					this._adaptive = true;
					this.materialToneMap.defines["ADAPTED_LUMINANCE"] = "";
					this.materialToneMap.uniforms.luminanceMap.value = this.luminanceRT.texture;
				}
				else
				{
					this._adaptive = false;
					delete this.materialToneMap.defines["ADAPTED_LUMINANCE"];
					this.materialToneMap.uniforms.luminanceMap.value = null;
				}

				this.materialToneMap.needsUpdate = true;
			}
		}
	});
};

AdaptiveToneMappingPass.prototype = Object.create(Pass.prototype);

AdaptiveToneMappingPass.prototype.constructor = AdaptiveToneMappingPass;

AdaptiveToneMappingPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta, maskActive)
{
	if(this.needsInit)
	{
		this.reset();

		this.luminanceRT.texture.type = readBuffer.texture.type;
		this.previousLuminanceRT.texture.type = readBuffer.texture.type;
		this.currentLuminanceRT.texture.type = readBuffer.texture.type;
		this.needsInit = false;
	}

	if(this._adaptive)
	{
		// Render the luminance of the current scene into a render target with mipmapping enabled
		this.quad.material = this.materialLuminance;
		this.materialLuminance.uniforms.tDiffuse.value = readBuffer.texture;
		renderer.setRenderTarget(this.currentLuminanceRT);
		renderer.render(this.scene, this.camera);

		// Use the new luminance values, the previous luminance and the frame delta to adapt the luminance over time.
		this.quad.material = this.materialAdaptiveLum;
		this.materialAdaptiveLum.uniforms.delta.value = delta;
		this.materialAdaptiveLum.uniforms.lastLum.value = this.previousLuminanceRT.texture;
		this.materialAdaptiveLum.uniforms.currentLum.value = this.currentLuminanceRT.texture;
		renderer.setRenderTarget(this.luminanceRT);
		renderer.render(this.scene, this.camera);

		// Copy the new adapted luminance value so that it can be used by the next frame.
		this.quad.material = this.materialCopy;
		this.copyUniforms.tDiffuse.value = this.luminanceRT.texture;
		renderer.setRenderTarget(this.previousLuminanceRT);
		renderer.render(this.scene, this.camera);
	}

	this.quad.material = this.materialToneMap;
	this.materialToneMap.uniforms.tDiffuse.value = readBuffer.texture;

	if(this.clear)
	{
		renderer.autoClear = true;
		renderer.autoClearColor = true;
		renderer.autoClearDepth = true;
		renderer.autoClearStencil = true;
	}
	else
	{
		renderer.autoClear = false;
	}

	renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
	renderer.render(this.scene, this.camera);
};

AdaptiveToneMappingPass.prototype.createShader = function()
{
	this.adaptLuminanceShader =
	{
		defines:
		{
			MIP_LEVEL_1X1 : (Math.log(this.resolution) / Math.log(2.0)).toFixed(1)
		},
		uniforms:
		{
			lastLum: {value: null},
			currentLum: {value: null},
			minLuminance: {value: 0.01},
			delta: {value: 0.016},
			tau: {value: 1.0}
		},
		vertexShader:
		"varying vec2 vUv;\n\
		void main(){\n\
		\n\
			vUv = uv;\n\
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\
		\n\
		}",
		fragmentShader:
		"varying vec2 vUv;\n\
		\n\
		uniform sampler2D lastLum;\n\
		uniform sampler2D currentLum;\n\
		uniform float minLuminance;\n\
		uniform float delta;\n\
		uniform float tau;\n\
		\n\
		void main()\n\
		{\n\
			vec4 lastLum = texture2D(lastLum, vUv, MIP_LEVEL_1X1);\n\
			vec4 currentLum = texture2D(currentLum, vUv, MIP_LEVEL_1X1);\n\
			\n\
			float fLastLum = max(minLuminance, lastLum.r);\n\
			float fCurrentLum = max(minLuminance, currentLum.r);\n\
			\n\
			// The adaption seems to work better in extreme lighting differences if the input luminance is squared.\
			fCurrentLum *= fCurrentLum;\n\
			\n\
			// Adapt the luminance using Pattanaik's technique\
			float fAdaptedLum = fLastLum + (fCurrentLum - fLastLum) * (1.0 - exp(-delta * tau));\n\
			gl_FragColor.r = fAdaptedLum;\n\
		}",
	};

	this.materialAdaptiveLum = new ShaderMaterial(
	{
		uniforms: UniformsUtils.clone(this.adaptLuminanceShader.uniforms),
		vertexShader: this.adaptLuminanceShader.vertexShader,
		fragmentShader: this.adaptLuminanceShader.fragmentShader,
		defines: this.adaptLuminanceShader.defines,
		blending: NoBlending
	});
};

AdaptiveToneMappingPass.prototype.reset = function()
{
	// Render targets
	if(this.luminanceRT)
	{
		this.luminanceRT.dispose();
	}
	if(this.currentLuminanceRT)
	{
		this.currentLuminanceRT.dispose();
	}
	if(this.previousLuminanceRT)
	{
		this.previousLuminanceRT.dispose();
	}

	this.luminanceRT = new WebGLRenderTarget(this.resolution, this.resolution, Pass.RGBALinear);
	this.luminanceRT.texture.generateMipmaps = false;

	this.previousLuminanceRT = new WebGLRenderTarget(this.resolution, this.resolution, Pass.RGBALinear);
	this.previousLuminanceRT.texture.generateMipmaps = false;

	// We only need mipmapping for the current luminosity because we want a down-sampled version to sample in our adaptive shader
	this.currentLuminanceRT = new WebGLRenderTarget(this.resolution, this.resolution,
	{
		minFilter: LinearMipMapLinearFilter,
		magFilter: LinearFilter,
		format: RGBAFormat
	});

	if(this._adaptive)
	{
		this.materialToneMap.defines["ADAPTED_LUMINANCE"] = "";
		this.materialToneMap.uniforms.luminanceMap.value = this.luminanceRT.texture;
	}

	// Put something in the adaptive luminance texture so that the scene can render initially
	this.quad.material = new MeshBasicMaterial({color: 0x777777});
	this.materialLuminance.needsUpdate = true;
	this.materialAdaptiveLum.needsUpdate = true;
	this.materialToneMap.needsUpdate = true;
};

AdaptiveToneMappingPass.prototype.dispose = function()
{
	if(this.luminanceRT)
	{
		this.luminanceRT.dispose();
	}
	if(this.previousLuminanceRT)
	{
		this.previousLuminanceRT.dispose();
	}
	if(this.currentLuminanceRT)
	{
		this.currentLuminanceRT.dispose();
	}
	if(this.materialLuminance)
	{
		this.materialLuminance.dispose();
	}
	if(this.materialAdaptiveLum)
	{
		this.materialAdaptiveLum.dispose();
	}
	if(this.materialCopy)
	{
		this.materialCopy.dispose();
	}
	if(this.materialToneMap)
	{
		this.materialToneMap.dispose();
	}
};

AdaptiveToneMappingPass.prototype.toJSON = function(meta)
{
	var data = Pass.prototype.toJSON.call(this, meta);

	data.minLuminance = this.minLuminance;
	data.tau = this.tau;
	data.adaptive = this._adaptive;

	return data;
};
export {AdaptiveToneMappingPass};