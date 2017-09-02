"use strict";

/**
 * The effect composer is used to organize multiple post-processing passes.
 *
 * It is used by camera objects to organize the rendering pipeline.
 * 
 * @class EffectComposer
 * @module Postprocessing
 * @constructor
 */
function EffectComposer()
{
	if(THREE.CopyShader === undefined)
	{
		console.error("EffectComposer relies on THREE.CopyShader");
	}
	if(THREE.ShaderPass === undefined)
	{
		console.error("EffectComposer relies on THREE.ShaderPass");
	}

	this.width = 1;
	this.height = 1;

	this.renderTarget1 = new THREE.WebGLRenderTarget(this.width, this.height,
	{
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBAFormat,
		stencilBuffer: false
	});
	this.renderTarget2 = this.renderTarget1.clone();

	this.writeBuffer = this.renderTarget1;
	this.readBuffer = this.renderTarget2;

	this.passes = [];
	this.copyPass = new THREE.ShaderPass(THREE.CopyShader);
}

/**
 * Swap rendering buffers.
 *
 * @method swapBuffers
 */
EffectComposer.prototype.swapBuffers = function()
{
	var tmp = this.readBuffer;
	this.readBuffer = this.writeBuffer;
	this.writeBuffer = tmp;
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
	var length = this.passes.length;

	for(var i = 0; i < length; i++)
	{
		var pass = this.passes[i];

		if(pass.enabled === false)
		{
			continue;
		}

		pass.render(renderer, this.writeBuffer, this.readBuffer, delta, maskActive, scene, camera);

		if(pass.needsSwap)
		{
			if(maskActive)
			{
				var context = renderer.context;
				context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff);

				this.copyPass.render(renderer, this.writeBuffer, this.readBuffer, delta);
				context.stencilFunc(context.EQUAL, 1, 0xffffffff);
			}

			this.swapBuffers();
		}

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
	this.width = width;
	this.height = height;

	this.renderTarget1.setSize(width, height);
	this.renderTarget2.setSize(width, height);

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
	var renderTarget = this.renderTarget1.clone();

	this.dispose();

	this.renderTarget1 == new THREE.WebGLRenderTarget(this.width, this.height,
	{
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBAFormat,
		stencilBuffer: false
	});
	this.renderTarget2 = this.renderTarget1.clone();

	this.writeBuffer = this.renderTarget1;
	this.readBuffer = this.renderTarget2;
};

/**
 * Dispose this effect composer.
 * 
 * @method dispose
 */
EffectComposer.prototype.dispose = function()
{
	this.renderTarget1.dispose();
	this.renderTarget2.dispose();

	this.renderTarget1 = null;
	this.renderTarget2 = null;
	this.writeBuffer = null;
	this.readBuffer = null;
};
