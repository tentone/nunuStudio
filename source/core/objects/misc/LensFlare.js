"use strict";

/**
 * LensFlare object can be used to simulate lens flare from lights, the LensFlare object stores an array of textures with distance and dimension information.
 *
 * Works with perspective and orthographic cameras.
 *
 * @class LensFlare
 * @constructor
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author tentone
 */
function LensFlare(texture, size, distance, blending, color)
{
	THREE.Object3D.call( this );

	this.type = "LensFlare";
	this.lensFlares = [];

	this.positionScreen = new Vector3();
	this.customUpdateCallback = undefined;

	if(texture !== undefined)
	{
		this.add(texture, size, distance, blending, color);
	}
}

LensFlare.prototype = Object.create(THREE.Object3D.prototype);

//Overrides THREE.LensFlare
THREE._LensFlare = THREE.LensFlare;
THREE.LensFlare = LensFlare;

/**
 * LensFlare flare constructor.
 *
 * @class LensFlare.Flare
 * @param {Texture} texture Texture to be used for the new layer.
 * @param {Number} size Size in pixels (-1 = use texture.width)
 * @param {Number} distance Distance (0-1) from light source (0=at light source)
 * @param {Number} blending Blending mode to be used.
 * @param {Color} color Texture color
 * @param {Number} opacity Texture opacity
 */
LensFlare.Flare = function(texture, size, distance, blending, color, opacity)
{
	this.texture = texture;
	this.size = size;
	this.distance = distance;
	this.opacity = opacity;
	this.color = color;
	this.blending = blending;

	//Screen position (-1 => 1) z = 0 is in front z = 1 is back
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.scale = 1;
	this.rotation = 0;
}

LensFlare.Flare.prototype.toJSON = function(texture, size, distance, blending, color, opacity)
{
	var data = {};

	data.texture = this.texture.uuid;
	data.size = this.size;
	data.distance = this.distance;
	data.opacity = this.opacity;
	data.color = this.color;
	data.blending = this.blending;

	return data;
};


LensFlare.prototype.isLensFlare = true;

/**
 * Copy lensflare object data to this.
 *
 * @method copy
 * @param {Object3D} source Source object.
 * @return {LensFlare} Self for chaining.
 */
LensFlare.prototype.copy = function (source)
{
	THREE.Object3D.prototype.copy.call(this, source);

	this.positionScreen.copy(source.positionScreen);
	this.customUpdateCallback = source.customUpdateCallback;

	for(var i = 0, l = source.lensFlares.length; i < l; i++)
	{
		this.lensFlares.push(source.lensFlares[i]);
	}

	return this;
};

/**
 * Add texture to the lensFlare object.
 *
 * @method add
 * @param {Texture} texture Texture to be used for the new layer.
 * @param {Number} size Size in pixels (-1 = use texture.width)
 * @param {Number} distance Distance (0-1) from light source (0=at light source)
 * @param {Number} blending Blending mode to be used.
 * @param {Color} color Texture color
 * @param {Number} opacity Texture opacity
 */
LensFlare.prototype.add = function(texture, size, distance, blending, color, opacity)
{
	if(size === undefined) size = -1;
	if(distance === undefined) distance = 0;
	if(opacity === undefined) opacity = 1;
	if(color === undefined) color = new Color(0xffffff);
	if(blending === undefined) blending = NormalBlending;

	distance = Math.min(distance, Math.max(0, distance));

	this.lensFlares.push(new LensFlare.Flare(texture, size, distance, blending, color, opacity));
};

/**
 * Update lens flares update positions on all flares based on the screen position
 * Set myLensFlare.customUpdateCallback to alter the flares in your project specific way.
 *
 * @method updateLensFlares
 */
LensFlare.prototype.updateLensFlares = function()
{
	var fl = this.lensFlares.length;
	var vecX = - this.positionScreen.x * 2;
	var vecY = - this.positionScreen.y * 2;

	for(var f = 0; f < fl; f ++)
	{
		var flare = this.lensFlares[f];

		flare.x = this.positionScreen.x + vecX * flare.distance;
		flare.y = this.positionScreen.y + vecY * flare.distance;

		flare.wantedRotation = flare.x * Math.PI * 0.25;
		flare.rotation += (flare.wantedRotation - flare.rotation) * 0.25;
	}
};

/**
 * Serialize lensflare data to json.
 *
 * @method toJSON
 * @param {Object} meta Metadata.
 * @return {Object} Serialized data.
 */
LensFlare.prototype.toJSON = function(meta)
{
	var self = this;
	var lensFlares = [];

	var data = THREE.Object3D.prototype.toJSON.call(this, meta, function(meta, object)
	{
		for(var i = 0; i < self.lensFlares.length; i++)
		{
			var flare = {};
			var texture = self.lensFlares[i].texture.toJSON(meta);

			flare.texture = texture.uuid;
			flare.size = self.lensFlares[i].size;
			flare.distance = self.lensFlares[i].distance;
			flare.opacity = self.lensFlares[i].opacity;
			flare.color = self.lensFlares[i].color.getHex();
			flare.blending = self.lensFlares[i].blending;

			lensFlares.push(flare);
		}
	});

	data.object.lensFlares = lensFlares;

	return data;
};
