function ScriptPanel(parent)
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

	//Execution mode
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Mode");
	text.position.set(5, 70);
	text.updateInterface();

	this.mode = new DropdownList(this.element);
	this.mode.position.set(45, 60);
	this.mode.size.set(100, 18);
	this.mode.addValue("Initialization", Script.INIT);
	this.mode.addValue("Loop", Script.LOOP);
	this.mode.updateInterface();
	this.mode.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.setMode(self.mode.getSelectedIndex());
		}
	});
}

//Functions Prototype
ScriptPanel.prototype = Object.create(Panel.prototype);
ScriptPanel.prototype.attachObject = attachObject;
ScriptPanel.prototype.updatePanel = updatePanel;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.pos.setValue(this.obj.position.x, this.obj.position.y, this.obj.position.z);
		this.mode.setSelectedIndex(this.obj.mode);
	}
}

//Attach object to panel
function attachObject(obj)
{
	if(obj instanceof Script)
	{
		this.obj = obj;
		this.updatePanel();
		this.updateInterface();
	}
}
