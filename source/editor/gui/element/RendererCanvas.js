"use strict";

/**
 * A canvas element that also contains a thee.js webgl renderer object.
 *
 * The renderer is automatically updated to match the canvas size, it also handles the device pixel ratio.
 *
 * @class RendererCanvas
 * @extends {Element}
 * @param {DOM} parent Parent element.
 * @param {Boolean} alpha If true the background is transparent.
 */
function RendererCanvas(parent, alpha)
{
	Element.call(this, parent, "div");

	/**
	 * Indicated if the background of the canvas is transparent or not.
	 *
	 * @attribute alpha
	 * @type {Boolean}
	 */
	this.alpha = alpha !== undefined ? alpha : false;

	/**
	 * On resize callback, called every time the container is updated.
	 *
	 * @attribute onResize
	 * @type {Function}
	 */
	this.onResize = null;

	/**
	 * Canvas DOM element.
	 * 
	 * @attribute canvas
	 * @type {DOM}
	 */
	this.canvas = null;
	this.resetCanvas();

	/**
	 * three.js WebGl renderer.
	 *
	 * @attribute renderer
	 * @type {THREE.WebGlRenderer}
	 */
	this.renderer = null;
	this.createRenderer();
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
	this.canvas.style.position = "absolute";
	this.canvas.style.display = "block";
	this.canvas.style.top = "0px";
	this.canvas.style.left = "0px";
	this.element.appendChild(this.canvas);

	this.resizeCanvas();
};

/**
 * Create WebGl renderer.
 * 
 * @method createRenderer
 */
RendererCanvas.prototype.createRenderer = function()
{
	var settings = Editor.settings.render.followProject ? Editor.program : Editor.settings.render;
	var config = this.configuration;

	//var context = this.canvas.getContext("webgl2");
	var context = null;

	this.renderer = new THREE.WebGLRenderer(
	{
		canvas: this.canvas,
		context: context,
		precision: "highp",
		alpha: this.alpha,
		premultipliedAlpha: true,
		antialias: settings.antialiasing,
		preserveDrawingBuffer: false,
		powerPreference: "high-performance",
		logarithmicDepthBuffer: false
	});

	this.renderer.shadowMap.enabled = settings.shadows;
	this.renderer.shadowMap.type = settings.shadowsType;
	this.renderer.shadowMap.autoUpdate = true;
	this.renderer.shadowMap.needsUpdate = false;

	this.renderer.toneMapping = settings.toneMapping;
	this.renderer.toneMappingExposure = settings.toneMappingExposure;
	this.renderer.toneMappingWhitePoint = settings.toneMappingWhitePoint;

	this.renderer.autoClear = false;
	this.renderer.autoClearColor = false;
	this.renderer.autoClearDepth = false;
	this.renderer.autoClearStencil = false;

	this.renderer.sortObjects = true;

	this.renderer.gammaFactor = 2;
	this.renderer.gammaInput = false;
	this.renderer.gammaOutput = false;
};

/**
 * Create a new fresh context for this renderer.
 *
 * Deletes the canvas and creates a new one.
 *
 * This may be usefull to change some configurations in the renderer.
 * 
 * @method reloadContext
 */
RendererCanvas.prototype.reloadContext = function()
{
	this.forceContextLoss();
	this.resetCanvas();
	this.createRenderer();
	this.updateSize();
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
		if(this.renderer !== null)
		{
			this.renderer.dispose();
			this.renderer.forceContextLoss();
			this.renderer = null;
		}
	}
	catch(e)
	{
		this.renderer = null;
		console.log("nunuStudio: Failed to destroy WebGL context.");
	}
}

/**
 * Resize the canvas to match the parent size and conside the device pixel ratio.
 *
 * @method resizeCanvas
 */
RendererCanvas.prototype.resizeCanvas = function()
{
	var width = this.size.x * window.devicePixelRatio;
	var height = this.size.y * window.devicePixelRatio;

	this.canvas.width = width;
	this.canvas.height = height;
	this.canvas.style.width = this.size.x + "px";
	this.canvas.style.height = this.size.y + "px";

	if(this.onResize !== null)
	{
		this.onResize(width, height);
	}
};

RendererCanvas.prototype.destroy = function()
{
	Element.prototype.destroy.call(this);

	this.forceContextLoss();
};

RendererCanvas.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

	this.resizeCanvas();
	
	this.renderer.setSize(this.size.x, this.size.y, false);
};
