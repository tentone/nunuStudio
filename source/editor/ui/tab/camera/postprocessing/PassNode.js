"use strict";

function PassNode(parent, name)
{
	Form.call(this, parent);

	this.element.style.overflow = "hidden";
	
	this.defaultTextWidth = 60;
	this.position.set(10, 5);
	this.spacing.set(5, 5);

	//Pass
	this.pass = null;
	this.composer = null;

	//Render pass
	this.addText(name !== undefined ? name : "Pass Node");
	this.nextRow();

	var self = this;

	//Enabled
	this.addText("Enabled");
	this.enabled = new CheckBox(this.element);
	this.enabled.size.set(15, 15);
	this.enabled.setOnChange(function()
	{
		self.pass.enabled = self.enabled.getValue();
	});
	this.add(this.enabled);
	this.nextRow();

	//Render to screen
	this.addText("Output");
	this.renderToScreen = new CheckBox(this.element);
	this.renderToScreen.size.set(15, 15);
	this.renderToScreen.setOnChange(function()
	{
		self.pass.renderToScreen = self.renderToScreen.getValue();
	});
	this.add(this.renderToScreen);
	this.nextRow();

	//Up
	this.up = new Button(this.element);
	this.up.size.set(50, 18);
	this.up.setText("Up");
	this.up.setCallback(function()
	{
		//TODO <UP>
	});

	//Down
	this.down = new Button(this.element);
	this.down.size.set(50, 18);
	this.down.setText("Down");
	this.down.setCallback(function()
	{
		//TODO <UP>
	});

	//Delete
	this.delete = new Button(this.element);
	this.delete.size.set(70, 18);
	this.delete.setText("Delete");
	this.down.setCallback(function()
	{
		//TODO <DELETE>
		//self.composer
	});
}

PassNode.prototype = Object.create(Form.prototype);

PassNode.prototype.setPass = function(pass)
{
	this.pass = pass;

	this.enabled.setValue(pass.enabled);
	this.renderToScreen.setValue(pass.renderToScreen);
};

PassNode.prototype.setComposer = function(composer)
{
	this.add(this.up);
	this.add(this.down);
	this.add(this.delete);

	this.composer = composer;
};
