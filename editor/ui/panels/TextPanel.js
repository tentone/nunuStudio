function TextPanel(parent)
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

	//Text
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Text");
	text.position.set(5, 45);
	text.updateInterface();

	this.text = new Textbox(this.element);
	this.text.position.set(45, 35);
	this.text.size.set(200, 18);
	this.text.updateInterface();
	this.text.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.setText(self.text.getText());
		}
	});

	//Position
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Position");
	text.position.set(5, 70);
	text.updateInterface();

	this.pos = new Positionbox(this.element);
	this.pos.position.set(56, 60);
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
	text.position.set(5, 95);
	text.updateInterface();

	this.scale = new Positionbox(this.element);
	this.scale.position.set(45, 85);
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
	text.position.set(5, 120);
	text.updateInterface();

	this.rotation = new Positionbox(this.element);
	this.rotation.position.set(57, 110);
	this.rotation.updateInterface();
	this.rotation.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var rotation = self.rotation.getValue();
			self.obj.rotation.set(rotation.x, rotation.y, rotation.z);
		}
	});

	//Cast shadow
	this.cast_shadow = new Checkbox(this.element);
	this.cast_shadow.setText("Cast Shadow");
	this.cast_shadow.size.set(200, 15);
	this.cast_shadow.position.set(2, 135);
	this.cast_shadow.updateInterface();
	this.cast_shadow.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.castShadow = self.cast_shadow.getValue();
		}
	});

	//Cast shadow
	this.receive_shadow = new Checkbox(this.element);
	this.receive_shadow.setText("Receive Shadow");
	this.receive_shadow.size.set(200, 15);
	this.receive_shadow.position.set(2, 160);
	this.receive_shadow.updateInterface();
	this.receive_shadow.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.receiveShadow = self.receive_shadow.getValue();
		}
	});
}

//Functions Prototype
TextPanel.prototype = Object.create(Panel.prototype);
TextPanel.prototype.attachObject = attachObject;
TextPanel.prototype.updatePanel = updatePanel;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.text.setText(this.obj.text);
		this.pos.setValue(this.obj.position.x, this.obj.position.y, this.obj.position.z);
		this.scale.setValue(this.obj.scale.x, this.obj.scale.y, this.obj.scale.z);
		this.rotation.setValue(this.obj.rotation.x, this.obj.rotation.y, this.obj.rotation.z);
		this.cast_shadow.setValue(this.obj.castShadow);
		this.receive_shadow.setValue(this.obj.receiveShadow);
	}
}

//Attach object to panel
function attachObject(obj)
{
	this.obj = obj;
	this.updatePanel();
	this.updateInterface();
}
