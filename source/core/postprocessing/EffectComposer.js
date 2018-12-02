"use strict";

/**
 * The effect composer is used to organize multiple post-processing passes.
 *
 * It is used by camera objects to organize the rendering pipeline.
 * 
 * @class EffectComposer
 * @module Postprocessing
 */
function EffectComposer()
{
	if(THREE.CopyShader === undefined)
	{
		console.error("EffectComposer relies on THREE.CopyShader");
	}

	this.uuid = THREE.Math.generateUUID();
	this.width = 1;
	this.height = 1;

	/**
	 * Passes attached to this effect composer.
	 *
	 * The passes are rendered in order.
	 *
	 * @property passes
	 * @type {Array}
	 */
	this.passes = [];

	/**
	 * Input buffer passed to the render pass.
	 *
	 * @property writeBuffer
	 * @type {THREE.WebGLRenderTarget}
	 */
	this.writeBuffer = new THREE.WebGLRenderTarget(this.width, this.height, EffectComposer.bufferParameters);

	/**
	 * Input buffer passed to the render pass.
	 *
	 * @property readBuffer
	 * @type {THREE.WebGLRenderTarget}
	 */
	this.readBuffer = new THREE.WebGLRenderTarget(this.width, this.height, EffectComposer.bufferParameters);

	/**
	 * Copy shader used to copy data between the read and write buffer or to copy the writeBuffer to screen when necessary.
	 *
	 * @property copyPass
	 * @type {ShaderPass}
	 */
	this.copyPass = new ShaderPass(THREE.CopyShader);
}

EffectComposer.bufferParameters =
{
	minFilter: THREE.LinearFilter,
	magFilter: THREE.LinearFilter,
	format: THREE.RGBAFormat,
	stencilBuffer: false
};

/**
 * Swap rendering buffers.
 *
 * Used to make the output buffer of a render pass the input of the next one.
 * 
 * @method swapBuffers
 */
EffectComposer.prototype.swapBuffers = function()
{
	var temp = this.readBuffer;
	this.readBuffer = this.writeBuffer;
	this.writeBuffer = temp;
};

/**
 * Add new pass to the composer.
 * 
 * @method addPass
 * @param {Pass} pass Rendering pass to be added.
 */
EffectComposer.prototype.addPass = function(pass)
{
	this.passes.push(pass);
};

/**
 * Move pass back in the list of render passes.
 *
 * Moving back means that the pass is rendered earlier in the pipeline.
 * 
 * @method moveBack
 * @param {Pass} pass Pass to be moved.
 * @return {Boolean} Returns true on success, false otherwise.
 */
EffectComposer.prototype.moveBack = function(pass)
{
	var index = this.passes.indexOf(pass);

	if(index > 0)
	{
		for(var k = index; k !== index - 1 ; k -= 1)
		{
			this.passes[k] = this.passes[k - 1];
		}
		this.passes[index - 1] = pass;

		return true;
	}

	return false;
};

/**
 * Move pass forward in the list of render passes.
 *
 * Moving forward in the list means being renderer later down the pipeline.
 * 
 * @method moveForward
 * @param {Pass} pass Pass to be moved.
 * @return {Boolean} Returns true on success, false otherwise.
 */
EffectComposer.prototype.moveForward = function(pass)
{
	var index = this.passes.indexOf(pass);

	if(index !== -1 && index < this.passes.length - 1)
	{
		for(var k = index; k !== index + 1 ; k += 1)
		{
			this.passes[k] = this.passes[k + 1];
		}
		this.passes[index + 1] = pass;

		return true;
	}

	return false;
};

/**
 * Remove pass from this composer, if pass is not found nothing happens.
 *
 * @method removePass
 * @param {Pass} pass Pass to be removed from the composer.
 */
EffectComposer.prototype.removePass = function(pass)
{
	var index = this.passes.indexOf(pass);
	if(index !== -1)
	{
		this.passes.splice(index, 1);
	}
};

/**
 * Insert new pass into the composer in a specific position.
 *
 * @method insertPass
 * @param {Pass} pass Rendering pass to be added.
 * @param {Number} index Index to be inserted on.
 */
EffectComposer.prototype.insertPass = function(pass, index)
{
	this.passes.splice(index, 0, pass);
};

/**
 * Render a scene using this effect composer and a renderer.
 *
 * @method render
 * @param {WebGLRenderer} renderer Render to be used to render the scene.
 * @param {Scene} scene Scene to render.
 * @param {[type]} delta Delta time. 
 */
EffectComposer.prototype.render = function(renderer, scene, camera, delta)
{
	var maskActive = false;

	//Store renderer configuration
	var autoClear = renderer.autoClear;
	var autoClearColor = renderer.autoClearColor;
	var autoClearStencil = renderer.autoClearStencil;
	var autoClearDepth = renderer.autoClearDepth;
	renderer.autoClear = false;
	renderer.autoClearColor = true;
	renderer.autoClearStencil = true;
	renderer.autoClearDepth = true;

	//Render passes
	for(var i = 0; i < this.passes.length; i++)
	{
		var pass = this.passes[i];

		//Render pass if its enabled
		if(pass.enabled === true)
		{
			pass.render(renderer, this.writeBuffer, this.readBuffer, delta, maskActive, scene, camera);

			//If rendered to screen stop here
			if(pass.renderToScreen)
			{
				//Copy writeBuffer to screen
				if(pass.copyToScreen)
				{
					this.copyPass.renderToScreen = true;
					this.copyPass.render(renderer, this.readBuffer, this.writeBuffer, delta);
				}

				break;
			}

			//Swap read and write buffers
			if(pass.needsSwap)
			{
				if(maskActive)
				{
					renderer.context.stencilFunc(renderer.context.NOTEQUAL, 1, 0xffffffff);
					this.copyPass.renderToScreen = false;
					this.copyPass.render(renderer, this.writeBuffer, this.readBuffer, delta);
					renderer.context.stencilFunc(renderer.context.EQUAL, 1, 0xffffffff);
				}

				this.swapBuffers();
			}

			//Check mask passes
			if(THREE.MaskPass !== undefined)
			{
				if(pass instanceof THREE.MaskPass)
				{
					maskActive = true;
				}
				else if(pass instanceof THREE.ClearMaskPass)
				{
					maskActive = false;
				}
			}
		}
	}

	//Restore renderer configuration
	renderer.autoClear = autoClear;
	renderer.autoClearColor = autoClearColor;
	renderer.autoClearStencil = autoClearStencil;
	renderer.autoClearDepth = autoClearDepth;
};

