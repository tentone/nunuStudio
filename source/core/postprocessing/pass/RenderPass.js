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
	this.needsSwap = false;
}

RenderPass.prototype = Object.create(Pass.prototype);

RenderPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta, maskActive, scene, camera)
{
	if(this.renderToScreen)
	{
		renderer.render(scene, camera);
	}
	else
	{
		renderer.render(scene, camera, readBuffer);
	}
};
