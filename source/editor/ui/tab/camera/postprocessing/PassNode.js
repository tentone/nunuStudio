"use strict";

function PassNode(parent)
{
	Division.call(this, parent);

	this.form = new Form(this.element);

	//TODO <ADD CODE HERE>
}

PassNode.prototype = Object.create(Division.prototype);