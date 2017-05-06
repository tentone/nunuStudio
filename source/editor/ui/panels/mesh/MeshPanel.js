"use strict";

function MeshPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Cast shadow
	this.castShadow = new CheckBox(this.form.element);
	this.form.addText("Cast Shadow");
	this.castShadow.size.set(15, 15);
	this.castShadow.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.castShadow = self.castShadow.getValue();
		}
	});
	this.form.add(this.castShadow);
	this.form.nextRow();

	//Receive shadow
	this.receiveShadow = new CheckBox(this.form.element);
	this.form.addText("React Shadow");
	this.receiveShadow.size.set(15, 15);
	this.receiveShadow.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.receiveShadow = self.receiveShadow.getValue();
		}
	});
	this.form.add(this.receiveShadow);
	this.form.nextRow();

	//Geometry
	this.geometry = GeometryForm.create(this.form, this.obj);

	//Update form
	this.form.updateInterface();
}

//Super prototypes
MeshPanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
MeshPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);
	
	if(this.obj !== null)
	{
		if(this.geometry !== null)
		{
			this.geometry.updateValues();
		}
		
		this.castShadow.setValue(this.obj.castShadow);
		this.receiveShadow.setValue(this.obj.receiveShadow);
	}
};
