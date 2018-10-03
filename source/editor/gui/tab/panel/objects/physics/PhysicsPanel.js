"use strict";

function PhysicsPanel(parent, object)
{
	ObjectPanel.call(this, parent, object);

	var self = this;

	//Scale
	this.scale.setOnChange(function()
	{
		if(self.object !== null)
		{
			var scale = self.scale.getValue();
			self.object.scale.set(scale.x, scale.y, scale.z);

			//Update physics objects
			var shapes = self.object.body.shapes;
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

	this.form.addText("Physics");
	this.form.nextRow();

	//Body Type
	this.form.addText("Type");
	this.bodyType = new DropdownList(this.form);
	this.bodyType.size.set(100, 18);
	this.bodyType.addValue("Static", CANNON.Body.STATIC);
	this.bodyType.addValue("Dynamic", CANNON.Body.DYNAMIC);
	this.bodyType.addValue("Kinematic", CANNON.Body.KINEMATIC);
	this.bodyType.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object.body, "type", self.bodyType.getValue()));
	});
	this.form.add(this.bodyType);
	this.form.nextRow();

	//Body mass
	this.form.addText("Mass");
	this.mass = new NumberBox(this.form);
	this.mass.size.set(50, 18);
	this.mass.setStep(0.1);
	this.mass.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object.body, "mass", self.mass.getValue()));
	});
	this.form.add(this.mass);
	this.form.nextRow();

	//Body linear damping
	this.form.addText("Linear Damp.");
	this.linearDamping = new NumberBox(this.form);
	this.linearDamping.size.set(50, 18);
	this.linearDamping.setStep(0.01);
	this.linearDamping.setRange(0, 1);
	this.linearDamping.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object.body, "linearDamping", self.linearDamping.getValue()));
	});
	this.form.add(this.linearDamping);
	this.form.nextRow();

	//Body angular damping
	this.form.addText("Angular Damp.");
	this.angularDamping = new NumberBox(this.form);
	this.angularDamping.size.set(50, 18);
	this.angularDamping.setStep(0.01);
	this.angularDamping.setRange(0, 1);
	this.angularDamping.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object.body, "angularDamping", self.angularDamping.getValue()));
	});
	this.form.add(this.angularDamping);
	this.form.nextRow();

	//Fixed rotation
	this.fixedRotation = new CheckBox(this.form);
	this.form.addText("Lock Rotation");
	this.fixedRotation.size.set(18, 18);
	this.fixedRotation.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object.body, "fixedRotation", self.fixedRotation.getValue()));
	});
	this.form.add(this.fixedRotation);
	this.form.nextRow();

	//Collising group
	this.form.addText("Physics Group");
	this.collisionFilterGroup = new NumberBox(this.form);
	this.collisionFilterGroup.size.set(30, 18);
	this.collisionFilterGroup.setStep(1);
	this.collisionFilterGroup.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object.body, "collisionFilterGroup", self.collisionFilterGroup.getValue()));
	});
	this.form.add(this.collisionFilterGroup);
	this.form.nextRow();

	//Allow sleep
	this.allowSleep = new CheckBox(this.form);
	this.form.addText("Allow Sleep");
	this.allowSleep.size.set(18, 18);
	this.allowSleep.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object.body, "allowSleep", self.allowSleep.getValue()));
	});
	this.form.add(this.allowSleep);
	this.form.nextRow();

	//Sleep speed limit
	this.form.addText("Sleep speed limit");
	this.sleepSpeedLimit = new NumberBox(this.form);
	this.sleepSpeedLimit.size.set(50, 18);
	this.sleepSpeedLimit.setStep(0.01);
	this.sleepSpeedLimit.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object.body, "sleepSpeedLimit", self.sleepSpeedLimit.getValue()));
	});
	this.form.add(this.sleepSpeedLimit);
	this.form.nextRow();

	//Sleep time limit
	this.form.addText("Sleep time limit");
	this.sleepTimeLimit = new NumberBox(this.form);
	this.sleepTimeLimit.size.set(50, 18);
	this.sleepTimeLimit.setStep(0.01);
	this.sleepTimeLimit.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object.body, "sleepTimeLimit", self.sleepTimeLimit.getValue()));
	});
	this.form.add(this.sleepTimeLimit);
	this.form.nextRow();
}

PhysicsPanel.prototype = Object.create(ObjectPanel.prototype);

PhysicsPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);

	this.bodyType.setValue(this.object.body.type);
	this.mass.setValue(this.object.body.mass);
	this.linearDamping.setValue(this.object.body.linearDamping);
	this.angularDamping.setValue(this.object.body.angularDamping);
	this.allowSleep.setValue(this.object.body.allowSleep);
	this.sleepTimeLimit.setValue(this.object.body.sleepTimeLimit);
	this.sleepSpeedLimit.setValue(this.object.body.sleepSpeedLimit);
	this.fixedRotation.setValue(this.object.body.fixedRotation);
	this.collisionFilterGroup.setValue(this.object.body.collisionFilterGroup);
};
