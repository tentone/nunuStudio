"use strict";

function KinectPanel(parent, obj)
{
	ObjectPanel.call(this, parent, obj);

	var self = this;

	//Debug model
	this.debugModel = new CheckBox(this.form);
	this.form.addText("Debug model");
	this.debugModel.size.set(18, 18);
	this.debugModel.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "debugModel", self.debugModel.getValue()));
	});
	this.form.add(this.debugModel);
}

KinectPanel.prototype = Object.create(ObjectPanel.prototype);

KinectPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);
	
	this.debugModel.setValue(this.obj.debugModel);
};
