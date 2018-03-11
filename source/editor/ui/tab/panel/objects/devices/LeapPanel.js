"use strict";

function LeapPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Mode
	this.form.addText("Mode");
	this.mode = new DropdownList(this.form.element);
	this.mode.size.set(80, 18);
	this.mode.addValue("Desk", Script.INIT);
	this.mode.addValue("HMD", Script.LOOP);
	this.mode.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "mode", self.mode.getSelectedIndex()));
	});
	this.form.add(this.mode);
	this.form.nextRow();

	//Debug model
	this.debugModel = new CheckBox(this.form.element);
	this.form.addText("Debug model");
	this.debugModel.size.set(15, 15);
	this.debugModel.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "debugModel", self.debugModel.getValue()));
	});
	this.form.add(this.debugModel);
	this.form.nextRow();

	//Gestures Enabled
	this.gesturesEnabled = new CheckBox(this.form.element);
	this.form.addText("Gestures Enabled");
	this.gesturesEnabled.size.set(15, 15);
	this.gesturesEnabled.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "gesturesEnabled", self.gesturesEnabled.getValue()));
	});
	this.form.add(this.gesturesEnabled);
	this.form.nextRow();

	//Poses Enabled
	this.posesEnabled = new CheckBox(this.form.element);
	this.form.addText("Poses Enabled");
	this.posesEnabled.size.set(15, 15);
	this.posesEnabled.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "posesEnabled", self.posesEnabled.getValue()));
	});
	this.form.add(this.posesEnabled);
}

LeapPanel.prototype = Object.create(Panel.prototype);

LeapPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);

	this.mode.setSelectedIndex(this.obj.mode);
	this.debugModel.setValue(this.obj.debugModel);
	this.gesturesEnabled.setValue(this.obj.gesturesEnabled);
	this.posesEnabled.setValue(this.obj.posesEnabled);
};
