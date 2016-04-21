function LightPanel(parent)
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
			Editor.updateTreeView();
		}
	});

	//Position
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Position");
	text.position.set(5, 50);
	text.updateInterface();

	this.pos = new Positionbox(this.element);
	this.pos.position.set(56, 40);
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
	text.position.set(5, 75);
	text.updateInterface();

	this.color = new ColorChooser(this.element);
	this.color.size.set(80, 18);
	this.color.position.set(50, 65);
	this.color.updateInterface();
	this.color.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var color = self.color.getValue();
			self.obj.color.setRGB(color.r, color.g, color.b);
		}
	});
}

//Functions Prototype
LightPanel.prototype = Object.create(Panel.prototype);
LightPanel.prototype.attachObject = attachObject;
LightPanel.prototype.updatePanel = updatePanel;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);

		this.pos.setValue(this.obj.position.x, this.obj.position.y, this.obj.position.z);

		this.color.setValue(this.obj.color.r, this.obj.color.g, this.obj.color.b);
	}
}

//Attach object to panel
function attachObject(obj)
{
	this.obj = obj;
	this.updatePanel();
	this.updateInterface();
}
