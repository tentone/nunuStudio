"use strict";

function HemisphereLightPanel(parent, obj)
{
	ObjectPanel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Sky color
	this.form.addText("Sky color");
	this.color = new ColorChooser(this.form.element);
	this.color.size.set(80, 18);
	this.color.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "color", new THREE.Color(self.color.getValueHex())));
	});
	this.form.add(this.color);
	this.form.nextRow();

	//Ground color
	this.form.addText("Ground color");
	this.groundColor = new ColorChooser(this.form.element);
	this.groundColor.size.set(80, 18);
	this.groundColor.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "groundColor", new THREE.Color(self.groundColor.getValueHex())));
	});
	this.form.add(this.groundColor);
	this.form.nextRow();
}

HemisphereLightPanel.prototype = Object.create(ObjectPanel.prototype);

HemisphereLightPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);

	this.color.setValue(this.obj.color.r, this.obj.color.g, this.obj.color.b);
	this.groundColor.setValue(this.obj.groundColor.r, this.obj.groundColor.g, this.obj.groundColor.b);
};
