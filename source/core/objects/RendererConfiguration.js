"use strict";

/** 
 * Renderer configuration stores all the WebGL renderer related parameters.
 *
 * @class RendererConfiguration
 */
function RendererConfiguration()
{
	/**
	 * Prefered redering backend API to use if available.
	 *
	 * If the selected backend is not available it defaults to WebGL.
	 *
	 * Shader code might not be cross compatible between rendering backends.
	 *
	 * @property backend
	 * @type {Number}
	 */
	this.backend = RendererConfiguration.WEBGL;

	/** 
	 * Defines whether the renderer should automatically clear its output before rendering a frame.
	 *
	 * @property autoClear
	 * @type {Boolean}
	 */
	this.autoClear = false;

	/** 
	 * Defines whether the renderer should clear the color buffer.
	 *
	 * @property autoClearColor
	 * @type {Boolean}
	 */
	this.autoClearColor = false;

	/** 
	 * Defines whether the renderer should clear the depth buffer.
	 *
	 * @property autoClearDepth
	 * @type {Boolean}
	 */
	this.autoClearDepth = false;
	
	/** 
	 * Defines whether the renderer should clear the stencil buffer.
	 *
	 * @property autoClearStencil
	 * @type {Boolean}
	 */
	this.autoClearStencil = false;

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
	 * Tonemapping can be used to remap the color of the image to a diferent set giving the scene a different color mood and/or dynamic color based on global luminosity.
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

/** 
 * Use WebGL 1.0 to render data.
 *
 * Most devices fully support WebGL 1.0 at this point, should work for any type of device.
 *
 * @static
 * @attribute WEBGL
 * @type {Number}
 */
RendererConfiguration.WEBGL = 1;

/** 
 * Use WebGL 2.0 to render data, should be faster for some types of data.
 *
 * Additinal features of GLSL can be used in WebGL 2.0. Most mobile device still dont support WebGL 2.0.
 *
 * @static
 * @attribute WEBGL2
 * @type {Number}
 */
RendererConfiguration.WEBGL2 = 2;

RendererConfiguration.prototype.createRenderer = function(canvas)
{
	var context = null;

	if(this.backend === RendererConfiguration.WEBGL2)
	{
		try
		{
			context = canvas.getContext("webgl2");
		}
		catch(e){}
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

	renderer.autoClear = this.autoClear;
	renderer.autoClearColor = this.autoClearColor;
	renderer.autoClearDepth = this.autoClearDepth;
	renderer.autoClearStencil = this.autoClearStencil;

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

	return renderer;
};

RendererConfiguration.prototype.toJSON = function()
{
	return {
		backend: this.backend,
		autoClear: this.autoClear,
		autoClearColor: this.autoClearColor,
		autoClearDepth: this.autoClearDepth,
		autoClearStencil: this.autoClearStencil,
		antialiasing: this.antialiasing,
		shadows: this.shadows,
		stencil: this.stencil,
		shadowsType: this.shadowsType,
		shadowsAutoUpdate: this.shadowsAutoUpdate,
		toneMapping: this.toneMapping,
		toneMappingExposure: this.toneMappingExposure,
		toneMappingWhitePoint: this.toneMappingWhitePoint,
		sortObjects: this.sortObjects,
		gammaFactor: this.gammaFactor,
		gammaInput: this.gammaInput,
		gammaOutput: this.gammaOutput,
		precision: this.precision,
		alpha: this.alpha,
		premultipliedAlpha: this.premultipliedAlpha,
		preserveDrawingBuffer: this.preserveDrawingBuffer,
		powerPreference: this.powerPreference,
		logarithmicDepthBuffer: this.logarithmicDepthBuffer,
		physicallyCorrectLights: this.physicallyCorrectLights
	};
};

RendererConfiguration.prototype.fromJSON = function(data)
{
	this.backend = data.backend;
	this.autoClear = data.autoClear;
	this.autoClearColor = data.autoClearColor;
	this.autoClearDepth = data.autoClearDepth;
	this.autoClearStencil = data.autoClearStencil;
	this.antialiasing = data.antialiasing;
	this.shadows = data.shadows;
	this.stencil = data.stencil;
	this.shadowsType = data.shadowsType;
	this.shadowsAutoUpdate = data.shadowsAutoUpdate;
	this.toneMapping = data.toneMapping;
	this.toneMappingExposure = data.toneMappingExposure;
	this.toneMappingWhitePoint = data.toneMappingWhitePoint;
	this.sortObjects = data.sortObjects;
	this.gammaFactor = data.gammaFactor;
	this.gammaInput = data.gammaInput;
	this.gammaOutput = data.gammaOutput;
	this.precision = data.precision;
	this.alpha = data.alpha;
	this.premultipliedAlpha = data.premultipliedAlpha;
	this.preserveDrawingBuffer = data.preserveDrawingBuffer;
	this.powerPreference = data.powerPreference;
	this.logarithmicDepthBuffer = data.logarithmicDepthBuffer;
	this.physicallyCorrectLights = data.physicallyCorrectLights;
};
