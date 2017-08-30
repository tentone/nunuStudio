"use strict";

function EffectComposer(renderer, renderTarget)
{
	this.renderer = renderer;

	if(renderTarget === undefined)
	{
		var parameters = {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			format: THREE.RGBAFormat,
			stencilBuffer: false
		};

		var size = renderer.getSize();
		renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, parameters);
	}

	this.renderTarget1 = renderTarget;
	this.renderTarget2 = renderTarget.clone();

	this.writeBuffer = this.renderTarget1;
	this.readBuffer = this.renderTarget2;

	this.passes = [];

	//Chck dependencies
	if(THREE.CopyShader === undefined)
	{
		console.error("EffectComposer relies on THREE.CopyShader");
	}
	if(THREE.ShaderPass === undefined)
	{
		console.error("EffectComposer relies on THREE.ShaderPass");
	}

	this.copyPass = new THREE.ShaderPass(THREE.CopyShader);
}

EffectComposer.prototype.swapBuffers = function()
{
	var tmp = this.readBuffer;
	this.readBuffer = this.writeBuffer;
	this.writeBuffer = tmp;
};

EffectComposer.prototype.addPass = function(pass)
{
	this.passes.push(pass);

	//var size = this.renderer.getSize();
	//pass.setSize(size.width, size.height);
};

EffectComposer.prototype.insertPass = function(pass, index)
{
	this.passes.splice(index, 0, pass);
};

EffectComposer.prototype.render = function(delta)
{
	var maskActive = false;
	var pass;
	var length = this.passes.length;

	for(var i = 0; i < length; i++)
	{
		pass = this.passes[i];

		if(pass.enabled === false)
		{
			continue;
		}

		pass.render(this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive);

		if(pass.needsSwap)
		{
			if(maskActive)
			{
				var context = this.renderer.context;
				context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff);

				this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, delta);
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

EffectComposer.prototype.reset = function(renderTarget)
{
	if(renderTarget === undefined)
	{
		var size = this.renderer.getSize();

		renderTarget = this.renderTarget1.clone();
		renderTarget.setSize(size.width, size.height);
	}

	this.renderTarget1.dispose();
	this.renderTarget2.dispose();
	this.renderTarget1 = renderTarget;
	this.renderTarget2 = renderTarget.clone();

	this.writeBuffer = this.renderTarget1;
	this.readBuffer = this.renderTarget2;
};

EffectComposer.prototype.setSize = function(width, height)
{
	this.renderTarget1.setSize(width, height);
	this.renderTarget2.setSize(width, height);

	for(var i = 0; i < this.passes.length; i++)
	{
		this.passes[i].setSize(width, height);
	}
};
