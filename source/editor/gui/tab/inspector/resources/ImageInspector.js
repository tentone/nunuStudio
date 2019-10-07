"use strict";

function ImageInspector(parent, object)
{
	ResourceInspector.call(this, parent, object);

	var self = this;

	this.form.addText(Locale.image);
	this.image = new ImageChooser(this.form);
	this.image.size.set(120, 120);
	this.form.add(this.image);
	this.form.nextRow();
}

ImageInspector.prototype = Object.create(ResourceInspector.prototype);

ImageInspector.prototype.updateInspector = function()
{
	ResourceInspector.prototype.updateInspector.call(this);

	this.image.setValue(this.object);
};