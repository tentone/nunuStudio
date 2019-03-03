"use strict";

/** 
 * Renderer configuration stores all the WebGL renderer related parameters.
 *
 * @class RendererConfiguration
 */
function RendererConfiguration()
{
	/**
	 * Prefered backend to use if available.
	 *
	 * If the selected backend is not available it defaults to WebGL.
	 *
	 * @property backend
	 * @type {Number}
	 */
	this.backend = RendererConfiguration.WEBGL;

	/**
	 * Antialiasing flag.
	 *
	 * @property antialiasing
	 * @type {boolean}
	 * @default false
	 */
	this.antialiasing = true;

	/**
	 * If true the program is rendered with shadows.
	 *
	 * @property shadows
	 * @type {boolean}
	 * @default true
	 */
	this.shadows = true;

	/** 
	 * Whether the drawing buffer has a stencil buffer of at least 8 bits.
	 *
	 * @property @stencil
	 * @type {boolean}
	 */
	this.stencil = true;

	/**
	 * Shadow map filtering type.
	 *
	 * @property shadowsType
	 * @type {Number}
	 * @default PCFSoftShadowMap
	 */
	this.shadowsType = THREE.PCFSoftShadowMap;

	/** 
	 * Enables automatic updates to the shadows in the scene.
	 *
	 * If you do not require dynamic lighting / shadows, you may set this to false.
	 *
	 * @property shadowsAutoUpdate
	 * @type {Boolean}
	 */
	this.shadowsAutoUpdate = true;

	/**
	 * Tone mapping mode.
	 *
	 * @property toneMapping
	 * @type {Number}
	 * @default THREE.NoToneMapping
	 */
	this.toneMapping = THREE.NoToneMapping;

	/**
	 * Exposure level of tone mapping.
	 *
	 * @property toneMappingExposure
	 * @type {Number}
	 */
	this.toneMappingExposure = 1.0;

	/**
	 * Tone mapping white point.
	 *
	 * @property toneMappingWhitePoint
	 * @type {Number}
	 */
	this.toneMappingWhitePoint = 1.0;

	/** 
	 * If true the renderer sorts the objects from back to front for rendering.
	 *
	 * Important if using multiple transparent objects.
	 *
	 * @property sortObjects
	 * @type {Boolean}
	 */
	this.sortObjects = true;

	/**
	 * Gamma factor applied to the image.
	 *
	 * @property gammaFactor
	 * @type {Number}
	 */
	this.gammaFactor = 2.0;

	/**
	 * If set, then it expects that all textures and colors are premultiplied gamma.
	 *
	 * @property gammaInput
	 * @type {Boolean}
	 */
	this.gammaInput = false;

	/**
	 * If set, then it expects that all textures and colors need to be outputted in premultiplied gamma. 
	 *
	 * @property gammaOutput
	 * @type {Boolean}
	 */
	this.gammaOutput = false;

	/**
	 * Shader precision. Can be "highp", "mediump" or "lowp". Defaults to "highp" if supported by the device.
	 *
	 * @property precision
	 * @type {String}
	 */
	this.precision = "highp";

	/**
	 * Whether the canvas contains an alpha (transparency) buffer or not.
	 *
	 * @property premultipliedAlpha
	 * @type {Boolean}
	 */
	this.alpha = true;

	/**
	 * Whether the renderer will assume that colors have premultiplied alpha.
	 *
	 * @property premultipliedAlpha
	 * @type {Boolean}
	 */
	this.premultipliedAlpha = true;

	/** 
	 * Whether to preserve the buffers until manually cleared or overwritten.
	 *
	 * @property preserveDrawingBuffer
	 * @type {Boolean}
	 */
	this.preserveDrawingBuffer = false;

	/**
	 * Provides a hint to the user agent indicating what configuration of GPU is suitable for this WebGL context. Can be "high-performance", "low-power" or "default".
	 *
	 * @property powerPreference
	 * @type {String}
	 */
	this.powerPreference = "high-performance";

	/**
	 * Whether to use a logarithmic depth buffer. It may be neccesary to use this if dealing with huge differences in scale in a single scene.
	 *
	 * @property logarithmicDepthBuffer
	 * @type {Boolean}
	 */
	this.logarithmicDepthBuffer = false;

	/**
	 * Whether to use physically correct lighting mode.
	 *
	 * @property physicallyCorrectLights
	 * @type {Boolean}
	 */
	this.physicallyCorrectLights = false;
}

RendererConfiguration.WEBGL = 1000;
RendererConfiguration.WEBGL2 = 1001;

RendererConfiguration.prototype.createRenderer = function(canvas)
{
	var context = null;

	if(this.backend === RendererConfiguration.WEBGL2)
	{

	}
	else
	{

	}

	var renderer = new THREE.WebGLRenderer(
	{
		canvas: canvas,
		context: context,
		precision: this.precision,
		alpha: this.alpha,
		premultipliedAlpha: this.premultipliedAlpha,
		antialias: this.antialiasing,
		stencil: this.stencil,
		preserveDrawingBuffer: this.preserveDrawingBuffer,
		powerPreference: this.powerPreference,
		logarithmicDepthBuffer: this.logarithmicDepthBuffer
	});

	renderer.autoClear = false;
	renderer.autoClearColor = false;
	renderer.autoClearDepth = false;
	renderer.autoClearStencil = false;

	renderer.shadowMap.enabled = this.shadows;
	renderer.shadowMap.type = this.shadowsType;
	renderer.shadowMap.autoUpdate = this.shadowsAutoUpdate;
	renderer.shadowMap.needsUpdate = false;

	renderer.toneMapping = this.toneMapping;
	renderer.toneMappingExposure = this.toneMappingExposure;
	renderer.toneMappingWhitePoint = this.toneMappingWhitePoint;

	renderer.sortObjects = this.sortObjects;

	renderer.gammaFactor = this.gammaFactor;
	renderer.gammaInput = this.gammaInput;
	renderer.gammaOutput = this.gammaOutput;

	renderer.physicallyCorrectLights = this.physicallyCorrectLights;
};

RendererConfiguration.prototype.toJSON = function()
{
	//TODO <ADD CODE HERE>
};

RendererConfiguration.prototype.fromJSON = function(data)
{
	//TODO <ADD CODE HERE>
};
