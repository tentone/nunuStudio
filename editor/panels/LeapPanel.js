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

	//Scale
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Scale");
	text.position.set(5, 75);
	text.updateInterface();

	this.scale = new Positionbox(this.element);
	this.scale.position.set(45, 65);
	this.scale.updateInterface();
	this.scale.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var scale = self.scale.getValue();
			self.obj.scale.set(scale.x, scale.y, scale.z);
		}
	});


	//Checkbox test
	/*this.check = new Checkbox(this.element);
	this.check.size.set(200, 15);
	this.check.position.set(5, 50);
	this.check.updateInterface();

	//Color chooser
	this.color = new ColorChooser(this.element);
	this.color.size.set(200, 15);
	this.color.position.set(5, 80);
	this.color.updateInterface();

	//Slider
	this.slider = new Slider(this.element);
	this.slider.size.set(200, 15);
	this.slider.position.set(5, 110);
	this.slider.updateInterface();

	//Dropdown
	this.drop = new DropdownList(this.element);
	this.drop.size.set(200, 20);
	this.drop.position.set(0, 140);
	this.drop.updateInterface();

	this.drop.addValue("AAAAA");
	this.drop.addValue("BBBBB");
	this.drop.addValue("CCCCC");*/
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
	}
}

//Attach object to panel
function attachObject(obj)
{
	this.obj = obj;
	this.updatePanel();
	this.updateInterface();
}
