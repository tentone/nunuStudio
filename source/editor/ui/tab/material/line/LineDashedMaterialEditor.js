"use strict";

function LineDashedMaterialEditor(parent, closeable, container, index)
{
	LineBasicMaterialEditor.call(this, parent, closeable, container, index);

	//Dash size
	this.form.addText("Dash size");
	this.dashSize = new NumberBox(this.form.element);
	this.dashSize.size.set(60, 18);
	this.dashSize.setRange(0, Number.MAX_SAFE_INTEGER);
	this.dashSize.setStep(1);
	this.dashSize.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.dashSize = self.dashSize.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.dashSize);
	this.form.nextRow();

	//Gap size
	this.form.addText("Gap size");
	this.gapSize = new NumberBox(this.form.element);
	this.gapSize.size.set(60, 18);
	this.gapSize.setRange(0, Number.MAX_SAFE_INTEGER);
	this.gapSize.setStep(1);
	this.gapSize.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.gapSize = self.gapSize.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.gapSize);
	this.form.nextRow();

	//Dash scale
	this.form.addText("Dash scale");
	this.dashScale = new NumberBox(this.form.element);
	this.dashScale.size.set(60, 18);
	this.dashScale.setRange(0, Number.MAX_SAFE_INTEGER);
	this.dashScale.setStep(1);
	this.dashScale.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.scale = self.dashScale.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.dashScale);
	this.form.nextRow();
}

LineDashedMaterialEditor.prototype = Object.create(LineBasicMaterialEditor.prototype);

LineDashedMaterialEditor.prototype.attach = function(material, asset)
{
	LineBasicMaterialEditor.prototype.attach.call(this, material, asset);

	this.dashSize.setValue(material.dashSize);
	this.gapSize.setValue(material.gapSize);
	this.dashScale.setValue(material.scale);
};
