import {Canvas} from "../../../editor/components/Canvas.js";
import {PCFSoftShadowMap, NoToneMapping, WebGLRenderer} from "three";

/** 
 * Renderer configuration stores all the WebGL renderer related parameters.
 *
 * @constructor
 * @class RendererConfiguration
 * @param {Object} options Options object with the values to be used in the rendere configuration, values not specified are set to default.
 */
function RendererConfiguration(options)
{
	/**
	 * Canvas background color, optional only used if specified.
	 *
	 * Different from the clear color used to clear the render target.
	 *
	 * @property backgroundColor
	 * @type {string}
	 */
	this.backgroundColor = null;

	/**
	 * Prefered redering backend API to use if available.
	 *
	 * If the selected backend is not available it defaults to WebGL.
	 *
	 * Shader code might not be cross compatible between rendering backends.
	 *
	 * @property backend
	 * @type {number}
	 */
	this.backend = RendererConfiguration.WEBGL2;

	/** 
	 * Defines whether the renderer should automatically clear its output before rendering a frame.
	 *
	 * @property autoClear
	 * @type {boolean}
	 */
	this.autoClear = false;

	/** 
	 * Defines whether the renderer should clear the color buffer.
	 *
	 * @property autoClearColor
	 * @type {boolean}
	 */
	this.autoClearColor = false;

	/** 
	 * Defines whether the renderer should clear the depth buffer.
	 *
	 * @property autoClearDepth
	 * @type {boolean}
	 */
	this.autoClearDepth = false;
	
	/** 
	 * Defines whether the renderer should clear the stencil buffer.
	 *
	 * @property autoClearStencil
	 * @type {boolean}
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
	 * @type {number}
	 * @default PCFSoftShadowMap
	 */
	this.shadowsType = PCFSoftShadowMap;

	/** 
	 * Enables automatic updates to the shadows in the scene.
	 *
	 * If you do not require dynamic lighting / shadows, you may set this to false.
	 *
	 * Use renderer.shadowMap.needsUpdate to update the shadow map.
	 *
	 * @property shadowsAutoUpdate
	 * @type {boolean}
	 */
	this.shadowsAutoUpdate = true;

	/**
	 * Tonemapping can be used to remap the color of the image to a diferent set giving the scene a different color mood and/or dynamic color based on global luminosity.
	 *
	 * @property toneMapping
	 * @type {number}
	 * @default NoToneMapping
	 */
	this.toneMapping = NoToneMapping;

	/**
	 * Exposure level of tone mapping.
	 *
	 * @property toneMappingExposure
	 * @type {number}
	 */
	this.toneMappingExposure = 1.0;

	/**
	 * Tone mapping white point.
	 *
	 * @property toneMappingWhitePoint
	 * @type {number}
	 */
	this.toneMappingWhitePoint = 1.0;

	/** 
	 * If true the renderer sorts the objects from back to front for rendering.
	 *
	 * Important if using multiple transparent objects.
	 *
	 * @property sortObjects
	 * @type {boolean}
	 */
	this.sortObjects = true;

	/**
	 * Gamma factor applied to the image.
	 *
	 * @property gammaFactor
	 * @type {number}
	 */
	this.gammaFactor = 2.0;

	/**
	 * Shader precision. Can be "highp", "mediump" or "lowp". Defaults to "highp" if supported by the device.
	 *
	 * @property precision
	 * @type {string}
	 */
	this.precision = "highp";

	/**
	 * Whether the canvas contains an alpha (transparency) buffer or not.
	 *
	 * @property alpha
	 * @type {boolean}
	 */
	this.alpha = false;

	/**
	 * Whether the renderer will assume that colors have premultiplied alpha.
	 *
	 * @property premultipliedAlpha
	 * @type {boolean}
	 */
	this.premultipliedAlpha = true;

	/** 
	 * Whether to preserve the buffers until manually cleared or overwritten.
	 *
	 * @property preserveDrawingBuffer
	 * @type {boolean}
	 */
	this.preserveDrawingBuffer = false;

	/**
	 * Provides a hint to the user agent indicating what configuration of GPU is suitable for this WebGL context. Can be "high-performance", "low-power" or "default".
	 *
	 * @property powerPreference
	 * @type {string}
	 */
	this.powerPreference = "high-performance";

	/**
	 * Whether to use a logarithmic depth buffer. It may be neccesary to use this if dealing with huge differences in scale in a single scene.
	 *
	 * @property logarithmicDepthBuffer
	 * @type {boolean}
	 */
	this.logarithmicDepthBuffer = false;

	/**
	 * Whether to use physically correct lighting mode.
	 *
	 * @property physicallyCorrectLights
	 * @type {boolean}
	 */
	this.physicallyCorrectLights = false;

	/**
	 * Defines whether material shader programs are checked for errors during compilation and linkage process.
	 *
	 * @property checkShaderErrors
 	 * @type {boolean}
	 */
	this.checkShaderErrors = true;
	
	/**
	 * The maximum number of MorphTargets allowed in a shader.
	 *
	 * @property maxMorphTargets
	 * @type {number}
	 */
	this.maxMorphTargets = 8;

	/**
	 * The maximum number of MorphNormals allowed in a shader.
	 *
	 * @property maxMorphNormals
	 * @type {number}
	 */
	this.maxMorphNormals = 4;

	// Copy values received from the options parameter
	if(options !== undefined)
	{	
		for(var i in this)
		{
			if(options[i] !== undefined)
			{
				this[i] = options[i];
			}
		}
	}
}

