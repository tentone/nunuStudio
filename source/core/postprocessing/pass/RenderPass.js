"use strict";

function RenderPass()
{
	Pass.call(this);

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
