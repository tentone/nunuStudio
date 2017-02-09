"use strict";

/**
 * THREE.Texture documentation is available at https://threejs.org/docs/index.html?q=texture#Reference/Textures/Texture
 * @class THREE.Texture
 * @constructor
 */

/**
 * THREE.Texture serialization is different inside nunuStudio, the THREE.Texture class does not serialize any image data.
 * @param {Object} meta
 * @return {Object} json
 */
THREE.Texture.prototype.toJSON = function(meta)
{
	//Check if this texture was already serialized
	if(meta.textures[this.uuid] !== undefined)
	{
		return meta.textures[this.uuid];
	}

	//Serialize texture data
	var data =
	{
		metadata:
		{
			version: Nunu.VERSION,
			type: "Texture"
		},

		uuid: this.uuid,
		name: this.name,
		category: this.category,
		
		mapping: this.mapping,

		repeat: [this.repeat.x, this.repeat.y],
		offset: [this.offset.x, this.offset.y],
		wrap: [this.wrapS, this.wrapT],

		minFilter: this.minFilter,
		magFilter: this.magFilter,
		anisotropy: this.anisotropy,

		flipY: this.flipY
	};

	meta.textures[this.uuid] = data;
	
	return data;
}