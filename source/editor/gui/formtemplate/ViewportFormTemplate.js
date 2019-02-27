"use strict";

/** 
 * Viewport object form template.
 *
 * @class ViewportFormTemplate
 */
function ViewportFormTemplate(form, object)
{
	FormTemplate.call(this, form, object);

	var self = this;
	
	//Offset
	this.form.addText(Locale.position);
	this.offset = new VectorBox(this.form);
	this.offset.setType(VectorBox.VECTOR2);
	this.offset.setStep(0.05);
	this.offset.size.set(160, 18);
	this.offset.setOnChange(function()
	{	
		var value = self.offset.getValue();
		Editor.addAction(new ActionBundle(
		[
			new ChangeAction(self.object.offset, "x", value.x),
			new ChangeAction(self.object.offset, "y", value.y)
		]));
	});
	this.form.add(this.offset);
	this.form.nextRow();

	//Size
	this.form.addText(Locale.size);
	this.sizeBox = new VectorBox(this.form);
	this.sizeBox.setType(VectorBox.VECTOR2);
	this.sizeBox.setStep(0.05);
	this.sizeBox.size.set(160, 18);
	this.sizeBox.setOnChange(function()
	{
		var value = self.sizeBox.getValue();
		Editor.addAction(new ActionBundle(
		[
			new ChangeAction(self.object.size, "x", value.x),
			new ChangeAction(self.object.size, "y", value.y)
		]));
	});
	this.form.add(this.sizeBox);
	this.form.nextRow();

	this.form.addText(Locale.mode);
	this.modeDrop = new DropdownList(this.form);
	this.modeDrop.size.set(0, 18);
	this.modeDrop.addValue(Locale.relative, Viewport.RELATIVE);
	this.modeDrop.addValue(Locale.absolute, Viewport.ABSOLUTE);
	this.modeDrop.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "mode", self.modeDrop.getValue()));
	});
	this.form.add(this.modeDrop);
	this.form.nextRow();

	this.form.addText(Locale.anchor);
	this.anchor = new DropdownList(this.form);
	this.anchor.size.set(0, 18);
	this.anchor.addValue(Locale.bottomRight, Viewport.BOTTOM_RIGHT);
	this.anchor.addValue(Locale.bottomLeft, Viewport.BOTTOM_LEFT);
	this.anchor.addValue(Locale.topRight, Viewport.TOP_RIGHT);
	this.anchor.addValue(Locale.topLeft, Viewport.TOP_LEFT);
	this.anchor.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "anchor", self.anchor.getValue()));
	});
	this.form.add(this.anchor);
	this.form.nextRow();
}

ViewportFormTemplate.prototype = Object.create(FormTemplate.prototype);

ViewportFormTemplate.prototype.updateValues = function()
{
	this.offset.setValue(this.object.offset);
	this.sizeBox.setValue(this.object.size);
	this.modeDrop.setValue(this.object.mode);
	this.anchor.setValue(this.object.anchor);
};
