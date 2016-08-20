"use strict";

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

	//Scale
	this.form.addText("Scale");
	this.scale = new CoordinatesBox(this.form.element);
	this.scale.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var scale = self.scale.getValue();
			self.obj.scale.set(scale.x, scale.y, scale.z);

			//Update physics objects
			var shapes = self.obj.body.shapes;
			for(var i = 0; i < shapes.length; i++)
			{
				var shape = shapes[i];
				
				if(shape.type === CANNON.Shape.types.BOX)
				{
					shape.halfExtents.x = scale.x / 2.0;
					shape.halfExtents.y = scale.y / 2.0;
					shape.halfExtents.z = scale.z / 2.0;
				}
				else if(shape.type === CANNON.Shape.types.SPHERE)
				{
					shape.radius = scale.x;
				}
			}
		}
	});
	this.form.add(this.scale);
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

	//Body linear damping
	this.form.addText("Linear Damping");
	this.linearDamping = new NumberBox(this.form.element);
	this.linearDamping.size.set(80, 18);
	this.linearDamping.setStep(0.01);
	this.linearDamping.setRange(0, 1);
	this.linearDamping.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.body.linearDamping = self.linearDamping.getValue();
		}
	});
	this.form.add(this.linearDamping);
	this.form.nextRow();

	//Body angular damping
	this.form.addText("Angular Damping");
	this.angularDamping = new NumberBox(this.form.element);
	this.angularDamping.size.set(80, 18);
	this.angularDamping.setStep(0.01);
	this.angularDamping.setRange(0, 1);
	this.angularDamping.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.body.angularDamping = self.angularDamping.getValue();
		}
	});
	this.form.add(this.angularDamping);
	this.form.nextRow();

	//Allow sleep
	this.allowSleep = new CheckBox(this.form.element);
	this.allowSleep.setText("Allow sleep");
	this.allowSleep.size.set(150, 15);
	this.allowSleep.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.body.allowSleep = self.allowSleep.getValue();
		}
	});
	this.form.add(this.allowSleep);
	this.form.nextRow();

	//Sleep speed limit
	this.form.addText("Sleep speed limit");
	this.sleepSpeedLimit = new NumberBox(this.form.element);
	this.sleepSpeedLimit.size.set(80, 18);
	this.sleepSpeedLimit.setStep(0.01);
	this.sleepSpeedLimit.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.body.sleepSpeedLimit = self.sleepSpeedLimit.getValue();
		}
	});
	this.form.add(this.sleepSpeedLimit);
	this.form.nextRow();

	//Sleep time limit
	this.form.addText("Sleep time limit");
	this.sleepTimeLimit = new NumberBox(this.form.element);
	this.sleepTimeLimit.size.set(80, 18);
	this.sleepTimeLimit.setStep(0.01);
	this.sleepTimeLimit.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.body.sleepTimeLimit = self.sleepTimeLimit.getValue();
		}
	});
	this.form.add(this.sleepTimeLimit);
	this.form.nextRow();

	//Fixed rotation
	this.fixedRotation = new CheckBox(this.form.element);
	this.fixedRotation.setText("Fixed rotation");
	this.fixedRotation.size.set(150, 15);
	this.fixedRotation.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.body.fixedRotation = self.fixedRotation.getValue();
		}
	});
	this.form.add(this.fixedRotation);
	this.form.nextRow();

	//Collising group
	this.form.addText("Collision group");
	this.collisionFilterGroup = new NumberBox(this.form.element);
	this.collisionFilterGroup.size.set(80, 18);
	this.collisionFilterGroup.setStep(1);
	this.collisionFilterGroup.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.body.collisionFilterGroup = self.collisionFilterGroup.getValue();
		}
	});
	this.form.add(this.collisionFilterGroup);
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
		this.scale.setValue(this.obj.scale);
		this.rotation.setValue(this.obj.rotation);
		this.type.setValue(this.obj.body.type);
		this.mass.setValue(this.obj.body.mass);
		this.linearDamping.setValue(this.obj.body.linearDamping);
		this.angularDamping.setValue(this.obj.body.angularDamping);
		this.allowSleep.setValue(this.obj.body.allowSleep);
		this.sleepTimeLimit.setValue(this.obj.body.sleepTimeLimit);
		this.sleepSpeedLimit.setValue(this.obj.body.sleepSpeedLimit);
		this.fixedRotation.setValue(this.obj.body.fixedRotation);
		this.collisionFilterGroup.setValue(this.obj.body.collisionFilterGroup);
	}
}