/**
 * Set rendering size for the composer.
 *
 * Also updates the size for all passes attached to the composer.
 *
 * @method setSize
 * @param {Number} width Width.
 * @param {Number} height Height.
 */
EffectComposer.prototype.setSize = function(width, height)
{
	width = Math.floor(width);
	height = Math.floor(height);

	this.width = width;
	this.height = height;

	this.writeBuffer.setSize(width, height);
	this.readBuffer.setSize(width, height);

	for(var i = 0; i < this.passes.length; i++)
	{
		this.passes[i].setSize(width, height);
	}
};

/**
 * Reset this effect composer.
 *
 * @method reset
 */
EffectComposer.prototype.reset = function()
{
	this.dispose();

	this.writeBuffer = new THREE.WebGLRenderTarget(this.width, this.height, EffectComposer.bufferParameters);

	this.readBuffer = new THREE.WebGLRenderTarget(this.width, this.height, EffectComposer.bufferParameters);
};

/**
 * Dispose this effect composer.
 * 
 * @method dispose
 */
EffectComposer.prototype.dispose = function()
{
	this.writeBuffer.dispose();
	this.readBuffer.dispose();

	this.writeBuffer = null;
	this.readBuffer = null;
};

/**
 * Serialize this effect composer to JSON.
 *
 * @method toJSON
 */
EffectComposer.prototype.toJSON = function()
{
	var data = {};

	data.uuid = this.uuid;
	data.passes = [];
	
	for(var i = 0; i < this.passes.length; i++)
	{
		data.passes.push(this.passes[i].toJSON());
	}

	return data;
};

/**
 * Create a new effect composer loaded from json data.
 * 
 * @static
 * @method fromJSON
 * @param {Object} json JSON data to load.
 * @return {EffectComposer} Composer loaded from data.
 */
EffectComposer.fromJSON = function(json)
{
	var composer = new EffectComposer();
	composer.uuid = json.uuid;

	for(var i = 0; i < json.passes.length; i++)
	{	
		var data = json.passes[i];
		var pass = null;

		if(data.type === "Render")
		{
			pass = new RenderPass();
		}
		else if(data.type === "UnrealBloom")
		{
			pass = new UnrealBloomPass();
			pass.strength = data.strength;
			pass.radius = data.radius;
			pass.threshold = data.threshold;
			pass.bloomFactors = data.bloomFactors;

			for(var i = 0; i < pass.bloomTintColors.length; i++)
			{
				pass.bloomTintColors[i].fromArray(data.bloomTintColors[i]);
			}
		}
		else if(data.type === "Bloom")
		{
			pass = new BloomPass(data.strength, data.kernelSize, data.sigma, data.resolution);
		}
		else if(data.type === "SSAO")
		{
			pass = new SSAOPass();
			pass.kernelRadius = data.kernelRadius;
			pass.minDistance = data.minDistance;
			pass.maxDistance = data.maxDistance;
		}
		else if(data.type === "SSAOLegacy")
		{
			pass = new SSAOPass();
			pass.onlyAO = data.onlyAO;
			pass.radius = data.radius;
			pass.aoClamp = data.aoClamp;
			pass.lumInfluence = data.lumInfluence;
		}
		else if(data.type === "Bokeh")
		{
			pass = new BokehPass(data.focus, data.aperture, data.maxblur);
		}
		else if(data.type === "FXAA")
		{
			pass = new FXAAPass();
		}
		else if(data.type === "Copy")
		{
			pass = new CopyPass();
		}
		else if(data.type === "Film")
		{
			pass = new FilmPass();
			pass.grayscale = data.grayscale;
			pass.noiseIntensity = data.noiseIntensity;
			pass.scanlinesIntensity = data.scanlinesIntensity;
			pass.scanlinesCount = data.scanlinesCount;
		}
		else if(data.type === "DotScreen")
		{
			pass = new DotScreenPass();
			pass.center.fromArray(data.center);
			pass.angle = data.angle;
			pass.scale = data.scale;
		}
		else if(data.type === "Colorify")
		{
			pass = new ColorifyPass();
			pass.color.setHex(data.color);
		}
		else if(data.type === "Sobel")
		{
			pass = new SobelPass();
		}
		else if(data.type === "Technicolor")
		{
			pass = new TechnicolorPass();
		}
		else if(data.type === "HueSaturation")
		{
			pass = new HueSaturationPass();
			pass.hue = data.hue;
			pass.saturation = data.saturation;
		}
		else
		{
			pass = new RenderPass();
		}

		pass.uuid = data.uuid;
		pass.enabled = data.enabled;
		pass.needsSwap = data.needsSwap;
		pass.renderToScreen = data.renderToScreen;
		pass.clear = data.clear;

		composer.addPass(pass);
	}
	
	return composer;
};