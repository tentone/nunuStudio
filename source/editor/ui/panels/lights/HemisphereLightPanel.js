"use strict";

function HemisphereLightPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Sky color
	this.form.addText("Sky color");
	this.color = new ColorChooser(this.form.element);
	this.color.size.set(80, 18);
	this.color.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var color = self.color.getValue();
			self.obj.color.setRGB(color.r, color.g, color.b);
		}
	});
	this.form.add(this.color);
	this.form.nextRow();

	//Ground color
	this.form.addText("Ground color");
	this.groundColor = new ColorChooser(this.form.element);
	this.groundColor.size.set(80, 18);
	this.groundColor.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var color = self.groundColor.getValue();
			self.obj.groundColor.setRGB(color.r, color.g, color.b);
		}
	});
	this.form.add(this.groundColor);
	this.form.nextRow();

	//Visible
	this.visible = new CheckBox(this.form.element);
	this.visible.setText("Visible");
	this.visible.size.set(200, 15);
	this.visible.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.visible = self.visible.getValue();
		}
	});
	this.form.add(this.visible);
	this.form.nextRow();

	//Static
	this.static = new CheckBox(this.form.element);
	this.static.setText("Static Object");
	this.static.size.set(200, 15);
	this.static.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.matrixAutoUpdate = !(self.static.getValue());
		}
	});
	this.form.add(this.static);
	this.form.nextRow();

	//Update form
	this.form.updateInterface();
}

//Super prototypes
HemisphereLightPanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
HemisphereLightPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);

	if(this.obj !== null)
	{
		this.color.setValue(this.obj.color.r, this.obj.color.g, this.obj.color.b);
		this.groundColor.setValue(this.obj.groundColor.r, this.obj.groundColor.g, this.obj.groundColor.b);
		this.visible.setValue(this.visible);
		this.static.setValue(!this.obj.matrixAutoUpdate);
	}
}
