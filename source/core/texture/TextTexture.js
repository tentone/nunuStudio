"use strict";

function TextTexture(text, font, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding)
{
	THREE.Texture.call(this, document.createElement("canvas"), mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

	this.image.width = 2048;
	this.image.height = 2048;

	this.context = this.image.getContext("2d");
	this.context.font = "Normal 500px Arial";
	this.context.textAlign = "center";
	this.context.fillStyle = "#FFFFFF";
	this.context.fillText("text", this.image.width/2, this.image.height/2);

	this.name = "text";
	this.category = "Text";

	this.text = text;
	this.font = font;

	
	//font.draw(previewCtx, textToRender, 0, 32, fontSize, {kerning: true});

	this.needsUpdate = true;
}

TextTexture.prototype = Object.create(THREE.Texture.prototype);