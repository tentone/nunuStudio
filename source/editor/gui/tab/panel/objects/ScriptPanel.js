"use strict";

function ScriptPanel(parent, obj)
{
	ObjectPanel.call(this, parent, obj);

	var self = this;

	this.form.addText("Library Mode");
	this.mode = new DropdownList(this.form);
	this.mode.size.set(100, 18);
	this.mode.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "mode", self.mode.getValue()));
	});
	this.mode.addValue("Evaluate", Script.EVALUATE);
	this.mode.addValue("Append", Script.APPEND);
	this.mode.addValue("Include", Script.INCLUDE);
	this.form.add(this.mode);
	this.form.nextRow();
}

ScriptPanel.prototype = Object.create(ObjectPanel.prototype);

ScriptPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);
	
	this.mode.setValue(this.obj.mode);
};
