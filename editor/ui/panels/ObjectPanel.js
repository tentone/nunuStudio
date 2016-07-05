function ObjectPanel(parent)
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
			self.obj.updateMatrix();
		}
	});

	//Scale
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Scale");
	text.position.set(5, 70);
	text.updateInterface();

	this.scale = new PositionBox(this.element);
	this.scale.position.set(45, 60);
	this.scale.updateInterface();
	this.scale.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var scale = self.scale.getValue();
			self.obj.scale.set(scale.x, scale.y, scale.z);
			self.obj.updateMatrix();
		}
	});

	//Rotation
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Rotation");
	text.position.set(5, 95);
	text.updateInterface();

	this.rotation = new PositionBox(this.element);
	this.rotation.position.set(57, 85);
	this.rotation.updateInterface();
	this.rotation.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var rotation = self.rotation.getValue();
			self.obj.rotation.set(rotation.x, rotation.y, rotation.z);
			self.obj.updateMatrix();
		}
	});

	//Visible
	this.visible = new CheckBox(this.element);
	this.visible.setText("Visible");
	this.visible.size.set(200, 15);
	this.visible.position.set(5, 110);
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
	this.static.position.set(5, 135);
	this.static.updateInterface();
	this.static.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.matrixAutoUpdate = !(self.static.getValue());
		}
	});

	//Cast shadow
	this.cast_shadow = new CheckBox(this.element);
	this.cast_shadow.setText("Cast Shadow");
	this.cast_shadow.size.set(200, 15);
	this.cast_shadow.position.set(5, 160);
	this.cast_shadow.updateInterface();
	this.cast_shadow.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.castShadow = self.cast_shadow.getValue();
		}
	});

	//Cast shadow
	this.receive_shadow = new CheckBox(this.element);
	this.receive_shadow.setText("Receive Shadow");
	this.receive_shadow.size.set(200, 15);
	this.receive_shadow.position.set(5, 185);
	this.receive_shadow.updateInterface();
	this.receive_shadow.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.receiveShadow = self.receive_shadow.getValue();
		}
	});

	//Type
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Type");
	text.position.set(5, 220);
	text.updateInterface();

	this.type = new Text(this.element);
	this.type.setAlignment(Text.LEFT);
	this.type.setText("");
	this.type.position.set(35, 220);
	this.type.updateInterface();

}

//Functions Prototype
ObjectPanel.prototype = Object.create(Panel.prototype);
ObjectPanel.prototype.attachObject = attachObject;
ObjectPanel.prototype.updatePanel = updatePanel;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.pos.setValue(this.obj.position.x, this.obj.position.y, this.obj.position.z);
		this.scale.setValue(this.obj.scale.x, this.obj.scale.y, this.obj.scale.z);
		this.rotation.setValue(this.obj.rotation.x, this.obj.rotation.y, this.obj.rotation.z);
		this.visible.setValue(this.obj.visible);
		this.static.setValue(!this.obj.matrixAutoUpdate);
		this.cast_shadow.setValue(this.obj.castShadow);
		this.receive_shadow.setValue(this.obj.receiveShadow);
		this.type.setText(this.obj.type);
	}
}

//Attach object to panel
function attachObject(obj)
{
	this.obj = obj;
	this.updatePanel();
	this.updateInterface();
}
