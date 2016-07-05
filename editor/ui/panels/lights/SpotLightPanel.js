function SpotLightPanel(parent)
{
	Panel.call(this, parent);

	//elf pointer
	var self = this;

	//Name text
	var text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Name");
	text.position.set(5, 20);
	text.updateInterface();

	//Name textbox
	this.name = new TextBox(this.element);
	this.name.position.set(45, 10);
	this.name.size.set(200, 18);
	this.name.updateInterface();
	this.name.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.name = self.name.getText();
			Editor.updateObjectViews();
		}
	});

	//Position
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Position");
	text.position.set(5, 45);
	text.updateInterface();

	this.pos = new PositionBox(this.element);
	this.pos.position.set(56, 35);
	this.pos.updateInterface();
	this.pos.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var position = self.pos.getValue();
			self.obj.position.set(position.x, position.y, position.z);
		}
	});

	//Rotation
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Rotation");
	text.position.set(5, 70);
	text.updateInterface();

	this.rotation = new PositionBox(this.element);
	this.rotation.position.set(56, 60);
	this.rotation.updateInterface();
	this.rotation.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var rotation = self.rotation.getValue();
			self.obj.rotation.set(rotation.x, rotation.y, rotation.z);
		}
	});

	//Color
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Color");
	text.position.set(5, 95);
	text.updateInterface();

	this.color = new ColorChooser(this.element);
	this.color.size.set(80, 18);
	this.color.position.set(45, 85);
	this.color.updateInterface();
	this.color.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var color = self.color.getValue();
			self.obj.color.setRGB(color.r, color.g, color.b);
		}
	});

	//Penumbra
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Penumbra");
	text.position.set(5, 120);
	text.updateInterface();

	this.penumbra = new Slider(this.element);
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

	this.penumbra_text = new Text(this.element);
	this.penumbra_text.setAlignment(Text.LEFT);
	this.penumbra_text.position.set(235, 120);
	this.penumbra_text.updateInterface();

	//Angle
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Angle");
	text.position.set(5, 145);
	text.updateInterface();

	this.angle = new Slider(this.element);
	this.angle.size.set(160, 18);
	this.angle.position.set(48, 135);
	this.angle.setRange(0, 1.57);
	this.angle.setStep(0.01);
	this.angle.updateInterface();
	this.angle.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.angle = self.angle.getValue();
			self.angle_text.setText(self.obj.angle);
		}
	});

	this.angle_text = new Text(this.element);
	this.angle_text.setAlignment(Text.LEFT);
	this.angle_text.position.set(218, 145);
	this.angle_text.updateInterface();

	//Decay
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Decay");
	text.position.set(5, 170);
	text.updateInterface();

	this.decay = new Slider(this.element);
	this.decay.size.set(160, 18);
	this.decay.position.set(50, 160);
	this.decay.setRange(0, 10);
	this.decay.setStep(0.1);
	this.decay.updateInterface();
	this.decay.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.decay = self.decay.getValue();
			self.decay_text.setText(self.obj.decay);
		}
	});

	this.decay_text = new Text(this.element);
	this.decay_text.setAlignment(Text.LEFT);
	this.decay_text.position.set(220, 170);
	this.decay_text.updateInterface();

	//Cast shadow
	this.cast_shadow = new CheckBox(this.element);
	this.cast_shadow.setText("Cast Shadow");
	this.cast_shadow.size.set(200, 15);
	this.cast_shadow.position.set(5, 185);
	this.cast_shadow.updateInterface();
	this.cast_shadow.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.castShadow = self.cast_shadow.getValue();
		}
	});

	//Visible
	this.visible = new CheckBox(this.element);
	this.visible.setText("Visible");
	this.visible.size.set(200, 15);
	this.visible.position.set(5, 210);
	this.visible.updateInterface();
	this.visible.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.visible = self.visible.getValue();
		}
	});

	//Static
	this.static = new CheckBox(this.element);
	this.static.setText("Static Object");
	this.static.size.set(200, 15);
	this.static.position.set(5, 235);
	this.static.updateInterface();
	this.static.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.matrixAutoUpdate = !(self.static.getValue());
		}
	});
}

//Functions Prototype
SpotLightPanel.prototype = Object.create(Panel.prototype);
SpotLightPanel.prototype.attachObject = attachObject;
SpotLightPanel.prototype.updatePanel = updatePanel;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.pos.setValue(this.obj.position.x, this.obj.position.y, this.obj.position.z);
		this.rotation.setValue(this.obj.rotation.x, this.obj.rotation.y, this.obj.rotation.z);
		this.color.setValue(this.obj.color.r, this.obj.color.g, this.obj.color.b);
		this.cast_shadow.setValue(this.obj.castShadow);
		this.angle.setValue(this.obj.angle);
		this.angle_text.setText(this.obj.angle);
		this.penumbra.setValue(this.obj.penumbra);
		this.penumbra_text.setText(this.obj.penumbra);
		this.decay.setValue(this.obj.decay);
		this.decay_text.setText(this.obj.decay);
		this.visible.setValue(this.obj.visible);
		this.static.setValue(!this.obj.matrixAutoUpdate);
	}
}

//Attach object to panel
function attachObject(obj)
{
	this.obj = obj;
	this.updatePanel();
	this.updateInterface();
}
