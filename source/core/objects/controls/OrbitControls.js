"use strict";

/**
 * Orbit controls is a container that can be controlled using the mouse.
 * 
 * It can be rotated using the mouse left button, moved with the mouse right button or mouse wheel. 
 * 
 * @class OrbitControls
 * @constructor
 * @extends {Object3D}
 * @module Misc
 */
function OrbitControls()
{
	THREE.Object3D.call(this);

	this.name = "orbit";
	this.type = "OrbitControls";

	this.mouse = null;
	this.keyboard = null;
}

OrbitControls.prototype = Object.create(THREE.Object3D.prototype);

OrbitControls.prototype.initialize = function()
{
	var node = this;
	while(node.parent !== null)
	{
		if(node instanceof Program)
		{
			this.mouse = node.mouse;
			this.keyboard = node.keyboard;
			break;
		}
	}

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
};

OrbitControls.prototype.update = function()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
};