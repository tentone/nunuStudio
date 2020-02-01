"use strict";

/**
 * A LightProbe is a source of indirect-diffuse light.
 *
 * @param {number} sh Light color in hex RGB
 * @param {number} intensity Light intensity
 * @class LightProbe
 * @extends {LightProbe}
 * @module Lights
 */
function LightProbe(sh, intensity)
{
	THREE._LightProbe.call(this, sh, intensity);

	this.name = "probe";
}

THREE._LightProbe = THREE.LightProbe;
THREE.LightProbe = LightProbe;

LightProbe.prototype = Object.create(THREE._LightProbe.prototype);

LightProbe.prototype.toJSON = function(meta)
{
	var data = THREE.Light.prototype.toJSON.call(this, meta);

	data.sh = this.sh.toArray();

	return data;
};
