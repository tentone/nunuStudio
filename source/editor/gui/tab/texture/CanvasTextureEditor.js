"use strict";

function CanvasTextureEditor(parent, closeable, container, index)
{
	TextureEditor.call(this, parent, closeable, container, index);

	var self = this;

	// Width
	this.form.addText(Locale.width);
	this.width = new DropdownList(this.form);
	this.width.size.set(120, 18);
	this.width.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.texture, "width", self.width.getValue()));
		self.texture.updateSize();
		self.updatePreview();
	});
	this.form.add(this.width);
	this.form.nextRow();

	// Height
	this.form.addText(Locale.height);
	this.height = new DropdownList(this.form);
	this.height.size.set(120, 18);
	this.height.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.texture, "height", self.height.getValue()));
		self.texture.updateSize();
		self.updatePreview();
	});
	this.form.add(this.height);
	this.form.nextRow();

	// Size options
	for(var i = 3; i < 13; i++)
	{
		var size = Math.pow(2, i);
		this.width.addValue(size, size);
		this.height.addValue(size, size);
	}
}

CanvasTextureEditor.prototype = Object.create(TextureEditor.prototype);

CanvasTextureEditor.prototype.attach = function(texture)
{
	TextureEditor.prototype.attach.call(this, texture);

	this.width.setValue(this.texture.width);
	this.height.setValue(this.texture.height);
};
