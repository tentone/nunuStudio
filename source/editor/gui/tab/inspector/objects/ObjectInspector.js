"use strict";

function ObjectInspector(parent, object)
{
	Inspector.call(this, parent, object);

	var self = this;

	// Name
	this.form.addText(Locale.name);
	this.name = new TextBox(this.form);
	this.name.size.set(0, 18);
	this.name.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "name", self.name.getText()));
		Editor.updateObjectsViewsGUI();
	});
	this.form.add(this.name);
	this.form.nextRow();

	// UUID
	if(Editor.settings.general.showUUID)
	{
		this.form.addText(Locale.uuid);
		this.uuid = this.form.addText("");
		this.form.nextRow();
	}
	
	// Type
	if(Editor.settings.general.showType)
	{
		this.form.addText(Locale.type);
		this.type = this.form.addText("");
		this.form.nextRow();
	}

	// Position
	this.form.addText(Locale.position);
	this.position = new VectorBox(this.form);
	this.position.size.set(0, 18);
	this.position.setStep(0.01);
	this.position.setOnChange(function()
	{
		var position = self.position.getValue();
		var object = self.object.position;

		Editor.addAction(new ActionBundle(
		[
			new ChangeAction(object, "x", position.x),
			new ChangeAction(object, "y", position.y),
			new ChangeAction(object, "z", position.z)
		]));
	});
	this.form.add(this.position);
	this.form.nextRow();

	var text = this.form.addText(Locale.scale);

	// Scale lock
	this.scaleRatioLock = new CheckBox(text);
	this.scaleRatioLock.setAltText("Lock scale ratio");
	this.scaleRatioLock.size.set(18, 18);
	this.scaleRatioLock.setMode(Element.TOP_RIGHT);
	this.scaleRatioLock.updateInterface();
	
	// Scale
	this.scale = new VectorBox(this.form);
	this.scale.size.set(0, 18);
	this.scale.setStep(0.01);
	this.scale.setOnChange(function()
	{
		var scale = self.scale.getValue();
		var object = self.object.scale;
		
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

		Editor.addAction(new ActionBundle(
		[
			new ChangeAction(object, "x", scale.x),
			new ChangeAction(object, "y", scale.y),
			new ChangeAction(object, "z", scale.z)
		]));
	});
	this.form.add(this.scale);
	this.form.nextRow();

	// Rotation
	this.form.addText(Locale.rotation);
	this.rotation = new VectorBox(this.form);
	this.rotation.size.set(0, 18);
	this.rotation.setStep(0.01);
	this.rotation.isAngle = true;
	this.rotation.setOnChange(function()
	{
		var rotation = self.rotation.getValue();
		var object = self.object.rotation;

		Editor.addAction(new ActionBundle(
		[
			new ChangeAction(object, "x", rotation.x),
			new ChangeAction(object, "y", rotation.y),
			new ChangeAction(object, "z", rotation.z)
		]));
	});
	this.form.add(this.rotation);
	this.form.nextRow();

	// Visible
	this.form.addText("Visible");
	this.visible = new CheckBox(this.form);
	this.visible.size.set(18, 18);
	this.visible.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "visible", self.visible.getValue()));
	});
	this.form.add(this.visible);
	this.form.nextRow();

	// Render order
	this.form.addText("Render order");
	this.renderOrder = new NumberBox(this.form);
	this.renderOrder.size.set(0, 18);
	this.renderOrder.setRange(0, Number.MAX_SAFE_INTEGER);
	this.renderOrder.setStep(1);
	this.renderOrder.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "renderOrder", self.renderOrder.getValue()));
	});
	this.form.add(this.renderOrder);
	this.form.nextRow();

	// Static
	this.form.addText("Static Object");
	this.static = new CheckBox(this.form);
	this.static.size.set(18, 18);
	this.static.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "matrixAutoUpdate", !self.static.getValue()));
	});
	this.form.add(this.static);
	this.form.nextRow();
}

ObjectInspector.prototype = Object.create(Inspector.prototype);

ObjectInspector.prototype.updateInspector = function()
{
	this.name.setText(this.object.name);
		
	if(this.uuid !== undefined)
	{
		this.uuid.setText(this.object.uuid);
	}
	
	if(this.type !== undefined)
	{
		this.type.setText(this.object.type);
	}

	this.position.setValue(this.object.position);
	this.scale.setValue(this.object.scale);
	this.rotation.setValue(this.object.rotation);
	this.visible.setValue(this.object.visible);
	this.renderOrder.setValue(this.object.renderOrder);
	this.static.setValue(!this.object.matrixAutoUpdate);
};