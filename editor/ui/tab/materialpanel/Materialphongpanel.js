function MaterialPhongPanel(parent)
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
			Editor.updateObjectViews();
		}
	});

	//TODO <ADD CODE HERE>
}

//Functions Prototype
MaterialPhongPanel.prototype = Object.create(Panel.prototype);
MaterialPhongPanel.prototype.attachObject = attachObject;
MaterialPhongPanel.prototype.updatePanel = updatePanel;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		//TODO <ADD CODE HERE>
	}
}

//Attach object to panel
function attachObject(obj)
{
	this.obj = obj;
	this.updatePanel();
	this.updateInterface();
}
