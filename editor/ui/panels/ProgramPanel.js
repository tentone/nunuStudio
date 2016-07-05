function ProgramPanel(parent)
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

	//Author
	var text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Author");
	text.position.set(5, 45);
	text.updateInterface();

	this.author = new TextBox(this.element);
	this.author.position.set(50, 35);
	this.author.size.set(200, 18);
	this.author.updateInterface();
	this.author.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.author = self.author.getText();
		}
	});

	//Version
	var text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Version");
	text.position.set(5, 70);
	text.updateInterface();

	this.version = new TextBox(this.element);
	this.version.position.set(50, 60);
	this.version.size.set(100, 18);
	this.version.updateInterface();
	this.version.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.version = self.version.getText();
		}
	});

	//VR
	this.vr = new CheckBox(this.element);
	this.vr.setText("VR Enabled");
	this.vr.position.set(3, 85);
	this.vr.size.set(50, 15);
	this.vr.updateInterface();
	this.vr.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.vr = self.vr.getValue();
		}
	});

	//VR Movement Scale
	var text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("VR Movement Scale");
	text.position.set(5, 120);
	text.updateInterface();

	this.vr_scale = new NumberBox(this.element);
	this.vr_scale.position.set(120, 110);
	this.vr_scale.size.set(50, 18);
	this.vr_scale.setRange(0, 1000);
	this.vr_scale.setStep(0.05);
	this.vr_scale.updateInterface();
	this.vr_scale.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.vr_scale = self.vr_scale.getValue();
		}
	});
}

//Functions Prototype
ProgramPanel.prototype = Object.create(Panel.prototype);
ProgramPanel.prototype.attachObject = attachObject;
ProgramPanel.prototype.updatePanel = updatePanel;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.author.setText(this.obj.author);
		this.version.setText(this.obj.version);
		this.vr.setValue(this.obj.vr);
		this.vr_scale.setValue(this.obj.vr_scale);
	}
}

//Attach object to panel
function attachObject(obj)
{
	this.obj = obj;
	this.updatePanel();
	this.updateInterface();
}
