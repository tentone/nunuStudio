"use strict";

function KinectPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Debug model
	this.debug_model = new CheckBox(this.form.element);
	this.debug_model.setText("Debug model");
	this.debug_model.size.set(200, 15);
	this.debug_model.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.debug_model = self.debug_model.getValue();
		}
	});
	this.form.add(this.debug_model);

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
		this.debug_model.setValue(this.obj.debug_model);
	}
}
