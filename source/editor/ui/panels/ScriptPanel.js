"use strict";

function ScriptPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	var self = this;

	this.form.addText("Library Mode");
	this.mode = new DropdownList(this.form.element);
	this.mode.size.set(100, 18);
	this.mode.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "mode", self.mode.getValue()));
	});
	this.mode.addValue("Evaluate", Script.EVALUATE);
	this.mode.addValue("Append", Script.APPEND);
	this.form.add(this.mode);
	this.form.nextRow();
}

ScriptPanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
ScriptPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);
	
	this.mode.setValue(this.obj.mode);
};
