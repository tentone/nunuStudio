"use strict";

//Text texture constructor
function TextTexture()
{
	//Text canvas
	this.canvas = document.createElement("canvas");
	this.canvas.width = 256;
	this.canvas.height = 256;

	//Draw text to canvas
	this.context = this.canvas.getContext("2d");
	this.context.font = "Normal 60px Arial";
	this.context.textAlign = "center";
	this.context.fillStyle = "#FFFFFF";
	this.context.fillText("text", this.canvas.width/2, this.canvas.height/2);

	THREE.CanvasTexture.call(this, this.canvas);

	this.text = "text";
	this.needsUpdate = true;
}

//Functions prototype
TextTexture.prototype = Object.create(THREE.CanvasTexture.prototype);
