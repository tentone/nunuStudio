"use strict";

function AmbientLightPanel(parent, object)
{
	ObjectPanel.call(this, parent, object);

	var self = this;

	//Color
	this.form.addText("Color");
	this.color = new ColorChooser(this.form);
	this.color.size.set(80, 18);
	this.color.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "color", new THREE.Color(self.color.getValueHex())));
	});
	this.form.add(this.color);
	this.form.nextRow();
}

AmbientLightPanel.prototype = Object.create(ObjectPanel.prototype);

AmbientLightPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);
	
	this.color.setValue(this.object.color.r, this.object.color.g, this.object.color.b);
};
