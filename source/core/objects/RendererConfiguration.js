"use strict";

/** 
 * Renderer configuration stores all the WebGL renderer related parameters.
 *
 * @class RendererConfiguration
 */
function RendererConfiguration()
{
	//TODO <ADD CODE HERE>

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
	 * If true the program is rendered with shadows
	 * @property shadows
	 * @type {boolean}
	 * @default true
	 */
	this.shadows = true;

	/**
	 * Shadow map filtering type.
	 *
	 * @property shadowsType
	 * @type {Number}
	 * @default PCFSoftShadowMap
	 */
	this.shadowsType = THREE.PCFSoftShadowMap;
	
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

	this.sortObjects = true;

	this.gammaFactor = 2.0;

	this.gammaInput = false;

	this.precision = "highp";

	this.alpha = true;

	this.premultipliedAlpha = true;

	this.preserveDrawingBuffer = false;

	this.powerPreference = "high-performance";

	this.logarithmicDepthBuffer = false;
}

RendererConfiguration.WEBGL = 1000;
RendererConfiguration.WEBGL2 = 1001;

RendererConfiguration.prototype.createRenderer = function()
{
	if(this.backend = )
	/*
	var renderer = new THREE.WebGLRenderer(
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

	renderer.shadowMap.enabled = settings.shadows;
	renderer.shadowMap.type = settings.shadowsType;
	renderer.shadowMap.autoUpdate = true;
	renderer.shadowMap.needsUpdate = false;

	renderer.toneMapping = settings.toneMapping;
	renderer.toneMappingExposure = settings.toneMappingExposure;
	renderer.toneMappingWhitePoint = settings.toneMappingWhitePoint;

	renderer.autoClear = false;
	renderer.autoClearColor = false;
	renderer.autoClearDepth = false;
	renderer.autoClearStencil = false;

	renderer.sortObjects = true;

	renderer.gammaFactor = 2;
	renderer.gammaInput = false;
	*/
};

RendererConfiguration.prototype.toJSON = function()
{
	//TODO <ADD CODE HERE>
};

RendererConfiguration.prototype.fromJSON = function(data)
{
	//TODO <ADD CODE HERE>
};
