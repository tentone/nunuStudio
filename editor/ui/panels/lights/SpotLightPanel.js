"use strict";

function SpotLightPanel(parent)
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
			var position = self.pos.getValue();
			self.obj.position.set(position.x, position.y, position.z);
		}
	});
	this.form.add(this.position);
	this.form.nextRow()

	//Rotation
	this.form.addText("Rotation");
	this.rotation = new CoordinatesBox(this.form.element);
	this.rotation.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var rotation = self.pos.getValue();
			self.obj.rotation.set(rotation.x, rotation.y, rotation.z);
		}
	});
	this.form.add(this.rotation);
	this.form.nextRow();

	//Color
	this.form.addText("Color");
	this.color = new ColorChooser(this.form.element);
	this.color.size.set(80, 18);
	this.color.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var color = self.color.getValue();
			self.obj.color.setRGB(color.r, color.g, color.b);
		}
	});
	this.form.add(this.color);
	this.form.nextRow();

	//Penumbra
	this.form.addText("Penumbra");
	this.penumbra = new Slider(this.form.element);
	this.penumbra.size.set(160, 18);
	this.penumbra.position.set(65, 110);
	this.penumbra.setRange(0, 1);
	this.penumbra.setStep(0.01);
	this.penumbra.updateInterface();
	this.penumbra.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.penumbra = self.penumbra.getValue();
			self.penumbra_text.setText(self.obj.penumbra);
		}
	});
	this.form.add(this.penumbra);
	this.form.nextRow();

	//Angle
	this.form.addText("Angle");
	this.angle = new Slider(this.form.element);
	this.angle.size.set(160, 18);
	this.angle.setRange(0, 1.57);
	this.angle.setStep(0.01);
	this.angle.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.angle = self.angle.getValue();
			self.angle_text.setText(self.obj.angle);
		}
	});
	this.form.add(this.angle);
	this.form.nextRow();

	//Decay
	/*this.form.addText("Decay");
	this.decay = new Slider(this.form.element);
	this.decay.size.set(160, 18);
	this.decay.setRange(0, 10);
	this.decay.setStep(0.1);
	this.decay.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.decay = self.decay.getValue();
			self.decay_text.setText(self.obj.decay);
		}
	});
	this.form.add(this.decay);
	this.form.nextRow();*/
	
	//Cast shadow
	this.cast_shadow = new CheckBox(this.form.element);
	this.cast_shadow.setText("Cast Shadow");
	this.cast_shadow.size.set(200, 15);
	this.cast_shadow.position.set(5, 85);
	this.cast_shadow.updateInterface();
	this.cast_shadow.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.castShadow = self.cast_shadow.getValue();
		}
	});
	this.form.add(this.cast_shadow);
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

	//Update form
	this.form.updateInterface();
}

//Functions Prototype
SpotLightPanel.prototype = Object.create(Panel.prototype);
SpotLightPanel.prototype.updatePanel = updatePanel;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.position.setValue(this.obj.position.x, this.obj.position.y, this.obj.position.z);
		this.rotation.setValue(this.obj.rotation.x, this.obj.rotation.y, this.obj.rotation.z);
		this.color.setValue(this.obj.color.r, this.obj.color.g, this.obj.color.b);
		this.cast_shadow.setValue(this.obj.castShadow);
		this.angle.setValue(this.obj.angle);
		this.penumbra.setValue(this.obj.penumbra);
		//this.decay.setValue(this.obj.decay);
		this.visible.setValue(this.obj.visible);
		this.static.setValue(!this.obj.matrixAutoUpdate);
	}
}
