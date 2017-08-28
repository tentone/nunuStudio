"use strict";

function RenderPass()
{
	this.uuid = THREE.Math.generateUUID();
	this.type = "RenderPass";

	this._scene = null;
	this._camera = null;

	//TODO <ADD CODE HERE>
}

RenderPass.prototype.setSize = function(width, height)
{
	//TODO <ADD CODE HERE>
};

RenderPass.prototype.toJSON = function()
{
	var data = {};

	data.type = this.type;
	//TODO <ADD CODE HERE>

	return data;
}