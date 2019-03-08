"use strict";

function HemisphereLightPanel(parent, object)
{
	ObjectPanel.call(this, parent, object);

	var self = this;

	//Sky color
	this.form.addText(Locale.skyColor);
	this.color = new ColorChooser(this.form);
	this.color.size.set(80, 18);
	this.color.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "color", new THREE.Color(self.color.getValueHex())));
	});
	this.form.add(this.color);
	this.form.nextRow();

	//Ground color
	this.form.addText(Locale.groundColor);
	this.groundColor = new ColorChooser(this.form);
	this.groundColor.size.set(80, 18);
	this.groundColor.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "groundColor", new THREE.Color(self.groundColor.getValueHex())));
	});
	this.form.add(this.groundColor);
	this.form.nextRow();
}

HemisphereLightPanel.prototype = Object.create(ObjectPanel.prototype);

HemisphereLightPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);

	this.color.setValue(this.object.color.r, this.object.color.g, this.object.color.b);
	this.groundColor.setValue(this.object.groundColor.r, this.object.groundColor.g, this.object.groundColor.b);
};
