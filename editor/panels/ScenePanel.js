function ScenePanel(parent)
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

	//Select scene as default
	this.default = new Checkbox(this.element);
	this.default.setText("Default scene");
	this.default.size.set(200, 15);
	this.default.position.set(3, 35);
	this.default.updateInterface();
	this.default.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var program = self.obj.parent;
			if(self.default.getValue())
			{
				program.initial_scene = self.obj.uuid;
			}
			else
			{
				program.initial_scene = null;
			}
		}
	});

	//Fog
	this.fog = new Checkbox(this.element);
	this.fog.setText("Fog Enabled");
	this.fog.size.set(200, 15);
	this.fog.position.set(3, 60);
	this.fog.updateInterface();
	this.fog.setOnChange(function()
	{
		if(self.obj !== null)
		{

		}
	});

	//For near
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Near");
	text.position.set(5, 95);
	text.updateInterface();

	this.fog_near = new Numberbox(this.element);
	this.fog_near.size.set(50, 18);
	this.fog_near.position.set(40, 85);
	this.fog_near.updateInterface();
	this.fog_near.setOnChange(function()
	{
		if(self.obj !== null)
		{

		}
	});

	//Fog far
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Far");
	text.position.set(5, 120);
	text.updateInterface();

	this.fog_far = new Numberbox(this.element);
	this.fog_far.size.set(50, 18);
	this.fog_far.position.set(35, 110);
	this.fog_far.updateInterface();
	this.fog_far.setOnChange(function()
	{
		if(self.obj !== null)
		{

		}
	});
}

//Functions Prototype
ScenePanel.prototype = Object.create(Panel.prototype);
ScenePanel.prototype.attachObject = attachObject;
ScenePanel.prototype.updatePanel = updatePanel;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.default.setValue(this.obj.uuid === this.obj.parent.initial_scene);
	}
}

//Attach object to panel
function attachObject(obj)
{
	this.obj = obj;
	this.updatePanel();
	this.updateInterface();
}
