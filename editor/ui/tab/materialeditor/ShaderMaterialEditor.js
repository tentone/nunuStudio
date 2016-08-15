"use strict";

function ShaderMaterialEditor(parent)
{
	MaterialEditor.call(this, parent);

	var self = this;

	//TODO <ADD CODE HERE>

	this.form.updateInterface();
}

ShaderMaterialEditor.prototype = Object.create(MaterialEditor.prototype);
ShaderMaterialEditor.prototype.attachMaterial = attachMaterial;

function attachMaterial(material, material_file)
{
	MaterialEditor.prototype.attachMaterial.call(this, material, material_file);

	//TODO <ADD CODE HERE>
}
