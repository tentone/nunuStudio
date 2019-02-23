"use strict";

/** 
 * Renderer configuration stores all the WebGL renderer related parameters.
 *
 * @class RendererConfiguration
 */
function RendererConfiguration()
{
	//TODO <ADD CODE HERE>

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
}

RendererConfiguration.prototype.toJSON = function()
{
	//TODO <ADD CODE HERE>
};