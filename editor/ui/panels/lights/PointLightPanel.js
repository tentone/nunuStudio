function PointLightPanel(parent)
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

	//Color
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Color");
	text.position.set(5, 70);
	text.updateInterface();

	this.color = new ColorChooser(this.element);
	this.color.size.set(80, 18);
	this.color.position.set(45, 60);
	this.color.updateInterface();
	this.color.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var color = self.color.getValue();
			self.obj.color.setRGB(color.r, color.g, color.b);
		}
	});

	//Cast shadow
	this.cast_shadow = new CheckBox(this.element);
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
}

//Functions Prototype
PointLightPanel.prototype = Object.create(Panel.prototype);
PointLightPanel.prototype.attachObject = attachObject;
PointLightPanel.prototype.updatePanel = updatePanel;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.pos.setValue(this.obj.position.x, this.obj.position.y, this.obj.position.z);
		this.color.setValue(this.obj.color.r, this.obj.color.g, this.obj.color.b);
		this.cast_shadow.setValue(this.obj.castShadow);
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
