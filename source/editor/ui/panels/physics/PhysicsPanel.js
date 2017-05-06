"use strict";

function PhysicsPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Scale
	this.scale.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			
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
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.body.type = self.type.getValue();
		}
	});
	this.form.add(this.type);
	this.form.nextRow();

	//Body mass
	this.form.addText("Mass");
	this.mass = new NumberBox(this.form.element);
	this.mass.size.set(50, 18);
	this.mass.setStep(0.1);
	this.mass.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.body.mass = self.mass.getValue();
		}
	});
	this.form.add(this.mass);
	this.form.nextRow();

	//Body linear damping
	this.form.addText("Linear Damp.");
	this.linearDamping = new NumberBox(this.form.element);
	this.linearDamping.size.set(50, 18);
	this.linearDamping.setStep(0.01);
	this.linearDamping.setRange(0, 1);
	this.linearDamping.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.body.linearDamping = self.linearDamping.getValue();
		}
	});
	this.form.add(this.linearDamping);
	this.form.nextRow();

	//Body angular damping
	this.form.addText("Angular Damp.");
	this.angularDamping = new NumberBox(this.form.element);
	this.angularDamping.size.set(50, 18);
	this.angularDamping.setStep(0.01);
	this.angularDamping.setRange(0, 1);
	this.angularDamping.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.body.angularDamping = self.angularDamping.getValue();
		}
	});
	this.form.add(this.angularDamping);
	this.form.nextRow();

	//Allow sleep
	this.allowSleep = new CheckBox(this.form.element);
	this.form.addText("Allow Sleep");
	this.allowSleep.size.set(15, 15);
	this.allowSleep.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.body.allowSleep = self.allowSleep.getValue();
		}
	});
	this.form.add(this.allowSleep);
	this.form.nextRow();

	//Sleep speed limit
	this.form.addText("Sleep Speed");
	this.sleepSpeedLimit = new NumberBox(this.form.element);
	this.sleepSpeedLimit.size.set(50, 18);
	this.sleepSpeedLimit.setStep(0.01);
	this.sleepSpeedLimit.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.body.sleepSpeedLimit = self.sleepSpeedLimit.getValue();
		}
	});
	this.form.add(this.sleepSpeedLimit);
	this.form.nextRow();

	//Sleep time limit
	this.form.addText("Sleep Time");
	this.sleepTimeLimit = new NumberBox(this.form.element);
	this.sleepTimeLimit.size.set(50, 18);
	this.sleepTimeLimit.setStep(0.01);
	this.sleepTimeLimit.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.body.sleepTimeLimit = self.sleepTimeLimit.getValue();
		}
	});
	this.form.add(this.sleepTimeLimit);
	this.form.nextRow();

	//Fixed rotation
	this.fixedRotation = new CheckBox(this.form.element);
	this.form.addText("Lock Rotation");
	this.fixedRotation.size.set(15, 15);
	this.fixedRotation.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.body.fixedRotation = self.fixedRotation.getValue();
		}
	});
	this.form.add(this.fixedRotation);
	this.form.nextRow();

	//Collising group
	this.form.addText("Physics Group");
	this.collisionFilterGroup = new NumberBox(this.form.element);
	this.collisionFilterGroup.size.set(30, 18);
	this.collisionFilterGroup.setStep(1);
	this.collisionFilterGroup.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Editor.history.push(self.obj, Action.CHANGED);
			self.obj.body.collisionFilterGroup = self.collisionFilterGroup.getValue();
		}
	});
	this.form.add(this.collisionFilterGroup);
	this.form.nextRow();

	//Update form
	this.form.updateInterface();
}

//Super prototypes
PhysicsPanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
PhysicsPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);

	if(this.obj !== null)
	{
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
};
