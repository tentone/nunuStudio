"use strict";

function MaterialPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	var self = this;

	//Name
	this.form.addText("Name");
	this.name = new TextBox(this.form);
	this.name.size.set(190, 18);
	this.name.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "name", self.name.getText()));
		Editor.updateObjectsViewsGUI();
	});
	this.form.add(this.name);
	this.form.nextRow();

	//UUID
	if(Editor.settings.general.showUUID)
	{
		this.form.addText("UUID");
		this.uuid = this.form.addText("");
		this.form.nextRow();
	}
	
	//Type
	if(Editor.settings.general.showType)
	{
		this.form.addText("Type");
		this.type = this.form.addText("");
		this.form.nextRow();
	}

	//Side
	this.form.addText("Side");
	this.side = new DropdownList(this.form);
	this.side.position.set(100, 85);
	this.side.size.set(100, 18);
	this.side.addValue("Front", THREE.FrontSide);
	this.side.addValue("Back", THREE.BackSide);
	this.side.addValue("Double", THREE.DoubleSide);
	this.side.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "side", self.side.getValue()));
		self.obj.needsUpdate = true;
	});
	this.form.add(this.side);
	this.form.nextRow();

	//Test depth
	this.form.addText("Depth Test");
	this.depthTest = new CheckBox(this.form);
	this.depthTest.size.set(15, 15);
	this.depthTest.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "depthTest", self.depthTest.getValue()));
		self.obj.needsUpdate = true;
	});
	this.form.add(this.depthTest);
	this.form.nextRow();
	
	//Write depth
	this.form.addText("Depth Write");
	this.depthWrite = new CheckBox(this.form);
	this.depthWrite.size.set(15, 15);
	this.depthWrite.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "depthWrite", self.depthWrite.getValue()));
		self.obj.needsUpdate = true;
	});
	this.form.add(this.depthWrite);
	this.form.nextRow();

	//Depth mode
	this.form.addText("Depth Mode");
	this.depthFunc = new DropdownList(this.form);
	this.depthFunc.position.set(100, 85);
	this.depthFunc.size.set(100, 18);
	this.depthFunc.addValue("Never", THREE.NeverDepth);
	this.depthFunc.addValue("Always", THREE.AlwaysDepth);
	this.depthFunc.addValue("Less", THREE.LessDepth);
	this.depthFunc.addValue("Less or equal", THREE.LessEqualDepth);
	this.depthFunc.addValue("Greater or equal", THREE.GreaterEqualDepth);
	this.depthFunc.addValue("Greater", THREE.GreaterDepth);
	this.depthFunc.addValue("Not equal", THREE.NotEqualDepth);
	this.depthFunc.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "depthFunc", self.depthFunc.getValue()));
		self.obj.needsUpdate = true;
	});
	this.form.add(this.depthFunc);
	this.form.nextRow();

	//Transparent
	this.form.addText("Transparent");
	this.transparent = new CheckBox(this.form);
	this.transparent.size.set(15, 15);
	this.transparent.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "transparent", self.transparent.getValue()));
		self.obj.needsUpdate = true;
	});
	this.form.add(this.transparent);
	this.form.nextRow();

	//Opacity level
	this.form.addText("Opacity");
	this.opacity = new Slider(this.form);
	this.opacity.size.set(160, 18);
	this.opacity.setRange(0, 1);
	this.opacity.setStep(0.01);
	this.opacity.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "opacity", self.opacity.getValue()));
		self.obj.needsUpdate = true;
	});
	this.form.add(this.opacity);
	this.form.nextRow();
	
	//Alpha test
	this.form.addText("Alpha test");
	this.alphaTest = new Slider(this.form);
	this.alphaTest.size.set(160, 18);
	this.alphaTest.setRange(0, 1);
	this.alphaTest.setStep(0.01);
	this.alphaTest.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "alphaTest", self.alphaTest.getValue()));
		self.obj.needsUpdate = true;
	});
	this.form.add(this.alphaTest);
	this.form.nextRow();
	
	//Blending mode
	this.form.addText("Blending Mode");
	this.blending = new DropdownList(this.form);
	this.blending.position.set(100, 85);
	this.blending.size.set(100, 18);
	this.blending.addValue("None", THREE.NoBlending);
	this.blending.addValue("Normal", THREE.NormalBlending);
	this.blending.addValue("Additive", THREE.AdditiveBlending);
	this.blending.addValue("Subtractive", THREE.SubtractiveBlending);
	this.blending.addValue("Multiply", THREE.MultiplyBlending);
	this.blending.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "blending", self.blending.getValue()));
		self.obj.needsUpdate = true;
	});
	this.form.add(this.blending);
	this.form.nextRow();
}

MaterialPanel.prototype = Object.create(Panel.prototype);

MaterialPanel.prototype.updatePanel = function()
{
	this.name.setText(this.obj.name);
		
	if(this.uuid !== undefined)
	{
		this.uuid.setText(this.obj.uuid);
	}
	
	if(this.type !== undefined)
	{
		this.type.setText(this.obj.type);
	}

	this.name.setText(this.obj.name);
	this.side.setValue(this.obj.side);
	this.depthTest.setValue(this.obj.depthTest);
	this.depthWrite.setValue(this.obj.depthWrite);
	this.depthFunc.setValue(this.obj.depthFunc);
	this.transparent.setValue(this.obj.transparent);
	this.opacity.setValue(this.obj.opacity);
	this.alphaTest.setValue(this.obj.alphaTest);
	this.blending.setValue(this.obj.blending);
};