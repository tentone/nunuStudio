"use strict";

//Video texture constructor
function VideoTexture(url)
{
	var extension = url.split(".").pop();

	//Data
	this.data = "data:video/" + extension + ";base64," + base64ArrayBuffer(App.readFileArrayBuffer(url));

	//Element
	this.video = document.createElement("video");
	this.video.width = 256;
	this.video.height = 256;
	this.video.autoplay = true;
	this.video.loop = true;
	this.video.src = this.data;

	//Create Texture part of object
	THREE.VideoTexture.call(this, this.video);

	//Name and type
	this.name = "video";
	this.type = "Video";

	//Set filtering
	this.minFilter = THREE.LinearFilter;
	this.magFilter = THREE.LinearFilter;
	this.format = THREE.RGBFormat;
}

VideoTexture.prototype = Object.create(THREE.VideoTexture.prototype);

//Dispose texture
VideoTexture.prototype.dispose = function()
{
	if(!this.video.paused)
	{
		this.video.pause();
	}
	THREE.Texture.prototype.dispose.call(this);
}

//Create JSON description
VideoTexture.prototype.toJSON = function(meta)
{
	if(meta.textures[this.uuid] !== undefined)
	{
		return meta.textures[this.uuid];
	}

	var output =
	{
		metadata:
		{
			version: 1.0,
			type: "NunuTexture"
		},

		uuid: this.uuid,
		name: this.name,
		type: this.type,
		
		mapping: this.mapping,

		repeat: [this.repeat.x, this.repeat.y],
		offset: [this.offset.x, this.offset.y],
		wrap: [this.wrapS, this.wrapT],

		minFilter: this.minFilter,
		magFilter: this.magFilter,
		anisotropy: this.anisotropy,

		flipY: this.flipY
	};

	if(this.image !== undefined)
	{
		var image = this.image;

		if(image.uuid === undefined)
		{
			image.uuid = THREE.Math.generateUUID();
		}

		if(meta.images[image.uuid] === undefined)
		{
			meta.images[image.uuid] =
			{
				uuid: image.uuid,
				url: this.data
			};
		}

		output.image = image.uuid;
	}

	meta.textures[this.uuid] = output;
	return output;
}