"use strict";

function RenderPassNode(parent)
{
	PassNode.call(this, parent, "Render");

	this.addButtons();
}

RenderPassNode.prototype = Object.create(PassNode.prototype);