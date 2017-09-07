"use strict";

function PassNode(parent)
{
	Form.call(this, parent);

	this.element.style.backgroundColor = "#222222";

	this.node = null;

	var self = this;

	this.addText("Display");
	this.renderToScreen = new CheckBox(this.element);
	this.renderToScreen.size.set(15, 15);
	this.renderToScreen.setOnChange(function()
	{
		self.node.renderToScreen = self.renderToScreen.getValue();
	});
	this.add(this.renderToScreen);
	this.nextRow();


	this.updateInterface();
}

PassNode.prototype = Object.create(Form.prototype);