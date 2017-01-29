"use strict";

function ShaderMaterialEditor(parent)
{
	MaterialEditor.call(this, parent);

	var self = this;

	//Wireframe
	this.wireframe = new CheckBox(this.form.element);
	this.form.addText("Wireframe");
	this.wireframe.size.set(200, 15);
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

	//Fragment shaders
	this.form.addText("Fragment shader");
	this.form.nextRow();
	this.fragmentShader = new CodeEditor(this.form.element);
	this.fragmentShader.setMode("glsl");
	this.fragmentShader.size.set(350, 250);
	this.fragmentShader.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.fragmentShader = self.fragmentShader.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.fragmentShader);
	this.form.nextRow();

	//Vertex shaders
	this.form.addText("Vertex shader");
	this.form.nextRow();
	this.vertexShader = new CodeEditor(this.form.element);
	this.vertexShader.setMode("glsl");
	this.vertexShader.size.set(350, 200);
	this.vertexShader.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.vertexShader = self.vertexShader.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.vertexShader);
	this.form.nextRow();

	this.form.updateInterface();
}

ShaderMaterialEditor.prototype = Object.create(MaterialEditor.prototype);

ShaderMaterialEditor.prototype.attachMaterial = function(material, material_file)
{
	MaterialEditor.prototype.attachMaterial.call(this, material, material_file);

	this.wireframe.setValue(material.wireframe);
	this.fragmentShader.setValue(material.fragmentShader);
	this.vertexShader.setValue(material.vertexShader);
}
