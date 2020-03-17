"use strict";

// Serialization does not serialize any image data.
THREE.Texture.prototype.toJSON = function(meta)
{
	// Check if this texture was already serialized
	if(meta.textures[this.uuid] !== undefined)
	{
		return meta.textures[this.uuid];
	}

	// Serialize texture data
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
		
		format: this.format,
		mapping: this.mapping,

		repeat: [this.repeat.x, this.repeat.y],
		offset: [this.offset.x, this.offset.y],
		center: [this.center.x, this.center.y],
		rotation: this.rotation,

		wrap: [this.wrapS, this.wrapT],

		minFilter: this.minFilter,
		magFilter: this.magFilter,
		anisotropy: this.anisotropy,

		flipY: this.flipY
	};

	meta.textures[this.uuid] = data;
	
	return data;
};