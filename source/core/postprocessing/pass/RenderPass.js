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
}

RenderPass.prototype = Object.create(Pass.prototype);

RenderPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta, maskActive, scene, camera)
{
	if(this.clear === true)
	{
		renderer.clear();
	}
	
	renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
	renderer.render(scene, camera);
};
