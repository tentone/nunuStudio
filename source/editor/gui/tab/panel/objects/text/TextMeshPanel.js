"use strict";

function TextMeshPanel(parent, object)
{
	DrawablePanel.call(this, parent, object);

	var self = this;

	function updateGeometry()
	{
		self.object.updateGeometry();
	}

	//Text
	this.form.addText("Text");
	this.text = new TextArea(this.form);
	this.text.size.set(190, 36);
	this.text.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "text", self.text.getText()), updateGeometry));
	});
	this.form.add(this.text);
	this.form.nextRow();

	//Size
	this.form.addText("Size");
	this.textSize = new NumberBox(this.form);
	this.textSize.size.set(60, 18);
	this.textSize.setRange(0, Number.MAX_SAFE_INTEGER);
	this.textSize.setStep(0.1);
	this.textSize.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "size", self.textSize.getValue()), updateGeometry));
	});
	this.form.add(this.textSize);
	this.form.nextRow();

	//Extruded
	this.extruded = new CheckBox(this.form);
	this.form.addText("Extruded");
	this.extruded.size.set(18, 18);
	this.extruded.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "extruded", self.extruded.getValue()), updateGeometry));
	});
	this.form.add(this.extruded);
	this.form.nextRow();

	//Height
	this.form.addText("Thickness");
	this.height = new NumberBox(this.form);
	this.height.size.set(60, 18);
	this.height.setRange(0, Number.MAX_SAFE_INTEGER);
	this.height.setStep(0.1);
	this.height.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "height", self.height.getValue()), updateGeometry));
	});
	this.form.add(this.height);
	this.form.nextRow();

	//Curve segments
	this.form.addText("Curve Detail");
	this.curveSegments = new NumberBox(this.form);
	this.curveSegments.size.set(60, 18);
	this.curveSegments.setRange(0, Number.MAX_SAFE_INTEGER);
	this.curveSegments.setStep(1.0);
	this.curveSegments.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "curveSegments", self.curveSegments.getValue()), updateGeometry));
	});
	this.form.add(this.curveSegments);
	this.form.nextRow();

	//Bevel
	this.bevel = new CheckBox(this.form);
	this.form.addText("Bevel");
	this.bevel.size.set(18, 18);
	this.bevel.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "bevel", self.bevel.getValue()), updateGeometry));
	});
	this.form.add(this.bevel);
	this.form.nextRow();

	//Bevel thickness
	this.form.addText("Bevel Thickness");
	this.bevelThickness = new NumberBox(this.form);
	this.bevelThickness.size.set(60, 18);
	this.bevelThickness.setRange(0, Number.MAX_SAFE_INTEGER);
	this.bevelThickness.setStep(0.1);
	this.bevelThickness.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "bevelThickness", self.bevelThickness.getValue()), updateGeometry));
	});
	this.form.add(this.bevelThickness);
	this.form.nextRow();

	//Bevel size
	this.form.addText("Bevel Size");
	this.bevelSize = new NumberBox(this.form);
	this.bevelSize.size.set(60, 18);
	this.bevelSize.setRange(0, Number.MAX_SAFE_INTEGER);
	this.bevelSize.setStep(0.1);
	this.bevelSize.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "bevelSize", self.bevelSize.getValue()), updateGeometry));
	});
	this.form.add(this.bevelSize);
	this.form.nextRow();
}

TextMeshPanel.prototype = Object.create(DrawablePanel.prototype);

TextMeshPanel.prototype.updatePanel = function()
{
	DrawablePanel.prototype.updatePanel.call(this);
	
	this.castShadow.setValue(this.object.castShadow);
	this.receiveShadow.setValue(this.object.receiveShadow);
	this.text.setText(this.object.text);
	this.textSize.setValue(this.object.size);
	this.extruded.setValue(this.object.extruded);
	this.height.setValue(this.object.height);
	this.curveSegments.setValue(this.object.curveSegments);
	this.bevel.setValue(this.object.bevel);
	this.bevelThickness.setValue(this.object.bevelThickness);
	this.bevelSize.setValue(this.object.bevelSize);
};
