"use strict";

function Text3DPanel(parent)
{
	Panel.call(this, parent);

	//Self pointer
	var self = this;

	//Name
	this.form.addText("Name");
	this.name = new TextBox(this.form.element);
	this.name.size.set(200, 18);
	this.name.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.name = self.name.getText();
			Editor.updateObjectViews();
		}
	});
	this.form.add(this.name);
	this.form.nextRow();

	//Position
	this.form.addText("Position");
	this.position = new CoordinatesBox(this.form.element);
	this.position.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var position = self.position.getValue();
			self.obj.position.set(position.x, position.y, position.z);
		}
	});
	this.form.add(this.position);
	this.form.nextRow();

	//Scale
	this.form.addText("Scale");
	this.scale = new CoordinatesBox(this.form.element);
	this.scale.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var scale = self.scale.getValue();
			self.obj.scale.set(scale.x, scale.y, scale.z);
		}
	});
	this.form.add(this.scale);
	this.form.nextRow();

	//Rotation
	this.form.addText("Rotation");
	this.rotation = new CoordinatesBox(this.form.element);
	this.rotation.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var rotation = self.rotation.getValue();
			self.obj.rotation.set(rotation.x, rotation.y, rotation.z);
		}
	});
	this.form.add(this.rotation);
	this.form.nextRow();

	//Text
	this.form.addText("Text");
	this.text = new TextBox(this.form.element);
	this.text.size.set(200, 18);
	this.text.setOnChange(function()
	{
		if(self.obj !== null)
		{
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
			self.obj.height = self.height.getValue();
			self.obj.setText();
		}
	});
	this.form.add(this.height);
	this.form.nextRow();

	//Bevel
	this.bevel = new CheckBox(this.form.element);
	this.bevel.setText("Bevel");
	this.bevel.size.set(200, 15);
	this.bevel.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.bevel = self.bevel.getValue();
			self.obj.setText();
		}
	});
	this.form.add(this.bevel);
	this.form.nextRow();

	//Bevel thickness
	this.form.addText("Bevel Thickness");
	this.bevel_thickness = new NumberBox(this.form.element);
	this.bevel_thickness.size.set(60, 18);
	this.bevel_thickness.setRange(0, Number.MAX_SAFE_INTEGER);
	this.bevel_thickness.setStep(0.1);
	this.bevel_thickness.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.bevel_thickness = self.bevel_thickness.getValue();
			self.obj.setText();
		}
	});
	this.form.add(this.bevel_thickness);
	this.form.nextRow();

	//Bevel size
	this.form.addText("Bevel Size");
	this.bevel_size = new NumberBox(this.form.element);
	this.bevel_size.size.set(60, 18);
	this.bevel_size.setRange(0, Number.MAX_SAFE_INTEGER);
	this.bevel_size.setStep(0.1);
	this.bevel_size.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.bevel_size = self.bevel_size.getValue();
			self.obj.setText();
		}
	});
	this.form.add(this.bevel_size);
	this.form.nextRow();

	//Visible
	this.visible = new CheckBox(this.form.element);
	this.visible.setText("Visible");
	this.visible.size.set(200, 15);
	this.visible.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.visible = self.visible.getValue();
		}
	});
	this.form.add(this.visible);
	this.form.nextRow();

	//Static
	this.static = new CheckBox(this.form.element);
	this.static.setText("Static Object");
	this.static.size.set(200, 15);
	this.static.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.matrixAutoUpdate = !(self.static.getValue());
		}
	});
	this.form.add(this.static);
	this.form.nextRow();

	//Cast shadow
	this.cast_shadow = new CheckBox(this.form.element);
	this.cast_shadow.setText("Cast Shadow");
	this.cast_shadow.size.set(200, 15);
	this.cast_shadow.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.castShadow = self.cast_shadow.getValue();
		}
	});
	this.form.add(this.cast_shadow);
	this.form.nextRow();

	//Receive shadow
	this.receive_shadow = new CheckBox(this.form.element);
	this.receive_shadow.setText("Receive Shadow");
	this.receive_shadow.size.set(200, 15);
	this.receive_shadow.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.receiveShadow = self.receive_shadow.getValue();
		}
	});
	this.form.add(this.receive_shadow);
	this.form.nextRow();

	//Update form
	this.form.updateInterface();
}

//Super prototypes
Text3DPanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
Text3DPanel.prototype.updatePanel = function()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.position.setValue(this.obj.position.x, this.obj.position.y, this.obj.position.z);
		this.scale.setValue(this.obj.scale.x, this.obj.scale.y, this.obj.scale.z);
		this.rotation.setValue(this.obj.rotation.x, this.obj.rotation.y, this.obj.rotation.z);

		this.text.setText(this.obj.text);
		this.size.setValue(this.obj.size);
		this.height.setValue(this.obj.height);
		this.bevel.setValue(this.obj.bevel);
		this.bevel_thickness.setValue(this.obj.bevel_thickness);
		this.bevel_size.setValue(this.obj.bevel_size);

		this.cast_shadow.setValue(this.obj.castShadow);
		this.receive_shadow.setValue(this.obj.receiveShadow);
		this.visible.setValue(this.obj.visible);
		this.static.setValue(!this.obj.matrixAutoUpdate);
	}
}
