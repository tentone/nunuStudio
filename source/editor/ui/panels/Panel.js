"use strict";

function Panel(parent, obj)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.overflow = "auto";
	this.element.style.cursor = "default";
	this.element.style.top = "0px";
	this.element.style.left = "0px";
	this.element.style.width = "100%";
	this.element.style.height = "100%";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	//Prevent Drop event
	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	//Prevent deafault when object dragged over
	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Attributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

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
			Editor.history.push(self.obj, Action.CHANGED);
			Editor.updateObjectViews();
		}
	});
	this.form.add(this.name);
	this.form.nextRow();

	//UUID
	if(Settings.general.showUuid)
	{
		this.form.addText("UUID");
		this.uuid = this.form.addText("");
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
			Editor.history.push(self.obj, Action.CHANGED);
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
			Editor.history.push(self.obj, Action.CHANGED);
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
			Editor.history.push(self.obj, Action.CHANGED);
		}
	});
	this.form.add(this.rotation);
	this.form.nextRow();

	//Attach object
	this.attach(obj);

	//Add element to document
	this.parent.appendChild(this.element);
}

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
}

//Remove element
Panel.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

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
}

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

		this.position.setValue(this.obj.position);
		this.scale.setValue(this.obj.scale);
		this.rotation.setValue(this.obj.rotation);
	}
}