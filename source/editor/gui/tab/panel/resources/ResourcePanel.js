"use strict";

function ResourcePanel(parent, obj)
{
	Panel.call(this, parent, obj);

	var self = this;

	//Name
	this.form.addText("Name");
	this.name = new TextBox(this.form.element);
	this.name.size.set(190, 18);
	this.name.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "name", self.name.getText()));
		Editor.updateObjectsViewsGUI();
	});
	this.form.add(this.name);
	this.form.nextRow();

	//UUID
	if(Editor.settings.general.showUUID)
	{
		this.form.addText("UUID");
		this.uuid = this.form.addText("");
		this.form.nextRow();
	}
	
	//Type
	if(Editor.settings.general.showType)
	{
		this.form.addText("Type");
		this.type = this.form.addText("");
		this.form.nextRow();
	}
}

ResourcePanel.prototype = Object.create(Panel.prototype);

ResourcePanel.prototype.updatePanel = function()
{
	this.name.setText(this.obj.name);
		
	if(this.uuid !== undefined)
	{
		this.uuid.setText(this.obj.uuid);
	}
	
	if(this.type !== undefined)
	{
		this.type.setText(this.obj.type);
	}
};