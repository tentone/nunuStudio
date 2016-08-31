"use strict";

//Image constructor
function Image(url)
{
	this.name = "image";
	this.uuid = THREE.Math.generateUUID();
	this.type = "Image";

	this.encoding = "";
	this.data = null;
	this.format = "";

	if(url !== undefined)
	{
		var file = new XMLHttpRequest();
		file.open("GET", url, false);
		file.overrideMimeType("text/plain; charset=x-user-defined");
		file.send(null);

		this.encoding = url.split(".").pop();
		this.data = "data:image/" + this.encoding + ";base64," + base64BinaryString(file.response);
		this.format = "base64";
	}
}

//Choose proper enconding for image data
Image.prototype.compressData = function()
{
	/*var image = document.createElement("img");
	image.src = this.data;

	var canvas = document.createElement("canvas");
	canvas.width = image.width;
	canvas.height = image.height;

	var context = canvas.getContext("2d");
	context.drawImage(image, 0, 0, image.width, image.height);

	var transparent = false;
	var data = context.getImageData(0, 0, image.width, image.height).data;
	for(var i = 3; i < data.length; i += 4)
	{
		if(data[i] !== 255)
		{
			transparent = true;
			break;
		}
	}

	if(transparent)
	{
		return canvas.toDataURL("image/png");
	}
	else
	{
		return canvas.toDataURL("image/jpeg", 0.8);
	}*/
}

//JSON serialization
Image.prototype.toJSON = function(meta)
{
	if(meta.images[this.uuid] !== undefined)
	{
		return meta.images[this.uuid];
	}

	var data = {};
	data.name = this.name;
	data.uuid = this.uuid;
	data.type = this.type;
	data.encoding = this.encoding;
	data.format = this.format;
	data.data = this.data;

	meta.images[this.uuid] = data;

	return data;
}