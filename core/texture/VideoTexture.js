"use strict";

//Video texture constructor
function VideoTexture(url)
{
	this.data = null;
	this.encoding = "";

	if(url !== null)
	{
		this.data = base64ArrayBuffer(App.readFileArrayBuffer(url));
		this.encoding = url.split(".").pop();
	}

	//Element
	this.video = document.createElement("video");
	this.video.width = 256;
	this.video.height = 256;
	this.video.autoplay = true;
	this.video.loop = true;
	this.video.src = "data:video/" + this.enconding + ";base64," + this.data;;

	THREE.VideoTexture.call(this, this.video);

	//Name
	this.name = "video";
	this.category = "Video";

	//Set filtering
	this.minFilter = THREE.LinearFilter;
	this.magFilter = THREE.LinearFilter;
	this.format = THREE.RGBFormat;
}

//Super prototypes
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
			version: Editor.VERSION,
			type: "VideoTexture"
		},

		uuid: this.uuid,
		name: this.name,
		
		mapping: this.mapping,

		repeat: [this.repeat.x, this.repeat.y],
		offset: [this.offset.x, this.offset.y],
		wrap: [this.wrapS, this.wrapT],

		minFilter: this.minFilter,
		magFilter: this.magFilter,
		anisotropy: this.anisotropy,

		flipY: this.flipY
	};

	meta.textures[this.uuid] = output;
	return output;
}