"use strict";

function CubeCameraPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Resolution
	this.form.addText("Resolution");
	this.resolution = new DropdownList(this.form.element);
	this.resolution.size.set(60, 18);
	this.resolution.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.resolution = self.resolution.getValue();
			self.obj.updateShadowMap();
		}
	});
	this.form.add(this.resolution);

	for(var i = 4; i < 13; i++)
	{
		var size = Math.pow(2, i);
		this.resolution.addValue(size.toString(), size);
	}

	//Update form
	this.form.updateInterface();
}

CubeCameraPanel.prototype = Object.create(Panel.prototype);

CubeCameraPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);
	
	if(this.obj !== null)
	{
		this.resolution.setValue(this.obj.resolution);
	}
};
