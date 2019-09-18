"use strict";

function ScriptInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;

	this.form.addText("Library Mode");
	this.mode = new DropdownList(this.form);
	this.mode.size.set(100, 18);
	this.mode.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "mode", self.mode.getValue()));
	});
	this.mode.addValue("Evaluate", Script.EVALUATE);
	this.mode.addValue("Append", Script.APPEND);
	this.mode.addValue("Include", Script.INCLUDE);
	this.form.add(this.mode);
	this.form.nextRow();
}

ScriptInspector.prototype = Object.create(ObjectInspector.prototype);

ScriptInspector.prototype.updateInspector = function()
{
	ObjectInspector.prototype.updateInspector.call(this);
	
	this.mode.setValue(this.object.mode);
};
