"use strict";

function DrawablePanel(parent, obj)
{
	ObjectPanel.call(this, parent, obj);

	var self = this;

	//Cast shadow
	this.form.addText("Cast Shadow");
	this.castShadow = new CheckBox(this.form);
	this.castShadow.size.set(18, 18);
	this.castShadow.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "castShadow", self.castShadow.getValue()));
	});
	this.form.add(this.castShadow);
	this.form.nextRow();

	//Receive shadow
	this.form.addText("React Shadow");
	this.receiveShadow = new CheckBox(this.form);
	this.receiveShadow.size.set(18, 18);
	this.receiveShadow.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "receiveShadow", self.receiveShadow.getValue()));
	});
	this.form.add(this.receiveShadow);
	this.form.nextRow();

	//Frustum culled
	this.form.addText("Frustum Culled");
	this.frustumCulled = new CheckBox(this.form);
	this.frustumCulled.size.set(18, 18);
	this.frustumCulled.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "frustumCulled", self.frustumCulled.getValue()));
	});
	this.form.add(this.frustumCulled);
	this.form.nextRow();
}

DrawablePanel.prototype = Object.create(ObjectPanel.prototype);

DrawablePanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);

	this.castShadow.setValue(this.obj.castShadow);
	this.receiveShadow.setValue(this.obj.receiveShadow);
	this.frustumCulled.setValue(this.obj.frustumCulled);
};
