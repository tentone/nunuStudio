"use strict";

function MeshPhongMaterialEditor(parent, closeable, container, index)
{
	MeshMaterialEditor.call(this, parent, closeable, container, index);

	var self = this;

	//Skinning
	this.skinning = new CheckBox(this.form.element);
	this.form.addText("Skinning");
	this.skinning.size.set(15, 15);
	this.skinning.updateInterface();
	this.skinning.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.skinning = self.skinning.getValue();
		}
	});
	this.form.add(this.skinning);
	this.form.nextRow();

	//Morph targets
	this.morphTargets = new CheckBox(this.form.element);
	this.form.addText("Morph targets");
	this.morphTargets.size.set(15, 15);
	this.morphTargets.updateInterface();
	this.morphTargets.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.morphTargets = self.morphTargets.getValue();
		}
	});
	this.form.add(this.morphTargets);
	this.form.nextRow();

	//Wireframe
	this.wireframe = new CheckBox(this.form.element);
	this.form.addText("Wireframe");
	this.wireframe.size.set(15, 15);
	this.wireframe.updateInterface();
	this.wireframe.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.wireframe = self.wireframe.getValue();
		}
	});
	this.form.add(this.wireframe);
	this.form.nextRow();

	//Shading mode
	this.form.addText("Shading");
	this.flatShading = new DropdownList(this.form.element);
	this.flatShading.position.set(100, 85);
	this.flatShading.size.set(100, 18);
	this.flatShading.addValue("Smooth", false);
	this.flatShading.addValue("Flat", true);
	this.flatShading.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.flatShading = self.flatShading.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.flatShading);
	this.form.nextRow();
	
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

	//Specular color
	this.form.addText("Specular");
	this.specular = new ColorChooser(this.form.element);
	this.specular.size.set(100, 18);
	this.specular.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.specular.setHex(self.specular.getValueHex());
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.specular);
	this.form.nextRow();

	//Shininess
	this.form.addText("Shininess");
	this.shininess = new Slider(this.form.element);
	this.shininess.size.set(160, 18);
	this.shininess.setRange(0, 250);
	this.shininess.setStep(0.1);
	this.shininess.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.shininess = self.shininess.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.shininess);
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

	//Bump map
	this.form.addText("Bump map");
	this.form.nextRow();
	this.bumpMap = new TextureBox(this.form.element);
	this.bumpMap.setOnChange(function(file)
	{
		self.material.bumpMap = self.bumpMap.getValue();
		self.material.needsUpdate = true;
	});
	this.form.add(this.bumpMap);
	this.form.nextRow();

	//Bump scale
	this.form.addText("Scale");
	this.bumpScale = new Slider(this.form.element);
	this.bumpScale.size.set(160, 18);
	this.bumpScale.setRange(0, 1);
	this.bumpScale.setStep(0.01);
	this.bumpScale.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.bumpScale = self.bumpScale.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.bumpScale);
	this.form.nextRow();

	//Normal map
	this.form.addText("Normal map");
	this.form.nextRow();
	this.normalMap = new TextureBox(this.form.element);
	this.normalMap.setOnChange(function(file)
	{
		self.material.normalMap = self.normalMap.getValue();
		self.material.needsUpdate = true;
	});
	this.form.add(this.normalMap);
	this.form.nextRow();

	//Normal map scale
	this.form.addText("Normal scale");
	this.normalScale = new CoordinatesBox(this.form.element);
	this.normalScale.setMode(CoordinatesBox.VECTOR2);
	this.normalScale.setValue(1, 1, 0);
	this.normalScale.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.normalScale.copy(self.normalScale.getValue());
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.normalScale);
	this.form.nextRow();

	//Displacement map
	this.form.addText("Displacement Map");
	this.form.nextRow();
	this.displacementMap = new TextureBox(this.form.element);
	this.displacementMap.setOnChange(function(file)
	{
		self.material.displacementMap = self.displacementMap.getValue();
		self.material.needsUpdate = true;
	});
	this.children.push(this.displacementMap);
	this.form.add(this.displacementMap);
	this.form.nextRow();

	//Displacement map scale
	this.form.addText("Scale");
	this.displacementScale = new NumberBox(this.form.element);
	this.displacementScale.size.set(60, 18);
	this.displacementScale.setStep(0.05);
	this.displacementScale.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.displacementScale = self.displacementScale.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.displacementScale);
	this.form.nextRow();

	//Displacement map bias
	this.form.addText("Bias");
	this.displacementBias = new NumberBox(this.form.element);
	this.displacementBias.size.set(60, 18);
	this.displacementBias.setStep(0.1);
	this.displacementBias.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.displacementBias = self.displacementBias.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.displacementBias);
	this.form.nextRow();

	//Specular map
	this.form.addText("Specular map");
	this.form.nextRow();
	this.specularMap = new TextureBox(this.form.element);
	this.specularMap.setOnChange(function(file)
	{
		if(self.material !== null)
		{
			self.material.specularMap = self.specularMap.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.specularMap);
	this.form.nextRow();

	//Emissive map
	this.form.addText("Emissive map");
	this.form.nextRow();
	this.emissiveMap = new TextureBox(this.form.element);
	this.emissiveMap.setOnChange(function(file)
	{
		if(self.material !== null)
		{
			self.material.emissiveMap = self.emissiveMap.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.emissiveMap);
	this.form.nextRow();

	//Emissive color
	this.form.addText("Color");
	this.emissive = new ColorChooser(this.form.element);
	this.emissive.size.set(100, 18);
	this.emissive.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.emissive.setHex(self.emissive.getValueHex());
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.emissive);
	this.form.nextRow();

	//Emissive intensity
	this.form.addText("Intensity");
	this.emissiveIntensity = new NumberBox(this.form.element);
	this.emissiveIntensity.size.set(60, 18);
	this.emissiveIntensity.setStep(0.1);
	this.emissiveIntensity.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.emissiveIntensity = self.emissiveIntensity.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.emissiveIntensity);
	this.form.nextRow();

	//Alpha map
	this.form.addText("Alpha map");
	this.form.nextRow();
	this.alphaMap = new TextureBox(this.form.element);
	this.alphaMap.setOnChange(function(file)
	{
		if(self.material !== null)
		{
			self.material.alphaMap = self.alphaMap.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.alphaMap);
	this.form.nextRow();

	//Environment map
	this.form.addText("Environment map");
	this.form.nextRow();
	this.envMap = new CubeTextureBox(this.form.element);
	this.envMap.size.set(100, 100);
	this.envMap.setOnChange(function(file)
	{
		if(self.material !== null)
		{
			self.material.envMap = self.envMap.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.envMap);
	this.form.nextRow();

	//Combine environment map
	this.form.addText("Mode");
	this.combine = new DropdownList(this.form.element);
	this.combine.position.set(100, 85);
	this.combine.size.set(120, 18);
	this.combine.addValue("Multiply", THREE.MultiplyOperation);
	this.combine.addValue("Mix", THREE.MixOperation);
	this.combine.addValue("Add", THREE.AddOperation);
	this.combine.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.combine = self.combine.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.combine);
	this.form.nextRow();

	//Reflectivity
	this.form.addText("Reflectivity");
	this.reflectivity = new NumberBox(this.form.element);
	this.reflectivity.size.set(60, 18);
	this.reflectivity.setStep(0.05);
	this.reflectivity.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.reflectivity = self.reflectivity.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.reflectivity);
	this.form.nextRow();

	//Refraction
	this.form.addText("Refraction Ratio");
	this.refractionRatio = new NumberBox(this.form.element);
	this.refractionRatio.size.set(60, 18);
	this.refractionRatio.setStep(0.05);
	this.refractionRatio.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.refractionRatio = self.refractionRatio.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.refractionRatio);
}

MeshPhongMaterialEditor.prototype = Object.create(MeshMaterialEditor.prototype);

MeshPhongMaterialEditor.prototype.attach = function(material, asset)
{
	MeshMaterialEditor.prototype.attach.call(this, material, asset);

	this.skinning.setValue(material.skinning);
	this.morphTargets.setValue(material.morphTargets);
	this.wireframe.setValue(material.wireframe);
	this.flatShading.setValue(material.flatShading);
	this.color.setValue(material.color.r, material.color.g, material.color.b);
	this.specular.setValue(material.specular.r, material.specular.g, material.specular.b);
	this.shininess.setValue(material.shininess);
	this.map.setValue(material.map);
	this.bumpMap.setValue(material.bumpMap);
	this.bumpScale.setValue(material.bumpScale);
	this.normalMap.setValue(material.normalMap);
	this.normalScale.setValue(material.normalScale.x, material.normalScale.y);
	this.displacementMap.setValue(material.displacementMap);
	this.displacementScale.setValue(material.displacementScale);
	this.displacementBias.setValue(material.displacementBias);
	this.specularMap.setValue(material.specularMap);
	this.emissive.setValue(material.emissive.r, material.emissive.g, material.emissive.b);
	this.emissiveIntensity.setValue(material.emissiveIntensity);
	this.emissiveMap.setValue(material.emissiveMap);
	this.alphaMap.setValue(material.alphaMap);
	this.envMap.setValue(material.envMap);
	this.combine.setValue(material.combine);
	this.reflectivity.setValue(material.reflectivity || 0);
	this.refractionRatio.setValue(material.refractionRatio || 0);
};
