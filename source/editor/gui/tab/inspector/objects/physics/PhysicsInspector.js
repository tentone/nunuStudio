import {Locale} from "../../../../../locale/LocaleManager.js";
import {PhysicsObject} from "../../../../../../core/objects/physics/PhysicsObject.js";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {ObjectInspector} from "../ObjectInspector.js";
import {Editor} from "../../../../../Editor.js";
import {NumberBox} from "../../../../../components/input/NumberBox.js";
import {DropdownList} from "../../../../../components/input/DropdownList.js";
import {CheckBox} from "../../../../../components/input/CheckBox.js";
import {Shape, Body} from "cannon";

function PhysicsInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;

	// Scale
	this.scale.setOnChange(function()
	{
		if(self.object !== null)
		{
			var scale = self.scale.getValue();
			self.object.scale.set(scale.x, scale.y, scale.z);

			// Update physics objects
			var shapes = self.object.body.shapes;
			for(var i = 0; i < shapes.length; i++)
			{
				var shape = shapes[i];
				
				if(shape.type === Shape.types.BOX)
				{
					shape.halfExtents.x = scale.x / 2.0;
					shape.halfExtents.y = scale.y / 2.0;
					shape.halfExtents.z = scale.z / 2.0;
				}
				else if(shape.type === Shape.types.SPHERE)
				{
					shape.radius = scale.x;
				}
			}

		}
	});

	this.form.addText(Locale.physics);
	this.form.nextRow();

	// Mode
	this.form.addText(Locale.mode);
	this.mode = new DropdownList(this.form);
	this.mode.setAltText(Locale.hintPhysicsMode);
	this.mode.size.set(100, 18);
	this.mode.addValue(Locale.local, PhysicsObject.LOCAL);
	this.mode.addValue(Locale.world, PhysicsObject.WORLD);
	this.mode.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "mode", self.mode.getValue()));
	});
	this.form.add(this.mode);
	this.form.nextRow();

	// Body Type
	this.form.addText(Locale.type);
	this.bodyType = new DropdownList(this.form);
	this.bodyType.setAltText(Locale.hintPhysicsType)
	this.bodyType.size.set(100, 18);
	this.bodyType.addValue(Locale.static, Body.STATIC);
	this.bodyType.addValue(Locale.dynamic, Body.DYNAMIC);
	this.bodyType.addValue(Locale.kinematic, Body.KINEMATIC);
	this.bodyType.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.body, "type", self.bodyType.getValue()));
	});
	this.form.add(this.bodyType);
	this.form.nextRow();

	// Body mass
	this.form.addText(Locale.mass);
	this.mass = new NumberBox(this.form);
	this.mass.size.set(50, 18);
	this.mass.setStep(0.1);
	this.mass.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.body, "mass", self.mass.getValue()));
	});
	this.form.add(this.mass);
	this.form.nextRow();

	// Body linear damping
	this.form.addText(Locale.linearDamping);
	this.linearDamping = new NumberBox(this.form);
	this.linearDamping.size.set(50, 18);
	this.linearDamping.setStep(0.01);
	this.linearDamping.setRange(0, 1);
	this.linearDamping.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.body, "linearDamping", self.linearDamping.getValue()));
	});
	this.form.add(this.linearDamping);
	this.form.nextRow();

	// Body angular damping
	this.form.addText(Locale.angularDamping);
	this.angularDamping = new NumberBox(this.form);
	this.angularDamping.size.set(50, 18);
	this.angularDamping.setStep(0.01);
	this.angularDamping.setRange(0, 1);
	this.angularDamping.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.body, "angularDamping", self.angularDamping.getValue()));
	});
	this.form.add(this.angularDamping);
	this.form.nextRow();

	// Fixed rotation
	this.form.addText(Locale.lockRotation);
	this.fixedRotation = new CheckBox(this.form);
	this.fixedRotation.size.set(18, 18);
	this.fixedRotation.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.body, "fixedRotation", self.fixedRotation.getValue()));
	});
	this.form.add(this.fixedRotation);
	this.form.nextRow();

	// Collising group
	this.form.addText(Locale.physicsGroup);
	this.collisionFilterGroup = new NumberBox(this.form);
	this.collisionFilterGroup.size.set(30, 18);
	this.collisionFilterGroup.setStep(1);
	this.collisionFilterGroup.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.body, "collisionFilterGroup", self.collisionFilterGroup.getValue()));
	});
	this.form.add(this.collisionFilterGroup);
	this.form.nextRow();

	// Allow sleep
	this.allowSleep = new CheckBox(this.form);
	this.form.addText(Locale.allowSleep);
	this.allowSleep.size.set(18, 18);
	this.allowSleep.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.body, "allowSleep", self.allowSleep.getValue()));
	});
	this.form.add(this.allowSleep);
	this.form.nextRow();

	// Sleep speed limit
	this.form.addText(Locale.sleepSpeedLimit);
	this.sleepSpeedLimit = new NumberBox(this.form);
	this.sleepSpeedLimit.size.set(50, 18);
	this.sleepSpeedLimit.setStep(0.01);
	this.sleepSpeedLimit.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.body, "sleepSpeedLimit", self.sleepSpeedLimit.getValue()));
	});
	this.form.add(this.sleepSpeedLimit);
	this.form.nextRow();

	// Sleep time limit
	this.form.addText(Locale.sleepTimeLimit);
	this.sleepTimeLimit = new NumberBox(this.form);
	this.sleepTimeLimit.size.set(50, 18);
	this.sleepTimeLimit.setStep(0.01);
	this.sleepTimeLimit.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.body, "sleepTimeLimit", self.sleepTimeLimit.getValue()));
	});
	this.form.add(this.sleepTimeLimit);
	this.form.nextRow();
}

PhysicsInspector.prototype = Object.create(ObjectInspector.prototype);

PhysicsInspector.prototype.updateInspector = function()
{
	ObjectInspector.prototype.updateInspector.call(this);

	this.mode.setValue(this.object.mode);
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

export {PhysicsInspector};