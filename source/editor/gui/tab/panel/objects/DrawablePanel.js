"use strict";

function DrawablePanel(parent, object)
{
	ObjectPanel.call(this, parent, object);

	var self = this;

	//Cast shadow
	this.form.addText("Cast Shadow");
	this.castShadow = new CheckBox(this.form);
	this.castShadow.size.set(18, 18);
	this.castShadow.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "castShadow", self.castShadow.getValue()));
	});
	this.form.add(this.castShadow);
	this.form.nextRow();

	//Receive shadow
	this.form.addText("React Shadow");
	this.receiveShadow = new CheckBox(this.form);
	this.receiveShadow.size.set(18, 18);
	this.receiveShadow.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "receiveShadow", self.receiveShadow.getValue()));
	});
	this.form.add(this.receiveShadow);
	this.form.nextRow();

	//Frustum culled
	this.form.addText("Frustum Culled");
	this.frustumCulled = new CheckBox(this.form);
	this.frustumCulled.size.set(18, 18);
	this.frustumCulled.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "frustumCulled", self.frustumCulled.getValue()));
	});
	this.form.add(this.frustumCulled);
	this.form.nextRow();
}

DrawablePanel.prototype = Object.create(ObjectPanel.prototype);

DrawablePanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);

	this.castShadow.setValue(this.object.castShadow);
	this.receiveShadow.setValue(this.object.receiveShadow);
	this.frustumCulled.setValue(this.object.frustumCulled);
};
