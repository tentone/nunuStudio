"use strict";

/**
 * Video texture that uses youtube as a source.
 * 
 * @class YoutubeTexture
 * @extends {Texture}
 * @module Textures
 * @param {Video} video
 * @param {Number} mapping
 * @param {Number} wrapS
 * @param {Number} wrapT
 * @param {Number} type
 * @param {Number} anisotropy
 */
function YoutubeTexture(url, mapping, wrapS, wrapT, type, anisotropy)
{
	THREE.Texture.call(this, document.createElement("video"), mapping, wrapS, wrapT, THREE.LinearFilter, THREE.LinearFilter, THREE.RGBFormat, type, anisotropy);
	
	this.disposed = false;
	this.generateMipmaps = false;
	this.format = THREE.RGBFormat;

	this.name = "youtube";
	this.category = "YoutubeVideo";

	this.videoId = url !== undefined ? YoutubeTexture.getVideoId(url) : "";

	//TODO <ADD CODE HERE>
}

YoutubeTexture.prototype = Object.create(THREE.Texture.prototype);

/**
 * Get the youtube video id from the video URL.
 *
 * @static
 * @method getVideoId
 * @param {String} url
 */
YoutubeTexture.getVideoIdRegEx = function(url)
{
	var match = url.match(/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/);

	if(match !== -1)
	{
		return match[1];	
	}

	return "";
};

YoutubeTexture.makeSuitableForTexture = function(srcElement)
{
	srcElement.crossOrigin = "";

	var width, height;

	//it probs should be image.width not image.videoWidth or clientWidth but doesn"t work with <video>
	if(srcElement.tagName === "IMG")
	{
		width = srcElement.width;
		height = srcElement.height;
	}
	else
	{
		srcElement.videoWidth;
		height = srcElement.videoHeight;
	}

	if(!isPowerOfTwo(width) || !isPowerOfTwo(height))
	{
		//Scale up the texture to the next highest power of two dimensions.
		var canvas = document.createElement("canvas");
		canvas.width = nextHighestPowerOfTwo(width);
		canvas.height = nextHighestPowerOfTwo(height);

		//Colour the bg in almost black
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "#1F1F1F";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//Draw image in the middle
		var centerX = canvas.width / 2 - width / 2;
		var centerY = canvas.height / 2 - height / 2;
		ctx.drawImage(image, centerX, centerY, width, height);

		srcElement = canvas;
	}

	return srcElement;
};

YoutubeTexture.nextHighestPowerOfTwo = function(x)
{
	--x;

	for (var i = 1; i < 32; i <<= 1)
	{
		x = x | x >> i;
	}

	return x + 1;
};