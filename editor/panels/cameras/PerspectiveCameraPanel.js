function PerspectiveCameraPanel(parent)
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

	this.name = new Textbox(this.element);
	this.name.position.set(45, 10);
	this.name.size.set(200, 18);
	this.name.updateInterface();
	this.name.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.name = self.name.getText();
			Editor.updateTreeView();
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

	//Rotation
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Rotation");
	text.position.set(5, 70);
	text.updateInterface();

	this.rotation = new Positionbox(this.element);
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

	//Fov
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("FOV");
	text.position.set(5, 95);
	text.updateInterface();

	this.fov = new Slider(this.element);
	this.fov.size.set(160, 18);
	this.fov.position.set(45, 85);
	this.fov.setRange(30, 160);
	this.fov.updateInterface();
	this.fov.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.fov = self.fov.getValue();
			self.obj.updateProjectionMatrix();
			self.fov_text.setText(self.obj.fov);
		}
	});

	this.fov_text = new Text(this.element);
	this.fov_text.setAlignment(Text.LEFT);
	this.fov_text.position.set(215, 95);
	this.fov_text.updateInterface();

	//Select camera as scene default
	this.default = new Checkbox(this.element);
	this.default.setText("Default camera");
	this.default.size.set(200, 15);
	this.default.position.set(3, 110);
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
PerspectiveCameraPanel.prototype = Object.create(Panel.prototype);
PerspectiveCameraPanel.prototype.attachObject = attachObject;
PerspectiveCameraPanel.prototype.updatePanel = updatePanel;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);

		this.pos.setValue(this.obj.position.x, this.obj.position.y, this.obj.position.z);
		this.rotation.setValue(this.obj.rotation.x, this.obj.rotation.y, this.obj.rotation.z);

		this.fov.setValue(this.obj.fov);
		this.fov_text.setText(this.obj.fov);

		this.default.setValue(ObjectUtils.getScene(this.obj).initial_camera === this.obj.uuid);
	}
}

//Attach object to panel
function attachObject(obj)
{
	this.obj = obj;
	this.updatePanel();
	this.updateInterface();
}
