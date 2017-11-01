"use strict";

function MeshStandardMaterialEditor(parent, closeable, container, index)
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
			Editor.history.add(new ChangeAction(self.material, "skinning", self.skinning.getValue()));
		}
	});
	this.form.add(this.skinning);
	this.form.nextRow();

	//Morph targets
	this.morphTargets = new CheckBox(this.form.element);
	this.form.addText("Morph targets");
	this.morphTargets.size.set(15, 15);
	this.morphTargets.setOnChange(function()
	{
		if(self.material !== null)
		{
			Editor.history.add(new ChangeAction(self.material, "morphTargets", self.morphTargets.getValue()));
		}
	});
	this.form.add(this.morphTargets);
	this.form.nextRow();

	//Wireframe
	this.wireframe = new CheckBox(this.form.element);
	this.form.addText("Wireframe");
	this.wireframe.size.set(15, 15);
	this.wireframe.setOnChange(function()
	{
		if(self.material !== null)
		{
			Editor.history.add(new ChangeAction(self.material, "wireframe", self.wireframe.getValue()));
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
			Editor.history.add(new ChangeAction(self.material, "flatShading", self.flatShading.getValue()));
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

	//Roughness
	this.form.addText("Roughness");
	this.roughness = new Slider(this.form.element);
	this.roughness.size.set(160, 18);
	this.roughness.setRange(0, 1);
	this.roughness.setStep(0.01);
	this.roughness.setOnChange(function()
	{
		if(self.material !== null)
		{
			Editor.history.add(new ChangeAction(self.material, "roughness", self.roughness.getValue()));
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.roughness);
	this.form.nextRow();

	//Shininess
	this.form.addText("Metalness");
	this.metalness = new Slider(this.form.element);
	this.metalness.size.set(160, 18);
	this.metalness.setRange(0, 1);
	this.metalness.setStep(0.01);
	this.metalness.setOnChange(function()
	{
		if(self.material !== null)
		{
			Editor.history.add(new ChangeAction(self.material, "metalness", self.metalness.getValue()));
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.metalness);
	this.form.nextRow();

	//Texture map
	this.form.addText("Texture map");
	this.form.nextRow();
	this.map = new TextureBox(this.form.element);
	this.map.size.set(100, 100);
	this.map.setOnChange(function(file)
	{
		Editor.history.add(new ChangeAction(self.material, "map", self.map.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.map);
	this.form.nextRow();

	//Roughness map
	this.form.addText("Roughness map");
	this.form.nextRow();
	this.roughnessMap = new TextureBox(this.form.element);
	this.roughnessMap.size.set(100, 100);
	this.roughnessMap.setOnChange(function(file)
	{
		Editor.history.add(new ChangeAction(self.material, "roughnessMap", self.roughnessMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.roughnessMap);
	this.form.nextRow();

	//Metalness map
	this.form.addText("Metalness map");
	this.form.nextRow();
	this.metalnessMap = new TextureBox(this.form.element);
	this.metalnessMap.size.set(100, 100);
	this.metalnessMap.setOnChange(function(file)
	{
		Editor.history.add(new ChangeAction(self.material, "metalnessMap", self.metalnessMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.metalnessMap);
	this.form.nextRow();

	//Bump map
	this.form.addText("Bump map");
	this.form.nextRow();
	this.bumpMap = new TextureBox(this.form.element);
	this.bumpMap.size.set(100, 100);
	this.bumpMap.setOnChange(function(file)
	{
		Editor.history.add(new ChangeAction(self.material, "bumpMap", self.bumpMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.bumpMap);
	this.form.nextRow();

	//Bump map scale
	this.form.addText("Bump Scale");
	this.bumpScale = new Slider(this.form.element);
	this.bumpScale.size.set(160, 18);
	this.bumpScale.setRange(0, 1);
	this.bumpScale.setStep(0.01);
	this.bumpScale.setOnChange(function()
	{
		if(self.material !== null)
		{
			Editor.history.add(new ChangeAction(self.material, "bumpScale", self.bumpScale.getValue()));
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.bumpScale);
	this.form.nextRow();

	//Normal map
	this.form.addText("Normal map");
	this.form.nextRow();
	this.normalMap = new TextureBox(this.form.element);
	this.normalMap.size.set(100, 100);
	this.normalMap.setOnChange(function(file)
	{
		Editor.history.add(new ChangeAction(self.material, "normalMap", self.normalMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.normalMap);
	this.form.nextRow();

	//Normal map scale
	this.form.addText("Normal Scale");
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
	this.form.addText("Displacement map");
	this.form.nextRow();
	this.displacementMap = new TextureBox(this.form.element);
	this.displacementMap.size.set(100, 100);
	this.displacementMap.setOnChange(function(file)
	{
		Editor.history.add(new ChangeAction(self.material, "displacementMap", self.displacementMap.getValue()));
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
			Editor.history.add(new ChangeAction(self.material, "displacementScale", self.displacementScale.getValue()));
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
			Editor.history.add(new ChangeAction(self.material, "displacementBias", self.displacementBias.getValue()));
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.displacementBias);
	this.form.nextRow();

	//Emissive map
	this.form.addText("Emissive map");
	this.form.nextRow();
	this.emissiveMap = new TextureBox(this.form.element);
	this.emissiveMap.size.set(100, 100);
	this.emissiveMap.setOnChange(function(file)
	{
		if(self.material !== null)
		{
			Editor.history.add(new ChangeAction(self.material, "emissiveMap", self.emissiveMap.getValue()));
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
			Editor.history.add(new ChangeAction(self.material, "emissiveIntensity", self.emissiveIntensity.getValue()));
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.emissiveIntensity);
	this.form.nextRow();

	//Alpha map
	this.form.addText("Alpha map");
	this.form.nextRow();
	this.alphaMap = new TextureBox(this.form.element);
	this.alphaMap.size.set(100, 100);
	this.alphaMap.setOnChange(function(file)
	{
		if(self.material !== null)
		{
			Editor.history.add(new ChangeAction(self.material, "alphaMap", self.alphaMap.getValue()));
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
			Editor.history.add(new ChangeAction(self.material, "envMap", self.envMap.getValue()));
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.envMap);
	this.form.nextRow();

	//Reflectivity
	this.form.addText("Intensity");
	this.envMapIntensity = new NumberBox(this.form.element);
	this.envMapIntensity.size.set(60, 18);
	this.envMapIntensity.setStep(0.05);
	this.envMapIntensity.setOnChange(function()
	{
		if(self.material !== null)
		{
			Editor.history.add(new ChangeAction(self.material, "envMapIntensity", self.envMapIntensity.getValue()));
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.envMapIntensity);
	this.form.nextRow();

	//Reflectivity
	this.form.addText("Refraction");
	this.refractionRatio = new NumberBox(this.form.element);
	this.refractionRatio.size.set(60, 18);
	this.refractionRatio.setStep(0.05);
	this.refractionRatio.setOnChange(function()
	{
		if(self.material !== null)
		{
			Editor.history.add(new ChangeAction(self.material, "refractionRatio", self.refractionRatio.getValue()));
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.refractionRatio);
	this.form.nextRow();
	
	//Ambient Occlusion map
	this.form.addText("Ambient Occlusion");
	this.form.nextRow();
	this.aoMap = new TextureBox(this.form.element);
	this.aoMap.size.set(100, 100);
	this.aoMap.setOnChange(function(file)
	{
		if(self.material !== null)
		{
			Editor.history.add(new ChangeAction(self.material, "aoMap", self.aoMap.getValue()));
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.aoMap);
	this.form.nextRow();

	//Ambient Occlusion
	this.form.addText("Intensity");
	this.aoMapIntensity = new NumberBox(this.form.element);
	this.aoMapIntensity.size.set(60, 18);
	this.aoMapIntensity.setStep(0.05);
	this.aoMapIntensity.setOnChange(function()
	{
		if(self.material !== null)
		{
			Editor.history.add(new ChangeAction(self.material, "aoMapIntensity", self.aoMapIntensity.getValue()));
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.aoMapIntensity);
	this.form.nextRow();
}

MeshStandardMaterialEditor.prototype = Object.create(MeshMaterialEditor.prototype);

MeshStandardMaterialEditor.prototype.attach = function(material, asset)
{
	MeshMaterialEditor.prototype.attach.call(this, material, asset);

	this.skinning.setValue(material.skinning);
	this.morphTargets.setValue(material.morphTargets);
	this.wireframe.setValue(material.wireframe);
	this.flatShading.setValue(material.flatShading);
	this.color.setValue(material.color.r, material.color.g, material.color.b);
	this.roughness.setValue(material.roughness);
	this.metalness.setValue(material.metalness);
	this.map.setValue(material.map);
	this.roughnessMap.setValue(material.roughnessMap);
	this.metalnessMap.setValue(material.metalnessMap);
	this.bumpMap.setValue(material.bumpMap);
	this.bumpScale.setValue(material.bumpScale);
	this.normalMap.setValue(material.normalMap);
	this.normalScale.setValue(material.normalScale.x, material.normalScale.y);
	this.displacementMap.setValue(material.displacementMap);
	this.displacementScale.setValue(material.displacementScale);
	this.displacementBias.setValue(material.displacementBias);
	this.emissive.setValue(material.emissive.r, material.emissive.g, material.emissive.b);
	this.emissiveIntensity.setValue(material.emissiveIntensity);
	this.emissiveMap.setValue(material.emissiveMap);
	this.alphaMap.setValue(material.alphaMap);
	this.envMap.setValue(material.envMap);
	this.envMapIntensity.setValue(material.envMapIntensity);
	this.refractionRatio.setValue(material.refractionRatio);
	this.aoMap.setValue(material.aoMap);
	this.aoMapIntensity.setValue(material.aoMapIntensity);
};
