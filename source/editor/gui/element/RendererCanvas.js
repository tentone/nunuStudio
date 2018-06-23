"use strict";

/**
 * A canvas element that also contains a thee.js webgl renderer object.
 *
 * The renderer is automatically updated to match the canvas size, it also handles the device pixel ratio.
 * 
 * @class RendererCanvas
 * @extends {Element}
 */
function RendererCanvas(parent)
{
	Element.call(this, parent, "div");

	/**
	 * Canvas DOM element.
	 * 
	 * @attribute canvas
	 * @type {DOM}
	 */
	this.resetCanvas();

	/**
	 * three.js WebGl renderer.
	 *
	 * @attribute renderer
	 * @type {THREE.WebGlRenderer}
	 */
	this.createRenderer();

	/**
	 * On resize callback, called every time the container is updated.
	 *
	 * @attribute onResize
	 */
	this.onResize = null;
}

RendererCanvas.prototype = Object.create(Element.prototype);

/**
 * Set on resize callback, can be usefull to update cameras and other screen space dependent objects.
 * 
 * The callback receives the width and height of the rendering canvas.
 * 
 * @method setOnResize
 * @param {Function} callback
 */
RendererCanvas.prototype.setOnResize = function(callback)
{
	this.onResize = callback;
};

/**
 * Reset the canvas DOM element.
 * 
 * Removes the current canvas and creates a new one.
 * 
 * @method resetCanvas
 */
RendererCanvas.prototype.resetCanvas = function()
{
	if(this.element.contains(this.canvas))
	{
		this.element.removeChild(this.canvas);
	}

	this.canvas = document.createElement("canvas");
	this.canvas.style.top = "0px";
	this.canvas.style.left = "0px";
	this.canvas.style.width = "100%";
	this.canvas.style.height = "100%";
	this.element.appendChild(this.canvas);
};

/**
 * Create WebGl renderer.
 * 
 * @method createRenderer
 */
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

	this.renderer = new THREE.WebGLRenderer(
	{
		canvas: this.canvas,
		context: null,
		precision: "highp",
		alpha: true,
		premultipliedAlpha: true,
		antialias: antialiasing,
		preserveDrawingBuffer: false,
		powerPreference: "high-performance",
		logarithmicDepthBuffer: false
	});
	this.renderer.setSize(this.element.width, this.element.height);
	this.renderer.shadowMap.enabled = shadows;
	this.renderer.shadowMap.type = shadowsType;
	this.renderer.toneMapping = toneMapping;
	this.renderer.toneMappingExposure = toneMappingExposure;
	this.renderer.toneMappingWhitePoint = toneMappingWhitePoint;
	this.renderer.autoClear = false;
	this.renderer.sortObjects = true;
};

/**
 * Create a new context for this renderer, this may be usefull to change some configurations in the renderer.
 * 
 * @method createNewContext
 */
RendererCanvas.prototype.createNewContext = function()
{
	this.forceContextLoss();
	this.resetCanvas();
	this.createRenderer();
};

/**
 * Force the current renderer to loose context.
 * 
 * This is achieved by using the WEBGL_lose_context extension and may not be supported by all browsers.
 * 
 * @method forceContextLoss
 */
RendererCanvas.prototype.forceContextLoss = function()
{
	try
	{
		this.renderer.dispose();
		this.renderer.forceContextLoss();
	}
	catch(e){}
}

RendererCanvas.prototype.destroy = function()
{
	Element.prototype.destroy.call(this);

	this.forceContextLoss();
};

RendererCanvas.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

	var width = this.size.x * window.devicePixelRatio;
	var height = this.size.y * window.devicePixelRatio;
	
	this.canvas.width = width;
	this.canvas.height = height;
	this.renderer.setSize(this.size.x, this.size.y, false);

	if(this.onResize !== null)
	{
		this.onResize(width, height);
	}
};
