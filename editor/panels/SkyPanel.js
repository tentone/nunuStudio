function SkyPanel(parent)
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
	this.name.position.set(50, 10);
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

	//Auto update
	this.auto_update = new Checkbox(this.element);
	this.auto_update.setText("Auto update");
	this.auto_update.size.set(200, 15);
	this.auto_update.position.set(0, 30);
	this.auto_update.updateInterface();
	this.auto_update.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.auto_update = self.auto_update.getValue();
		}
	});

	//Day time
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Day duration(s)");
	text.size.set(100, 0);
	text.position.set(5, 60);
	text.updateInterface();

	this.day_time = new Numberbox(this.element);
	this.day_time.size.set(100, 18);
	this.day_time.position.set(95, 50);
	this.day_time.updateInterface();
	this.day_time.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.day_time = self.day_time.getValue();
		}
	});
}

//Functions Prototype
SkyPanel.prototype = Object.create(Panel.prototype);
SkyPanel.prototype.attachObject = attachObject;
SkyPanel.prototype.updatePanel = updatePanel;

//Update panel with object data
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.auto_update.setValue(this.obj.auto_update);
		this.day_time.setValue(this.obj.day_time);
	}
}

//Attach object to panel
function attachObject(obj)
{
	if(obj instanceof Sky)
	{
		this.obj = obj;
		this.updatePanel();
		this.updateInterface();
	}
}
