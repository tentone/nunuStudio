"use strict";

function KinectPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Debug model
	this.debugModel = new CheckBox(this.form.element);
	this.form.addText("Debug model");
	this.debugModel.size.set(15, 15);
	this.debugModel.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "debugModel", self.debugModel.getValue()));
	});
	this.form.add(this.debugModel);

}

KinectPanel.prototype = Object.create(Panel.prototype);

KinectPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);
	
	this.debugModel.setValue(this.obj.debugModel);
};
