"use strict";

function CanvasTextureEditor(parent, closeable, container, index)
{
	TextureEditor.call(this, parent, closeable, container, index);

	var self = this;

	//Width
	this.form.addText("Width");
	this.width = new DropdownList(this.form.element);
	this.width.size.set(120, 18);
	this.width.setOnChange(function()
	{
		if(self.texture !== null)
		{
			Editor.history.add(new ChangeAction(self.texture, "width", self.width.getValue()));
			self.texture.updateSize();
			self.updatePreview();
		}
	});
	this.form.add(this.width);
	this.form.nextRow();

	//Height
	this.form.addText("Height");
	this.height = new DropdownList(this.form.element);
	this.height.size.set(120, 18);
	this.height.setOnChange(function()
	{
		if(self.texture !== null)
		{
			Editor.history.add(new ChangeAction(self.texture, "height", self.height.getValue()));
			self.texture.updateSize();
			self.updatePreview();
		}
	});
	this.form.add(this.height);
	this.form.nextRow();

	//Size options
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
