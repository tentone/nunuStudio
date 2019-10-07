"use strict";

/**
 * A canvas element that also contains a thee.js webgl renderer object.
 *
 * The renderer is automatically updated to match the canvas size, it also handles the device pixel ratio.
 *
 * @class RendererCanvas
 * @extends {Element}
 * @param {Element} parent Parent element.
 * @param {Boolean} alpha If true the background is transparent.
 */
function RendererCanvas(parent, options, useCSSRenderer)
{
	Element.call(this, parent, "div");

	/** 
	 * List os parameters to be passed to the WebGLrenderer.
	 *
	 * @attribute options
	 * @type {Object}
	 */
	this.options = options !== undefined ? options : new RendererConfiguration();

	/**
	 * On resize callback, called every time the container is updated.
	 *
	 * @attribute onResize
	 * @type {Function}
	 */
	this.onResize = null;

	/**
	 * Indicates if a CSS renderer should be created alongside the WebGL renderer.
	 *
	 * @attribute useCSSRenderer
	 * @type {Boolean}
	 */
	this.useCSSRenderer = useCSSRenderer !== undefined ? useCSSRenderer : true;

	/**
	 * CSS renderer used alongside.
	 *
	 * @attribute cssRenderer
	 * @type {CSS3DObject}
	 */
	this.cssRenderer = null;

	/**
	 * Overlay division used to place the css rendered DOM objects.
	 *
	 * @attribute cssDivision
	 * @type {DOM}
	 */
	this.cssDivision = null;

	/**
	 * Rendering resolution accouting for the device pixel ratio.
	 *
	 * @attribute resolution
	 * @type {THREE.Vector2}
	 */
	this.resolution = new THREE.Vector2();

	/**
	 * Method called when the canvas is reset, might need to be used to replace canvas related events.
	 *
	 * Receives the RendererCanvas object as argument.
	 *
	 * @attribute onCanvasReset
	 * @type {Function}
	 */
	this.onCanvasReset = null;

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

	if(this.element.children.length === 0)
	{
		this.element.appendChild(this.canvas);
	}
	else
	{
		this.element.insertBefore(this.canvas, this.element.firstChild);
	}

	if(this.element.contains(this.cssDivision))
	{
		this.element.removeChild(this.cssDivision);
	}

	if(this.useCSSRenderer)
	{
		this.cssDivision = document.createElement("div");
		this.cssDivision.style.position = "absolute";
		this.cssDivision.style.display = "block";
		this.cssDivision.style.top = "0px";
		this.cssDivision.style.left = "0px";
		this.element.appendChild(this.cssDivision);
	}

	this.resizeCanvas();

	if(this.onCanvasReset !== null)
	{
		this.onCanvasReset(this);
	}
};

/**
 * Creates a new threejs WebGL renderer.
 * 
 * The renderer is created with the options specified on the object, always uses the canvas attached to the component.
 *
 * The user has to ensure that the old context was disposed before creating a new renderer.
 * 
 * @method createRenderer
 */
RendererCanvas.prototype.createRenderer = function()
{
	//Create renderer
	this.renderer = this.options.createRenderer(this.canvas);

	//CSS Renderer
	if(this.useCSSRenderer)
	{
		this.cssRenderer = new CSS3DRenderer(this.cssDivision);
	}
};

/**
 * Get blob with data present on this rendering canvas.
 *
 * If the preserveDrawingBuffer is set to false.
 *
 * @method getBlob
 * @param {Function} onLoad Blob load callback.
 * @param {String} encoding Image encoding.
 * @param {Number} quality Quality of the JPEG encoding is used.
 */
RendererCanvas.prototype.getBlob = function(onLoad, encoding, quality)
{
	this.canvas.toBlob(onLoad, encoding !== undefined ? encoding : "image/jpeg", quality !== undefined ? quality : 0.7);
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
	this.resolution.copy(this.size);
	this.resolution.multiplyScalar(window.devicePixelRatio);

	this.canvas.width = this.resolution.x;
	this.canvas.height = this.resolution.y;
	this.canvas.style.width = this.size.x + "px";
	this.canvas.style.height = this.size.y + "px";

	if(this.useCSSRenderer)
	{
		this.cssDivision.style.width = this.size.x + "px";
		this.cssDivision.style.height = this.size.y + "px";
	}

	if(this.onResize !== null)
	{
		this.onResize(this.resolution.x, this.resolution.y);
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

	if(this.renderer !== null)
	{
		this.renderer.setSize(this.size.x, this.size.y, false);
	}

	if(this.useCSSRenderer)
	{
		this.cssRenderer.setSize(this.size.x, this.size.y);
	}
};
