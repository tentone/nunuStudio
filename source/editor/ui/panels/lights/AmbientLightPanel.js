"use strict";

function AmbientLightPanel(parent, obj)
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
			Editor.history.add(new ChangeAction(self.obj, "color", new THREE.Color(self.color.getValueHex())));
		}
	});
	this.form.add(this.color);
	this.form.nextRow();

	//Update form
	this.form.updateInterface();
}

AmbientLightPanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
AmbientLightPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);
	
	if(this.obj !== null)
	{
		this.color.setValue(this.obj.color.r, this.obj.color.g, this.obj.color.b);
	}
};
