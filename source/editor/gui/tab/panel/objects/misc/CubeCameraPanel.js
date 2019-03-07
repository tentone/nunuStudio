"use strict";

function CubeCameraPanel(parent, object)
{
	ObjectPanel.call(this, parent, object);

	var self = this;

	//Auto update
	this.form.addText(Locale.autoUpdate);
	this.autoUpdate = new CheckBox(this.form);
	this.autoUpdate.size.set(18, 18);
	this.autoUpdate.position.set(5, 85);
	this.autoUpdate.updateInterface();
	this.autoUpdate.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "autoUpdate", self.autoUpdate.getValue()));
	});
	this.form.add(this.autoUpdate);
	this.form.nextRow();

	//Resolution
	this.form.addText(Locale.resolution);
	this.resolution = new DropdownList(this.form);
	this.resolution.size.set(60, 18);
	this.resolution.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "resolution", self.resolution.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.resolution);

	for(var i = 4; i < 13; i++)
	{
		var size = Math.pow(2, i);
		this.resolution.addValue(size.toString(), size);
	}
}

CubeCameraPanel.prototype = Object.create(ObjectPanel.prototype);

CubeCameraPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);
	
	this.autoUpdate.setValue(this.object.autoUpdate);
	this.resolution.setValue(this.object.resolution);
};
