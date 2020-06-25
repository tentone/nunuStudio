"use strict";

/**
 * Render pass is used to render the scene the same way as if were using the renderer directly.
 * 
 * @class RenderPass
 * @extends {Pass}
 * @module Postprocessing
 */
function RenderPass()
{
	Pass.call(this);

	this.type = "Render";
	
	this.clear = true;
}

RenderPass.prototype = Object.create(Pass.prototype);

RenderPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta, maskActive, scene, camera)
{
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
	renderer.render(scene, camera);
};
