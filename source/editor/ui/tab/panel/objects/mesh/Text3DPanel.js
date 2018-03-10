"use strict";

function Text3DPanel(parent, obj)
{
	ObjectPanel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Text
	this.form.addText("Text");
	this.text = new TextArea(this.form.element);
	this.text.size.set(190, 60);
	this.text.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "text", self.text.getText()));
		self.obj.setText();
	});
	this.form.add(this.text);
	this.form.nextRow();

	//Size
	this.form.addText("Size");
	this.size = new NumberBox(this.form.element);
	this.size.size.set(60, 18);
	this.size.setRange(0, Number.MAX_SAFE_INTEGER);
	this.size.setStep(0.1);
	this.size.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "size", self.size.getValue()));
		self.obj.setText();
	});
	this.form.add(this.size);
	this.form.nextRow();

	//Height
	this.form.addText("Thickness");
	this.height = new NumberBox(this.form.element);
	this.height.size.set(60, 18);
	this.height.setRange(0, Number.MAX_SAFE_INTEGER);
	this.height.setStep(0.1);
	this.height.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "height", self.height.getValue()));
		self.obj.setText();
	});
	this.form.add(this.height);
	this.form.nextRow();

	//Curve segments
	this.form.addText("Curve Detail");
	this.curveSegments = new NumberBox(this.form.element);
	this.curveSegments.size.set(60, 18);
	this.curveSegments.setRange(0, Number.MAX_SAFE_INTEGER);
	this.curveSegments.setStep(1.0);
	this.curveSegments.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "curveSegments", self.curveSegments.getValue()));
		self.obj.setText();
	});
	this.form.add(this.curveSegments);
	this.form.nextRow();

	//Bevel
	this.bevel = new CheckBox(this.form.element);
	this.form.addText("Bevel");
	this.bevel.size.set(15, 15);
	this.bevel.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "bevel", self.bevel.getValue()));
		self.obj.setText();
	});
	this.form.add(this.bevel);
	this.form.nextRow();

	//Bevel thickness
	this.form.addText("Bevel Thickness");
	this.bevelThickness = new NumberBox(this.form.element);
	this.bevelThickness.size.set(60, 18);
	this.bevelThickness.setRange(0, Number.MAX_SAFE_INTEGER);
	this.bevelThickness.setStep(0.1);
	this.bevelThickness.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "bevelThickness", self.bevelThickness.getValue()));
		self.obj.setText();
	});
	this.form.add(this.bevelThickness);
	this.form.nextRow();

	//Bevel size
	this.form.addText("Bevel Size");
	this.bevelSize = new NumberBox(this.form.element);
	this.bevelSize.size.set(60, 18);
	this.bevelSize.setRange(0, Number.MAX_SAFE_INTEGER);
	this.bevelSize.setStep(0.1);
	this.bevelSize.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "bevelSize", self.bevelSize.getValue()));
		self.obj.setText();
	});
	this.form.add(this.bevelSize);
	this.form.nextRow();

}

//Super prototypes
Text3DPanel.prototype = Object.create(ObjectPanel.prototype);

//Update panel content from attached object
Text3DPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);
	
	this.castShadow.setValue(this.obj.castShadow);
	this.receiveShadow.setValue(this.obj.receiveShadow);
	this.text.setText(this.obj.text);
	this.size.setValue(this.obj.size);
	this.height.setValue(this.obj.height);
	this.curveSegments.setValue(this.obj.curveSegments);
	this.bevel.setValue(this.obj.bevel);
	this.bevelThickness.setValue(this.obj.bevelThickness);
	this.bevelSize.setValue(this.obj.bevelSize);
};
