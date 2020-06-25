"use strict";

function DrawableInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;

	// Cast shadow
	this.form.addText(Locale.castShadows);
	this.castShadow = new CheckBox(this.form);
	this.castShadow.size.set(18, 18);
	this.castShadow.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "castShadow", self.castShadow.getValue()));
	});
	this.form.add(this.castShadow);
	this.form.nextRow();

	// Receive shadow
	this.form.addText(Locale.receiveShadows);
	this.receiveShadow = new CheckBox(this.form);
	this.receiveShadow.size.set(18, 18);
	this.receiveShadow.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "receiveShadow", self.receiveShadow.getValue()));
	});
	this.form.add(this.receiveShadow);
	this.form.nextRow();

	// Frustum culled
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

DrawableInspector.prototype = Object.create(ObjectInspector.prototype);

DrawableInspector.prototype.updateInspector = function()
{
	ObjectInspector.prototype.updateInspector.call(this);

	this.castShadow.setValue(this.object.castShadow);
	this.receiveShadow.setValue(this.object.receiveShadow);
	this.frustumCulled.setValue(this.object.frustumCulled);
};
