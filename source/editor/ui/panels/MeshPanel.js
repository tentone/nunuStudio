"use strict";

function MeshPanel(parent)
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
	this.position.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var position = self.position.getValue();
			self.obj.position.set(position.x, position.y, position.z);
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
		}
	});
	this.form.add(this.scale);
	this.form.nextRow();

	//Rotation
	this.form.addText("Rotation");
	this.rotation = new CoordinatesBox(this.form.element);
	this.rotation.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var rotation = self.rotation.getValue();
			self.obj.rotation.set(rotation.x, rotation.y, rotation.z);
		}
	});
	this.form.add(this.rotation);
	this.form.nextRow();

	//Visible
	this.visible = new CheckBox(this.form.element);
	this.visible.setText("Visible");
	this.visible.size.set(200, 15);
	this.visible.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.visible = self.visible.getValue();
		}
	});
	this.form.add(this.visible);
	this.form.nextRow();

	//Static
	this.static = new CheckBox(this.form.element);
	this.static.setText("Static Object");
	this.static.size.set(200, 15);
	this.static.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.matrixAutoUpdate = !(self.static.getValue());
		}
	});
	this.form.add(this.static);
	this.form.nextRow();

	//Cast shadow
	this.cast_shadow = new CheckBox(this.form.element);
	this.cast_shadow.setText("Cast Shadow");
	this.cast_shadow.size.set(200, 15);
	this.cast_shadow.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.castShadow = self.cast_shadow.getValue();
		}
	});
	this.form.add(this.cast_shadow);
	this.form.nextRow();

	//Receive shadow
	this.receive_shadow = new CheckBox(this.form.element);
	this.receive_shadow.setText("Receive Shadow");
	this.receive_shadow.size.set(200, 15);
	this.receive_shadow.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.receiveShadow = self.receive_shadow.getValue();
		}
	});
	this.form.add(this.receive_shadow);
	this.form.nextRow();

	//Update form
	this.form.updateInterface();
}

//Super prototypes
MeshPanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
MeshPanel.prototype.updatePanel = function()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.position.setValue(this.obj.position.x, this.obj.position.y, this.obj.position.z);
		this.scale.setValue(this.obj.scale.x, this.obj.scale.y, this.obj.scale.z);
		this.rotation.setValue(this.obj.rotation.x, this.obj.rotation.y, this.obj.rotation.z);
		this.visible.setValue(this.obj.visible);
		this.static.setValue(!this.obj.matrixAutoUpdate);
		this.cast_shadow.setValue(this.obj.castShadow);
		this.receive_shadow.setValue(this.obj.receiveShadow);
	}
}
