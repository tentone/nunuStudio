function LeapPanel(parent)
{
	Panel.call(this, parent);

	//Self pointer
	var self = this;

	//Name text
	var text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Name");
	text.position.set(5, 20);
	text.updateInterface();

	//Name textbox
	this.name = new Textbox(this.element);
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

	this.pos = new Positionbox(this.element);
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

	//Scale
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Scale");
	text.position.set(5, 70);
	text.updateInterface();

	this.scale = new Positionbox(this.element);
	this.scale.position.set(45, 60);
	this.scale.updateInterface();
	this.scale.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var scale = self.scale.getValue();
			self.obj.scale.set(scale.x, scale.y, scale.z);
		}
	});

	//Rotation
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Rotation");
	text.position.set(5, 95);
	text.updateInterface();

	this.rotation = new Positionbox(this.element);
	this.rotation.position.set(57, 85);
	this.rotation.updateInterface();
	this.rotation.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var rotation = self.rotation.getValue();
			self.obj.rotation.set(rotation.x, rotation.y, rotation.z);
		}
	});

	//Mode
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Mode");
	text.position.set(5, 120);
	text.updateInterface();

	this.mode = new DropdownList(this.element);
	this.mode.position.set(45, 110);
	this.mode.size.set(80, 18);
	this.mode.addValue("Desk", Script.INIT);
	this.mode.addValue("HMD", Script.LOOP);
	this.mode.updateInterface();
	this.mode.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.mode = self.mode.getSelectedIndex();
		}
	});

	//Debug model
	this.debug_model = new Checkbox(this.element);
	this.debug_model.setText("Debug model");
	this.debug_model.size.set(200, 15);
	this.debug_model.position.set(5, 135);
	this.debug_model.updateInterface();
	this.debug_model.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.debug_model = self.debug_model.getValue();
		}
	});

	//Gestures Enabled
	this.gestures_enabled = new Checkbox(this.element);
	this.gestures_enabled.setText("Gestures Enabled");
	this.gestures_enabled.size.set(200, 15);
	this.gestures_enabled.position.set(5, 160);
	this.gestures_enabled.updateInterface();
	this.gestures_enabled.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.gestures_enabled = self.gestures_enabled.getValue();
		}
	});

	//Poses Enabled
	this.poses_enabled = new Checkbox(this.element);
	this.poses_enabled.setText("Poses Enabled");
	this.poses_enabled.size.set(200, 15);
	this.poses_enabled.position.set(5, 185);
	this.poses_enabled.updateInterface();
	this.poses_enabled.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.poses_enabled = self.poses_enabled.getValue();
		}
	});
}

//Functions Prototype
LeapPanel.prototype = Object.create(Panel.prototype);
LeapPanel.prototype.attachObject = attachObject;
LeapPanel.prototype.updatePanel = updatePanel;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.pos.setValue(this.obj.position.x, this.obj.position.y, this.obj.position.z);
		this.scale.setValue(this.obj.scale.x, this.obj.scale.y, this.obj.scale.z);
		this.rotation.setValue(this.obj.rotation.x, this.obj.rotation.y, this.obj.rotation.z);
		this.mode.setSelectedIndex(this.obj.mode);
		this.debug_model.setValue(this.obj.debug_model);
		this.gestures_enabled.setValue(this.obj.gestures_enabled);
		this.poses_enabled.setValue(this.obj.poses_enabled);
	}
}

//Attach object to panel
function attachObject(obj)
{
	this.obj = obj;
	this.updatePanel();
	this.updateInterface();
}
