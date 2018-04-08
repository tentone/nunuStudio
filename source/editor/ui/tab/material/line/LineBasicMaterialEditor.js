"use strict";

function LineBasicMaterialEditor(parent, closeable, container, index)
{
	MaterialEditor.call(this, parent, closeable, container, index);
	
	//Line
	this.line = new THREE.LineLoop(MaterialEditor.geometries[0][1], null);
	this.interactive.add(this.line);
	
	//Test model
	this.previewForm.addText("Model");
	this.testModel = new DropdownList(this.previewForm.element);
	this.testModel.size.set(100, 18);
	for(var i = 0; i < MaterialEditor.geometries.length; i++)
	{
		this.testModel.addValue(MaterialEditor.geometries[i][0], i);
	}
	this.testModel.setOnChange(function()
	{
		var value = self.testModel.getSelectedIndex();
		self.line.geometry = MaterialEditor.geometries[value][1];
	});
	this.previewForm.add(this.testModel);
	this.previewForm.nextRow();

	var self = this;

	//Color
	this.form.addText("Color");
	this.color = new ColorChooser(this.form.element);
	this.color.size.set(100, 18);
	this.color.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "color", new THREE.Color(self.color.getValueHex())));
		self.material.needsUpdate = true;
	});
	this.form.add(this.color);
	this.form.nextRow();

	//Line width
	this.form.addText("Width");
	this.linewidth = new NumberBox(this.form.element);
	this.linewidth.size.set(60, 18);
	this.linewidth.setStep(1);
	this.linewidth.setRange(0, Number.MAX_SAFE_INTEGER);
	this.linewidth.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "linewidth", self.linewidth.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.linewidth);
	this.form.nextRow();
}

LineBasicMaterialEditor.prototype = Object.create(MaterialEditor.prototype);

LineBasicMaterialEditor.prototype.attach = function(material, asset)
{
	MaterialEditor.prototype.attach.call(this, material, asset);

	this.line.material = material;

	this.color.setValue(material.color.r, material.color.g, material.color.b);
	this.linewidth.setValue(material.linewidth);
};

LineBasicMaterialEditor.prototype.update = function()
{
	MaterialEditor.prototype.update.call(this);

	if(Editor.mouse.insideCanvas() && Editor.mouse.buttonPressed(Mouse.LEFT))
	{
		//TODO <CHANGE LINE DRAW MODE>
	}
};