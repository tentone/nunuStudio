"use strict";

function MeshMaterialEditor(parent, closeable, container, index)
{
	MaterialEditor.call(this, parent, closeable, container, index);
	
	var self = this;

	//Preview scene
	this.sky = new Sky();
	this.scene.add(this.sky);
	this.pointLight = new THREE.PointLight(0x777777);
	this.scene.add(this.pointLight);
	this.ambientLight = new THREE.AmbientLight(0x555555);
	this.scene.add(this.ambientLight);

	//Mesh
	this.mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(1, 64, 64), null);
	this.mesh.position.set(0, 0, -2.5);
	this.scene.add(this.mesh);
	
	//Test model
	this.previewForm.addText("Model");
	this.testModel = new DropdownList(this.previewForm.element);
	this.testModel.size.set(100, 18);
	this.testModel.addValue("Sphere", 0);
	this.testModel.addValue("Torus", 1);
	this.testModel.addValue("Cube", 2);
	this.testModel.addValue("Torus Knot", 3);
	this.testModel.setOnChange(function()
	{
		var value = self.testModel.getSelectedIndex();

		//Sphere
		if(value === 0)
		{
			self.mesh.geometry = new THREE.SphereBufferGeometry(1, 64, 64);
		}
		//Torus
		else if(value === 1)
		{
			self.mesh.geometry = new THREE.TorusBufferGeometry(0.8, 0.4, 32, 64);
		}
		//Cube
		else if(value === 2)
		{
			self.mesh.geometry = new THREE.BoxBufferGeometry(1, 1, 1, 32, 32, 32);
		}
		//Torus Knot
		else if(value === 3)
		{
			self.mesh.geometry = new THREE.TorusKnotBufferGeometry(0.7, 0.3, 128, 64);
		}
	});
	this.previewForm.add(this.testModel);
	this.previewForm.nextRow();

	//Sky
	this.previewForm.addText("Sky");
	this.skyEnabled = new CheckBox(this.previewForm.element);
	this.skyEnabled.size.set(15, 15);
	this.skyEnabled.setValue(true);
	this.skyEnabled.setOnChange(function()
	{
		self.sky.visible = self.skyEnabled.getValue();
	});
	this.previewForm.add(this.skyEnabled);
	this.previewForm.nextRow();

	//Point Light
	this.previewForm.addText("Point Light");
	this.lightEnabled = new CheckBox(this.previewForm.element);
	this.lightEnabled.size.set(15, 15);
	this.lightEnabled.setValue(true);
	this.lightEnabled.setOnChange(function()
	{
		self.pointLight.visible = self.lightEnabled.getValue();
	});
	this.previewForm.add(this.lightEnabled);
}

MeshMaterialEditor.prototype = Object.create(MaterialEditor.prototype)

MeshMaterialEditor.prototype.attach = function(material, asset)
{
	MaterialEditor.prototype.attach.call(this, material, asset);
	
	this.mesh.material = material;
};

MeshMaterialEditor.prototype.update = function()
{
	MaterialEditor.prototype.update.call(this);

	if(Editor.mouse.insideCanvas())
	{
		//Rotate object
		if(Editor.mouse.buttonPressed(Mouse.LEFT))
		{
			var delta = new THREE.Quaternion();
			delta.setFromEuler(new THREE.Euler(Editor.mouse.delta.y * 0.005, Editor.mouse.delta.x * 0.005, 0, 'XYZ'));
			this.mesh.quaternion.multiplyQuaternions(delta, this.mesh.quaternion);
		}
	}
};