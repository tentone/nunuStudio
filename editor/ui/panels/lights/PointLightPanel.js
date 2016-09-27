"use strict";

function PointLightPanel(parent)
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

	//Color
	this.form.addText("Color");
	this.color = new ColorChooser(this.form.element);
	this.color.size.set(80, 18);
	this.color.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var color = self.color.getValue();
			self.obj.color.setRGB(color.r, color.g, color.b);
		}
	});
	this.form.add(this.color);
	this.form.nextRow();

	//Distance
	this.form.addText("Distance");
	this.distance = new NumberBox(this.form.element);
	this.distance.size.set(60, 18);
	this.distance.setStep(0.1);
	this.distance.setRange(0, Number.MAX_SAFE_INTEGER);
	this.distance.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.distance = self.distance.getValue();
		}
	});
	this.form.add(this.distance);
	this.form.nextRow();

	//Intensity
	this.form.addText("Intensity");
	this.intensity = new Slider(this.form.element);
	this.intensity.size.set(160, 18);
	this.intensity.setStep(0.1);
	this.intensity.setRange(0, 10);
	this.intensity.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.intensity = self.intensity.getValue();
		}
	});
	this.form.add(this.intensity);
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

	//Shadow map
	this.form.addText("Shadows");
	this.form.nextRow();

	//Cast shadow
	this.cast_shadow = new CheckBox(this.form.element);
	this.cast_shadow.setText("Cast Shadows");
	this.cast_shadow.size.set(200, 15);
	this.cast_shadow.position.set(5, 85);
	this.cast_shadow.updateInterface();
	this.cast_shadow.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.castShadow = self.cast_shadow.getValue();
		}
	});
	this.form.add(this.cast_shadow);
	this.form.nextRow();

	//Shadow resolution
	this.form.addText("Resolution");
	this.shadow_width = new DropdownList(this.form.element);
	this.shadow_width.size.set(60, 18);
	this.shadow_width.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.shadow.mapSize.width = self.shadow_width.getValue();
			self.obj.updateShadowMap();
		}
	});
	this.form.add(this.shadow_width);
	this.form.addText("x");
	this.shadow_height = new DropdownList(this.form.element);
	this.shadow_height.size.set(60, 18);
	this.shadow_height.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.shadow.mapSize.height = self.shadow_height.getValue();
			self.obj.updateShadowMap();
		}
	});
	this.form.add(this.shadow_height);
	this.form.nextRow();
	for(var i = 5; i < 13; i++)
	{
		var size = Math.pow(2, i);
		this.shadow_width.addValue(size.toString(), size);
		this.shadow_height.addValue(size.toString(), size);
	}

	//Shadowmap camera near
	this.form.addText("Near");
	this.shadow_near = new NumberBox(this.form.element);
	this.shadow_near.size.set(60, 18);
	this.shadow_near.setStep(0.1);
	this.shadow_near.setRange(0, Number.MAX_SAFE_INTEGER);
	this.shadow_near.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.shadow.camera.near = self.shadow_near.getValue();
			self.obj.updateShadowMap();
		}
	});
	this.form.add(this.shadow_near);

	//Shadowmap camera far
	this.form.addText("Far");
	this.shadow_far = new NumberBox(this.form.element);
	this.shadow_far.size.set(60, 18);
	this.shadow_far.setStep(0.1);
	this.shadow_far.setRange(0, Number.MAX_SAFE_INTEGER);
	this.shadow_far.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.shadow.camera.far = self.shadow_far.getValue();
			self.obj.updateShadowMap();
		}
	});
	this.form.add(this.shadow_far);
	this.form.nextRow();

	//Update form
	this.form.updateInterface();
}

//Super prototypes
PointLightPanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
PointLightPanel.prototype.updatePanel = function()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.position.setValue(this.obj.position);
		this.scale.setValue(this.obj.scale.x, this.obj.scale.y, this.obj.scale.z);
		this.rotation.setValue(this.obj.rotation.x, this.obj.rotation.y, this.obj.rotation.z);
		
		this.color.setValue(this.obj.color.r, this.obj.color.g, this.obj.color.b);
		this.distance.setValue(this.obj.distance);
		this.intensity.setValue(this.obj.intensity);
		this.visible.setValue(this.obj.visible);
		this.static.setValue(!this.obj.matrixAutoUpdate);

		this.cast_shadow.setValue(this.obj.castShadow);
		this.shadow_width.setValue(this.obj.shadow.mapSize.width);
		this.shadow_height.setValue(this.obj.shadow.mapSize.height);
		this.shadow_near.setValue(this.obj.shadow.camera.near);
		this.shadow_far.setValue(this.obj.shadow.camera.far);
	}
}
