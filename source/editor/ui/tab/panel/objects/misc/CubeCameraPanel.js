"use strict";

function CubeCameraPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Auto update
	this.form.addText("Auto update");
	this.autoUpdate = new CheckBox(this.form.element);
	this.autoUpdate.size.set(15, 15);
	this.autoUpdate.position.set(5, 85);
	this.autoUpdate.updateInterface();
	this.autoUpdate.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "autoUpdate", self.autoUpdate.getValue()));
	});
	this.form.add(this.autoUpdate);
	this.form.nextRow();

	//Resolution
	this.form.addText("Resolution");
	this.resolution = new DropdownList(this.form.element);
	this.resolution.size.set(60, 18);
	this.resolution.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "resolution", self.resolution.getValue()));
		self.obj.updateShadowMap();
	});
	this.form.add(this.resolution);

	for(var i = 4; i < 13; i++)
	{
		var size = Math.pow(2, i);
		this.resolution.addValue(size.toString(), size);
	}
}

CubeCameraPanel.prototype = Object.create(Panel.prototype);

CubeCameraPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);
	
	this.autoUpdate.setValue(this.obj.autoUpdate);
	this.resolution.setValue(this.obj.resolution);
};
