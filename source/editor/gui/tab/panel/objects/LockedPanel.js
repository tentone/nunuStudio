"use strict";

function LockedPanel(parent, object)
{
	Panel.call(this, parent, object);

	//Name
	this.form.addText("Name");
	this.name = this.form.addText("");
	this.form.nextRow();

	//Type
	if(Editor.settings.general.showType)
	{
		this.form.addText("Type");
		this.type = this.form.addText("");
		this.form.nextRow();
	}

	//UUID
	if(Editor.settings.general.showUUID)
	{
		this.form.addText("UUID");
		this.uuid = this.form.addText("");
		this.form.nextRow();
	}
}

LockedPanel.prototype = Object.create(Panel.prototype);

//Update panel information
LockedPanel.prototype.updatePanel = function()
{
	this.name.setText(this.object.name);
	
	if(this.type !== undefined)
	{
		this.type.setText(this.object.type);
	}

	if(this.uuid !== undefined)
	{
		this.uuid.setText(this.object.uuid);
	}
};