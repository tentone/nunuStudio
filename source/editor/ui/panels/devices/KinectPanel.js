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
		if(self.obj !== null)
		{
			Editor.history.add(new ChangeAction(self.obj, "debugModel", self.debugModel.getValue()));
		}
	});
	this.form.add(this.debugModel);

	//Update form
	this.form.updateInterface();
}

//Super prototypes
KinectPanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
KinectPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);
	
	if(this.obj !== null)
	{
		this.debugModel.setValue(this.obj.debugModel);
	}
};
