function PhysicsPanel(parent)
{
	Panel.call(this, parent);

	//Self pointer
	var self = this;

	//Name
	this.form.addText("Name");
	this.name = new TextBox(this.form.element);
	this.name.size.set(200, 18);
	this.name.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.name = self.name.getText();
			Editor.updateObjectViews();
		}
	});
	this.form.add(this.name);
	this.form.nextRow();

	//Body Type
	this.form.addText("Type");
	this.type = new DropdownList(this.form.element);
	this.type.size.set(100, 20);
	this.type.addValue("Static", CANNON.Body.STATIC);
	this.type.addValue("Dynamic", CANNON.Body.DYNAMIC);
	this.type.addValue("Kinematic", CANNON.Body.KINEMATIC);
	this.type.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.body.type = self.type.getValue();
		}
	});
	this.form.add(this.type);
	this.form.nextRow();

	//Update form
	this.form.updateInterface();
}

//Functions Prototype
PhysicsPanel.prototype = Object.create(Panel.prototype);
PhysicsPanel.prototype.updatePanel = updatePanel;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.type.setValue(this.obj.body.type);
	}
}
