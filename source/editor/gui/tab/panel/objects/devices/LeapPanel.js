"use strict";

function LeapPanel(parent, object)
{
	ObjectPanel.call(this, parent, object);

	var self = this;

	//Mode
	this.form.addText("Mode");
	this.mode = new DropdownList(this.form);
	this.mode.size.set(80, 18);
	this.mode.addValue("Desk", Script.INIT);
	this.mode.addValue("HMD", Script.LOOP);
	this.mode.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object, "mode", self.mode.getSelectedIndex()));
	});
	this.form.add(this.mode);
	this.form.nextRow();

	//Debug model
	this.debugModel = new CheckBox(this.form);
	this.form.addText("Debug model");
	this.debugModel.size.set(18, 18);
	this.debugModel.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object, "debugModel", self.debugModel.getValue()));
	});
	this.form.add(this.debugModel);
	this.form.nextRow();

	//Gestures Enabled
	this.gesturesEnabled = new CheckBox(this.form);
	this.form.addText("Gestures Enabled");
	this.gesturesEnabled.size.set(18, 18);
	this.gesturesEnabled.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object, "gesturesEnabled", self.gesturesEnabled.getValue()));
	});
	this.form.add(this.gesturesEnabled);
	this.form.nextRow();

	//Poses Enabled
	this.posesEnabled = new CheckBox(this.form);
	this.form.addText("Poses Enabled");
	this.posesEnabled.size.set(18, 18);
	this.posesEnabled.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object, "posesEnabled", self.posesEnabled.getValue()));
	});
	this.form.add(this.posesEnabled);
}

LeapPanel.prototype = Object.create(ObjectPanel.prototype);

LeapPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);

	this.mode.setSelectedIndex(this.object.mode);
	this.debugModel.setValue(this.object.debugModel);
	this.gesturesEnabled.setValue(this.object.gesturesEnabled);
	this.posesEnabled.setValue(this.object.posesEnabled);
};
