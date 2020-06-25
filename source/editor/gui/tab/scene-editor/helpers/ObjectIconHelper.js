import {Text} from "../../../../components/Text.js";
import {Object3D, Sprite, Texture, SpriteMaterial} from "three";

/** 
 * Object icon helper is used to display the icon of an object.
 * 
 * @class ObjectIconHelper
 * @param {Object3D} object
 * @param {String) icon Icon URL.
 */
function ObjectIconHelper(object, icon)
{
	Sprite.call(this, ObjectIconHelper.getMaterial(icon));

	/**
	 * Object attached to the helper
	 *
	 * @attribute object
	 * @type {Object3D}
	 */
	this.object = object;

	/**
	 * Size of the helper.
	 *
	 * @attribute size
	 * @type {number}
	 */
	this.size = 0.1;
	
	this.matrixAutoUpdate = false;
}

ObjectIconHelper.prototype = Object.create(Sprite.prototype);

/**
 * Cache of icon helper materials.
 *
 * @static
 * @attribute MATERIALS
 * @type {Map}
 */
ObjectIconHelper.MATERIALS = new Map();

/**
 * Get the sprite material for a icon url.
 *
 * @static
 * @method getMaterial
 * @param {string} icon Icon URL.
 */
ObjectIconHelper.getMaterial = function(icon)
{
	if(ObjectIconHelper.MATERIALS.has(icon))
	{
		return ObjectIconHelper.MATERIALS.get(icon);
	}

	var element = document.createElement("img");
	var texture = new Texture(element);
	var material = new SpriteMaterial(
	{
		map: texture,
		transparent: true,
		depthTest: false,
		depthWrite: false,
		sizeAttenuation: false,
		alphaTest: 0.2
	});
	
	material.ratio = 1.0;

	element.onload = function()
	{
		material.ratio = this.naturalWidth / this.naturalHeight;
		texture.needsUpdate = true;	
	};
	element.src = icon;

	ObjectIconHelper.MATERIALS.set(icon, material);

	return material;
};

ObjectIconHelper.prototype.update = function()
{
	// Position
	this.matrix.elements[12] = this.object.matrixWorld.elements[12];
	this.matrix.elements[13] = this.object.matrixWorld.elements[13];
	this.matrix.elements[14] = this.object.matrixWorld.elements[14];

	// Scale
	this.matrix.elements[0] = this.size;
	this.matrix.elements[5] = this.size / this.material.ratio;
	this.matrix.elements[10] = this.size;

};

export {ObjectIconHelper};