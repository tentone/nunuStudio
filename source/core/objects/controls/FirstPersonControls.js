"use strict";

/**
 * First person controls can be controlled using the mouse and keyboard.
 *
 * Provides a navigations system familiar to the one found on FPS games.
 * 
 * The mouse left button can be used to look around, and the keyboard arrows for movement.
 * 
 * @class FirstPersonControls
 * @constructor
 * @extends {Object3D}
 * @module Controls
 */
function FirstPersonControls()
{
	THREE.Object3D.call(this);

	this.name = "orbit";
	this.type = "FirstPersonControls";

	this.mouse = null;
	this.keyboard = null;
}

FirstPersonControls.prototype = Object.create(THREE.Object3D.prototype);

FirstPersonControls.prototype.initialize = function()
{
	var node = this;
	while(node.parent !== null)
	{
		node = node.parent;

		if(node instanceof Program)
		{
			this.mouse = node.mouse;
			this.keyboard = node.keyboard;
		}
	}

	this.center.copy(this.position);

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
};

FirstPersonControls.prototype.update = function()
{
	//TODO <ADD CODE HERE>
	
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
};

FirstPersonControls.prototype.toJSON = function(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	return data;
};