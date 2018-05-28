"use strict";

function RendererCanvas(parent)
{
	Element.call(this, parent, "canvas");

	this.renderer = null;

	this.createRenderer();
}

RendererCanvas.prototype = Object.create(Element.prototype);

RendererCanvas.prototype.createRenderer = function()
{
	if(Editor.settings.render.followProject)
	{
		var antialiasing = Editor.program.antialiasing;
		var shadows = Editor.program.shadows;
		var shadowsType = Editor.program.shadowsType;
		var toneMapping = Editor.program.toneMapping;
		var toneMappingExposure = Editor.program.toneMappingExposure;
		var toneMappingWhitePoint = Editor.program.toneMappingWhitePoint;
	}
	else
	{
		var antialiasing = Editor.settings.render.antialiasing;
		var shadows = Editor.settings.render.shadows;
		var shadowsType = Editor.settings.render.shadowsType;
		var toneMapping = Editor.settings.render.toneMapping;
		var toneMappingExposure = Editor.settings.render.toneMappingExposure;
		var toneMappingWhitePoint = Editor.settings.render.toneMappingWhitePoint;
	}

	//Dispose old renderer
	if(this.renderer !== null)
	{
		this.renderer.dispose();
	}

	//Create renderer
	this.renderer = new THREE.WebGLRenderer({canvas: this.element, alpha: true, antialias: antialiasing});
	this.renderer.setSize(this.element.width, this.element.height);
	this.renderer.shadowMap.enabled = shadows;
	this.renderer.shadowMap.type = shadowsType;
	this.renderer.toneMapping = toneMapping;
	this.renderer.toneMappingExposure = toneMappingExposure;
	this.renderer.toneMappingWhitePoint = toneMappingWhitePoint;
};

RendererCanvas.prototype.updateInterface = function()
{
	Element.updateInterface.call(this);
	
	this.renderer.setSize(this.size.x, this.size.y);
};
