"use strict";

function PointsMaterialEditor(parent, closeable, container, index)
{
	MaterialEditor.call(this, parent, closeable, container, index);

	//Points
	this.points = new THREE.Points(MaterialEditor.geometries[0][1], null);
	this.interactive.add(this.points);
	
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
		self.points.geometry = MaterialEditor.geometries[value][1];
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

	//Size
	this.form.addText("Size");
	this.pointSize = new NumberBox(this.form.element);
	this.pointSize.size.set(60, 18);
	this.pointSize.setStep(0.05);
	this.pointSize.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "size", self.pointSize.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.pointSize);
	this.form.nextRow();

	//Size atenuation
	this.form.addText("Size atenuation");
	this.sizeAttenuation = new CheckBox(this.form.element);
	this.sizeAttenuation.size.set(15, 15);
	this.sizeAttenuation.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "sizeAttenuation", self.sizeAttenuation.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.sizeAttenuation);
	this.form.nextRow();

	//Texture map
	this.form.addText("Texture map");
	this.form.nextRow();
	this.map = new TextureBox(this.form.element);
	this.map.setOnChange(function(file)
	{
		Editor.history.add(new ChangeAction(self.material, "map", self.map.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.map);
	this.form.nextRow();
}

PointsMaterialEditor.prototype = Object.create(MaterialEditor.prototype);

PointsMaterialEditor.prototype.attach = function(material, asset)
{
	MaterialEditor.prototype.attach.call(this, material, asset);

	this.points.material = material;

	this.pointSize.setValue(material.size);
	this.sizeAttenuation.setValue(material.sizeAttenuation);
	this.color.setValue(material.color.r, material.color.g, material.color.b);
	this.map.setValue(material.map);
};
