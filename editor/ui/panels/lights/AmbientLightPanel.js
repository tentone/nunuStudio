function AmbientLightPanel(parent)
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

	//Color
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Color");
	text.position.set(5, 45);
	text.updateInterface();

	this.color = new ColorChooser(this.element);
	this.color.size.set(80, 18);
	this.color.position.set(50, 35);
	this.color.updateInterface();
	this.color.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var color = self.color.getValue();
			self.obj.color.setRGB(color.r, color.g, color.b);
		}
	});

	//Visible
	this.visible = new CheckBox(this.element);
	this.visible.setText("Visible");
	this.visible.size.set(200, 15);
	this.visible.position.set(5, 60);
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
	this.static.position.set(5, 85);
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
AmbientLightPanel.prototype = Object.create(Panel.prototype);
AmbientLightPanel.prototype.attachObject = attachObject;
AmbientLightPanel.prototype.updatePanel = updatePanel;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.color.setValue(this.obj.color.r, this.obj.color.g, this.obj.color.b);
		this.visible.setValue(this.visible);
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
