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

	//Position
	this.form.addText("Position");
	this.position = new CoordinatesBox(this.form.element);
	this.position.setStep(0.1);
	this.position.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.position.copy(self.position.getValue());
		}
	});
	this.form.add(this.position);
	this.form.nextRow();

	//Rotation
	this.form.addText("Rotation");
	this.rotation = new CoordinatesBox(this.form.element);
	this.rotation.setStep(0.1);
	this.rotation.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var rot = self.rotation.getValue();
			self.obj.rotation.set(rot.x, rot.y, rot.z);
		}
	});
	this.form.add(this.rotation);
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

	//Body mass
	this.form.addText("Mass");
	this.mass = new NumberBox(this.form.element);
	this.mass.size.set(80, 18);
	this.mass.setStep(0.1);
	this.mass.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.body.mass = self.mass.getValue();
		}
	});
	this.form.add(this.mass);
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
		this.position.setValue(this.obj.position);
		this.rotation.setValue(this.obj.rotation);
		this.type.setValue(this.obj.body.type);
		this.mass.setValue(this.obj.body.mass);
	}
}
