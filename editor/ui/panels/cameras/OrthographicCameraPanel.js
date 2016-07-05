function OrthographicCameraPanel(parent)
{
	Panel.call(this, parent);

	//Self pointer
	var self = this;

	//Name
	var text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Name");
	text.position.set(5, 20);
	text.updateInterface();

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
	this.rotation.position.set(57, 60);
	this.rotation.updateInterface();
	this.rotation.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var rotation = self.rotation.getValue();
			self.obj.rotation.set(rotation.x, rotation.y, rotation.z);
		}
	});

	/*this.rotation = new Slider(this.element);
	this.rotation.size.set(150, 18);
	this.rotation.position.set(65, 60);
	this.rotation.setRange(-3.14, 3.14);
	this.rotation.setStep(0.02);
	this.rotation.updateInterface();
	this.rotation.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.rotation.z = self.rotation.getValue();
			self.obj.updateProjectionMatrix();
			self.rotation_text.setText(self.obj.rotation.z);
		}
	});

	this.rotation_text = new Text(this.element);
	this.rotation_text.setAlignment(Text.LEFT);
	this.rotation_text.position.set(230, 70);
	this.rotation_text.updateInterface();*/

	//Size
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Size");
	text.position.set(5, 95);
	text.updateInterface();

	this.size = new NumberBox(this.element);
	this.size.size.set(80, 18);
	this.size.position.set(40, 85);
	this.size.updateInterface();
	this.size.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.size = self.size.getValue();
			self.obj.updateProjectionMatrix();
		}
	});

	//Camera resize Mode
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Mode");
	text.position.set(5, 120);
	text.updateInterface();

	this.mode = new DropdownList(this.element);
	this.mode.position.set(45, 110);
	this.mode.size.set(130, 18);
	this.mode.addValue("Resize Horizontal", OrthographicCamera.FIXED_VERTICAL);
	this.mode.addValue("Resize Vertical", OrthographicCamera.FIXED_HORIZONTAL);
	this.mode.updateInterface();
	this.mode.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.mode = self.mode.getSelectedIndex();
		}
	});

	//Select camera as scene default
	this.default = new CheckBox(this.element);
	this.default.setText("Default camera");
	this.default.size.set(200, 15);
	this.default.position.set(3, 135);
	this.default.updateInterface();
	this.default.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var scene = ObjectUtils.getScene(self.obj);
			if(scene !== null)
			{
				if(self.default.getValue())
				{
					scene.initial_camera = self.obj.uuid;
				}
				else
				{
					scene.initial_camera = null;
				}
			}
		}
	});
}

//Functions Prototype
OrthographicCameraPanel.prototype = Object.create(Panel.prototype);
OrthographicCameraPanel.prototype.attachObject = attachObject;
OrthographicCameraPanel.prototype.updatePanel = updatePanel;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.pos.setValue(this.obj.position.x, this.obj.position.y, this.obj.position.z);
		this.rotation.setValue(this.obj.rotation.x, this.obj.rotation.y, this.obj.rotation.z);
		this.size.setValue(this.obj.size);
		this.mode.setSelectedIndex(this.obj.mode);

		var scene = ObjectUtils.getScene(this.obj);
		if(scene !== null)
		{
			this.default.setValue(scene.initial_camera === this.obj.uuid);
		}
		else
		{
			this.default.setValue(false);
		}
	}
}

//Attach object to panel
function attachObject(obj)
{
	this.obj = obj;
	this.updatePanel();
	this.updateInterface();
}
