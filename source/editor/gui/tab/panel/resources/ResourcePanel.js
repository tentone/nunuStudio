"use strict";

function ResourcePanel(parent, object)
{
	Panel.call(this, parent, object);

	var self = this;

	//Name
	this.form.addText(Locale.name);
	this.name = new TextBox(this.form);
	this.name.size.set(190, 18);
	this.name.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "name", self.name.getText()));
		Editor.updateObjectsViewsGUI();
	});
	this.form.add(this.name);
	this.form.nextRow();

	//UUID
	if(Editor.settings.general.showUUID)
	{
		this.form.addText(Locale.uuid);
		this.uuid = this.form.addText("");
		this.form.nextRow();
	}
	
	//Type
	if(Editor.settings.general.showType)
	{
		this.form.addText(Locale.type);
		this.type = this.form.addText("");
		this.form.nextRow();
	}
}

ResourcePanel.prototype = Object.create(Panel.prototype);

ResourcePanel.prototype.updatePanel = function()
{
	this.name.setText(this.object.name);
		
	if(this.uuid !== undefined)
	{
		this.uuid.setText(this.object.uuid);
	}
	
	if(this.type !== undefined)
	{
		this.type.setText(this.object.type);
	}
};