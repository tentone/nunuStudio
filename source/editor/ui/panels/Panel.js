"use strict";

function Panel(parent, obj)
{
	Element.call(this, parent);

	this.element.style.overflow = "auto";
	this.element.style.cursor = "default";
	this.element.style.top = "0px";
	this.element.style.left = "0px";
	this.element.style.width = "100%";
	this.element.style.height = "100%";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	this.preventDragEvents();

	//Self pointer
	var self = this;

	//Mouse inside panel
	this.focused = false;

	this.element.onmouseenter = function()
	{
		self.focused = true;
	};

	this.element.onmouseleave = function()
	{
		self.focused = false;
	};

	//Default form
	this.form = new Form(this.element);
	this.form.position.set(5, 5);
	this.form.spacing.set(5, 5);

	//Name
	this.form.addText("Name");
	this.name = new TextBox(this.form.element);
	this.name.size.set(190, 18);
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

	//UUID
	if(Settings.general.showUUID)
	{
		this.form.addText("UUID");
		this.uuid = this.form.addText("");
		this.form.nextRow();
	}
	
	if(Settings.general.showType)
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
	this.scale.size.set(190, 18);
	this.scale.setStep(0.01);
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
	this.rotation.size.set(190, 18);
	this.rotation.setStep(0.01);
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
	this.form.addText("Visible");
	this.visible.size.set(15, 15);
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
	this.form.addText("Static Object");
	this.static.size.set(15, 15);
	this.static.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.matrixAutoUpdate = !(self.static.getValue());
		}
	});
	this.form.add(this.static);
	this.form.nextRow();

	//Attach object
	this.attach(obj);
}

Panel.prototype = Object.create(Element.prototype);

//Attach object to panel
Panel.prototype.attach = function(obj)
{
	if(obj instanceof THREE.Object3D)
	{
		this.obj = obj;
	}
	else
	{
		this.obj = null;
	}
};

//Update panel ui
Panel.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
};

//Update panel information
Panel.prototype.updatePanel = function()
{
	if(this.obj !== null)
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
	}
};