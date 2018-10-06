"use strict";

function KinectPanel(parent, object)
{
	ObjectPanel.call(this, parent, object);

	var self = this;

	//Debug model
	this.debugModel = new CheckBox(this.form);
	this.form.addText("Debug model");
	this.debugModel.size.set(18, 18);
	this.debugModel.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "debugModel", self.debugModel.getValue()));
	});
	this.form.add(this.debugModel);
}

KinectPanel.prototype = Object.create(ObjectPanel.prototype);

KinectPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);
	
	this.debugModel.setValue(this.object.debugModel);
};
