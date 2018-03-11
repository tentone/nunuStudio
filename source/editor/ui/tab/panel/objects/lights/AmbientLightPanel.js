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
		Editor.history.add(new ChangeAction(self.obj, "color", new THREE.Color(self.color.getValueHex())));
	});
	this.form.add(this.color);
	this.form.nextRow();
}

AmbientLightPanel.prototype = Object.create(Panel.prototype);

AmbientLightPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);
	
	this.color.setValue(this.obj.color.r, this.obj.color.g, this.obj.color.b);
};