/** 
 * Use WebGL 1.0 to render data.
 *
 * Most devices fully support WebGL 1.0 at this point, should work for any type of device.
 *
 * @static
 * @attribute WEBGL
 * @type {number}
 */
RendererConfiguration.WEBGL = 1;

/** 
 * Use WebGL 2.0 to render data, should be faster for some types of data.
 *
 * Additinal features of GLSL can be used in WebGL 2.0. Most mobile device still dont support WebGL 2.0.
 *
 * @static
 * @attribute WEBGL2
 * @type {number}
 */
RendererConfiguration.WEBGL2 = 2;

/**
 * Create a THREE renderer object based on the renderer configuration.
 *
 * @method createRenderer
 * @return {WebGLRenderer} Renderer created from the configuration.
 */
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

	var renderer = new WebGLRenderer(
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

	this.apply(renderer);

	if(this.backgroundColor !== null)
	{
		canvas.style.backgroundColor = this.backgroundColor;
	}



	return renderer;
};

RendererConfiguration.prototype.apply = function(renderer)
{
	renderer.autoClear = this.autoClear;
	renderer.autoClearColor = this.autoClearColor;
	renderer.autoClearDepth = this.autoClearDepth;
	renderer.autoClearStencil = this.autoClearStencil;

	renderer.shadowMap.enabled = this.shadows;
	renderer.shadowMap.type = this.shadowsType;
	renderer.shadowMap.autoUpdate = this.shadowsAutoUpdate;
	renderer.shadowMap.needsUpdate = true;

	renderer.toneMapping = this.toneMapping;
	renderer.toneMappingExposure = this.toneMappingExposure;
	renderer.toneMappingWhitePoint = this.toneMappingWhitePoint;

	renderer.debug.checkShaderErrors = this.checkShaderErrors;
	renderer.sortObjects = this.sortObjects;

	renderer.gammaFactor = this.gammaFactor;
	renderer.physicallyCorrectLights = this.physicallyCorrectLights;

	renderer.maxMorphTargets = this.maxMorphTargets;
	renderer.maxMorphNormals = this.maxMorphNormals;
};

RendererConfiguration.prototype.toJSON = function()
{
	return {
		backgroundColor: this.backgroundColor,
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
		checkShaderErrors: this.checkShaderErrors,
		gammaFactor: this.gammaFactor,
		precision: this.precision,
		alpha: this.alpha,
		premultipliedAlpha: this.premultipliedAlpha,
		preserveDrawingBuffer: this.preserveDrawingBuffer,
		powerPreference: this.powerPreference,
		logarithmicDepthBuffer: this.logarithmicDepthBuffer,
		physicallyCorrectLights: this.physicallyCorrectLights,
		maxMorphTargets: this.maxMorphTargets,
		maxMorphNormals: this.maxMorphNormals
	};
};

RendererConfiguration.prototype.fromJSON = function(data)
{
	this.backgroundColor = data.backgroundColor;
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
	this.checkShaderErrors = data.checkShaderErrors;
	this.gammaFactor = data.gammaFactor;
	this.precision = data.precision;
	this.alpha = data.alpha;
	this.premultipliedAlpha = data.premultipliedAlpha;
	this.preserveDrawingBuffer = data.preserveDrawingBuffer;
	this.powerPreference = data.powerPreference;
	this.logarithmicDepthBuffer = data.logarithmicDepthBuffer;
	this.physicallyCorrectLights = data.physicallyCorrectLights;
	this.maxMorphTargets = data.maxMorphTargets;
	this.maxMorphNormals = data.maxMorphNormals;
};

export {RendererConfiguration};