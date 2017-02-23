"use strict";

function Text3DPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Text
	this.form.addText("Text");
	this.text = new TextArea(this.form.element);
	this.text.size.set(190, 60);
	this.text.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.setText(self.text.getText());
		}
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
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.size = self.size.getValue();
			self.obj.setText();
		}
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
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.height = self.height.getValue();
			self.obj.setText();
		}
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
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.curveSegments = self.curveSegments.getValue();
			self.obj.setText();
		}
	});
	this.form.add(this.curveSegments);
	this.form.nextRow();

	//Bevel
	this.bevel = new CheckBox(this.form.element);
	this.form.addText("Bevel");
	this.bevel.size.set(20, 15);
	this.bevel.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.bevel = self.bevel.getValue();
			self.obj.setText();
		}
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
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.bevelThickness = self.bevelThickness.getValue();
			self.obj.setText();
		}
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
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.bevelSize = self.bevelSize.getValue();
			self.obj.setText();
		}
	});
	this.form.add(this.bevelSize);
	this.form.nextRow();

	//Visible
	this.visible = new CheckBox(this.form.element);
	this.form.addText("Visible");
	this.visible.size.set(20, 15);
	this.visible.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.visible = self.visible.getValue();
		}
	});
	this.form.add(this.visible);
	this.form.nextRow();

	//Static
	this.static = new CheckBox(this.form.element);
	this.form.addText("Static Object");
	this.static.size.set(20, 15);
	this.static.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.matrixAutoUpdate = !(self.static.getValue());
		}
	});
	this.form.add(this.static);
	this.form.nextRow();

	//Cast shadow
	this.castShadow = new CheckBox(this.form.element);
	this.form.addText("Cast Shadow");
	this.castShadow.size.set(20, 15);
	this.castShadow.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.castShadow = self.castShadow.getValue();
		}
	});
	this.form.add(this.castShadow);
	this.form.nextRow();

	//Receive shadow
	this.receiveShadow = new CheckBox(this.form.element);
	this.form.addText("React Shadow");
	this.receiveShadow.size.set(20, 15);
	this.receiveShadow.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.receiveShadow = self.receiveShadow.getValue();
		}
	});
	this.form.add(this.receiveShadow);
	this.form.nextRow();

	//Update form
	this.form.updateInterface();
}

//Super prototypes
Text3DPanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
Text3DPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);
	
	if(this.obj !== null)
	{
		this.text.setText(this.obj.text);
		this.size.setValue(this.obj.size);
		this.height.setValue(this.obj.height);
		this.curveSegments.setValue(this.obj.curveSegments);
		this.bevel.setValue(this.obj.bevel);
		this.bevelThickness.setValue(this.obj.bevelThickness);
		this.bevelSize.setValue(this.obj.bevelSize);

		this.castShadow.setValue(this.obj.castShadow);
		this.receiveShadow.setValue(this.obj.receiveShadow);
		this.visible.setValue(this.obj.visible);
		this.static.setValue(!this.obj.matrixAutoUpdate);
	}
}
