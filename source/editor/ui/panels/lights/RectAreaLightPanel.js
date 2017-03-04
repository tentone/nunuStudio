"use strict";

function RectAreaLightPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Color
	this.form.addText("Color");
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

	//Intensity
	this.form.addText("Intensity");
	this.intensity = new Slider(this.form.element);
	this.intensity.size.set(160, 18);
	this.intensity.setStep(0.1);
	this.intensity.setRange(0, 500);
	this.intensity.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.intensity = self.intensity.getValue();
		}
	});
	this.form.add(this.intensity);
	this.form.nextRow();

	//Rect width
	this.form.addText("Width");
	this.width = new NumberBox(this.form.element);
	this.width.size.set(60, 18);
	this.width.setStep(0.1);
	this.width.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.width = self.width.getValue();
		}
	});
	this.form.add(this.width);
	this.form.nextRow();
	
	//Rect height
	this.form.addText("Height");
	this.height = new NumberBox(this.form.element);
	this.height.size.set(60, 18);
	this.height.setStep(0.1);
	this.height.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.height = self.height.getValue();
		}
	});
	this.form.add(this.height);
	this.form.nextRow();

	//Visible
	this.visible = new CheckBox(this.form.element);
	this.form.addText("Visible");
	this.visible.size.set(20, 15);
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
	this.form.addText("Static Object");
	this.static.size.set(20, 15);
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
RectAreaLightPanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
RectAreaLightPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);
	
	if(this.obj !== null)
	{
		this.color.setValue(this.obj.color.r, this.obj.color.g, this.obj.color.b);
		this.intensity.setValue(this.obj.intensity);
		this.width.setValue(this.obj.width);
		this.height.setValue(this.obj.height);
		this.visible.setValue(this.visible);
		this.static.setValue(!this.obj.matrixAutoUpdate);
	}
};
