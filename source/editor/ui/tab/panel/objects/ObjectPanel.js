"use strict";

function ObjectPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Name
	this.form.addText("Name");
	this.name = new TextBox(this.form.element);
	this.name.size.set(190, 18);
	this.name.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "name", self.name.getText()));
		Editor.updateObjectsViews();
	});
	this.form.add(this.name);
	this.form.nextRow();

	//UUID
	if(Editor.settings.general.showUUID)
	{
		this.form.addText("UUID");
		this.uuid = this.form.addText("");
		this.form.nextRow();
	}
	
	//Type
	if(Editor.settings.general.showType)
	{
		this.form.addText("Type");
		this.type = this.form.addText("");
		this.form.nextRow();
	}

	//Position
	this.form.addText("Position");
	this.position = new CoordinatesBox(this.form.element);
	this.position.size.set(190, 18);
	this.position.setStep(0.01);
	this.position.setOnChange(function()
	{
		var position = self.position.getValue();
		var object = self.obj.position;

		Editor.history.add(new ActionBundle(
		[
			new ChangeAction(object, "x", position.x),
			new ChangeAction(object, "y", position.y),
			new ChangeAction(object, "z", position.z)
		]));
	});
	this.form.add(this.position);
	this.form.nextRow();

	var text = this.form.addText("Scale");
	text.size.x -= 20;

	//Scale lock
	this.scaleRatioLock = new CheckBox(this.form.element);
	this.scaleRatioLock.setAltText("Lock scale ratio");
	this.scaleRatioLock.size.set(15, 15);
	this.form.add(this.scaleRatioLock);
	
	//Scale
	this.scale = new CoordinatesBox(this.form.element);
	this.scale.size.set(190, 18);
	this.scale.setStep(0.01);
	this.scale.setOnChange(function()
	{
		var scale = self.scale.getValue();
		var object = self.obj.scale;
		
		if(self.scaleRatioLock.getValue())
		{
			if(scale.x !== object.x)
			{
				var ratio = scale.x / object.x;
				scale.y *= ratio;
				scale.z *= ratio;
			}
			else if(scale.y !== object.y)
			{
				var ratio = scale.y / object.y;
				scale.x *= ratio;
				scale.z *= ratio;
			}
			else if(scale.z !== object.z)
			{
				var ratio = scale.z / object.z;
				scale.x *= ratio;
				scale.y *= ratio;
			}

			self.scale.setValue(scale.x, scale.y, scale.z);
		}

		Editor.history.add(new ActionBundle(
		[
			new ChangeAction(object, "x", scale.x),
			new ChangeAction(object, "y", scale.y),
			new ChangeAction(object, "z", scale.z)
		]));
	});
	this.form.add(this.scale);
	this.form.nextRow();

	//Rotation
	this.form.addText("Rotation");
	this.rotation = new CoordinatesBox(this.form.element);
	this.rotation.size.set(190, 18);
	this.rotation.setStep(0.01);
	this.rotation.setOnChange(function()
	{
		var rotation = self.rotation.getValue();
		var object = self.obj.rotation;

		Editor.history.add(new ActionBundle(
		[
			new ChangeAction(object, "x", rotation.x),
			new ChangeAction(object, "y", rotation.y),
			new ChangeAction(object, "z", rotation.z)
		]));
	});
	this.form.add(this.rotation);
	this.form.nextRow();

	//Visible
	this.form.addText("Visible");
	this.visible = new CheckBox(this.form.element);
	this.visible.size.set(15, 15);
	this.visible.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "visible", self.visible.getValue()));
	});
	this.form.add(this.visible);
	this.form.nextRow();

	//Static
	this.form.addText("Static Object");
	this.static = new CheckBox(this.form.element);
	this.static.size.set(15, 15);
	this.static.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "matrixAutoUpdate", !self.static.getValue()));
	});
	this.form.add(this.static);
	this.form.nextRow();
}

ObjectPanel.prototype = Object.create(Panel.prototype);

//Update panel information
ObjectPanel.prototype.updatePanel = function()
{
	this.name.setText(this.obj.name);
		
	if(this.uuid !== undefined)
	{
		this.uuid.setText(this.obj.uuid);
	}
	
	if(this.type !== undefined)
	{
		this.type.setText(this.obj.type);
	}

	this.position.setValue(this.obj.position);
	this.scale.setValue(this.obj.scale);
	this.rotation.setValue(this.obj.rotation);
	this.visible.setValue(this.obj.visible);
	this.static.setValue(!this.obj.matrixAutoUpdate);
};