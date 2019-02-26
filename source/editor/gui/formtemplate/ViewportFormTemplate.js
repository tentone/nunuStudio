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
	this.viewport = new VectorBox(this.form);
	this.viewport.setType(VectorBox.VECTOR2);
	this.viewport.setStep(0.05);
	this.viewport.size.set(160, 18);
	this.viewport.setOnChange(function()
	{
		var value = self.viewport.getValue();
		Editor.addAction(new ActionBundle(
		[
			new ChangeAction(self.object.size, "x", value.x),
			new ChangeAction(self.object.size, "y", value.y)
		]));
	});
	this.form.add(this.viewport);
	this.form.nextRow();
}

ViewportFormTemplate.prototype = Object.create(FormTemplate.prototype);

ViewportFormTemplate.prototype.updateValues = function()
{
	this.offset.setValue(this.object.offset);
	this.viewport.setValue(this.object.size);
};