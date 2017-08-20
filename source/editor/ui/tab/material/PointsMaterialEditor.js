"use strict";

function PointsMaterialEditor(parent, closeable, container, index)
{
	MaterialEditor.call(this, parent, closeable, container, index);

	//Points
	this.points = new THREE.Points(MaterialEditor.geometries[0][1], null);
	this.points.position.set(0, 0, -2.5);
	this.scene.add(this.points);
	
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
		if(self.material !== null)
		{
			self.material.color.setHex(self.color.getValueHex());
			self.material.needsUpdate = true;
		}
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
		if(self.material !== null)
		{
			self.material.size = self.pointSize.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.pointSize);
	this.form.nextRow();

	//Size atenuation
	this.form.addText("Size atenuation");
	this.sizeAttenuation = new CheckBox(this.form.element);
	this.sizeAttenuation.size.set(15, 15);
	this.sizeAttenuation.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.sizeAttenuation = self.sizeAttenuation.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.sizeAttenuation);
	this.form.nextRow();

	//Texture map
	this.form.addText("Texture map");
	this.form.nextRow();
	this.map = new TextureBox(this.form.element);
	this.map.setOnChange(function(file)
	{
		self.material.map = self.map.getValue();
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

PointsMaterialEditor.prototype.update = function()
{
	MaterialEditor.prototype.update.call(this);

	if(Editor.mouse.insideCanvas())
	{
		//Rotate object
		if(Editor.mouse.buttonPressed(Mouse.LEFT))
		{
			var delta = new THREE.Quaternion();
			delta.setFromEuler(new THREE.Euler(Editor.mouse.delta.y * 0.005, Editor.mouse.delta.x * 0.005, 0, 'XYZ'));
			this.points.quaternion.multiplyQuaternions(delta, this.points.quaternion);
		}
	}
};