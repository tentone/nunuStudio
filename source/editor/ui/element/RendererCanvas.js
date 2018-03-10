"use strict";

function RendererCanvas(parent)
{
	Canvas.call(this, parent, "canvas");

	this.renderer = new THREE.WebGLRenderer({canvas: this.element, antialias: Settings.render.antialiasing});
	this.renderer.shadowMap.enabled = false;
}

RendererCanvas.prototype = Object.create(Canvas.prototype);

RendererCanvas.prototype.updateInterface = function()
{
	Canvas.updateInterface.call(this);
	
	this.renderer.setSize(this.size.x, this.size.y);
};
