"use strict";

function ObjectPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Cast shadow
	this.castShadow = new CheckBox(this.form.element);
	this.form.addText("Cast Shadow");
	this.castShadow.size.set(15, 15);
	this.castShadow.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "castShadow", self.castShadow.getValue()));
	});
	this.form.add(this.castShadow);
	this.form.nextRow();

	//Receive shadow
	this.receiveShadow = new CheckBox(this.form.element);
	this.form.addText("React Shadow");
	this.receiveShadow.size.set(15, 15);
	this.receiveShadow.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "receiveShadow", self.receiveShadow.getValue()));
	});
	this.form.add(this.receiveShadow);
	this.form.nextRow();
}

//Super prototypes
ObjectPanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
ObjectPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);

	this.castShadow.setValue(this.obj.castShadow);
	this.receiveShadow.setValue(this.obj.receiveShadow);
};
