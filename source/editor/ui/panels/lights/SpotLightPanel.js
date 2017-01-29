"use strict";

function SpotLightPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

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

	//Penumbra
	this.form.addText("Penumbra");
	this.penumbra = new Slider(this.form.element);
	this.penumbra.size.set(160, 18);
	this.penumbra.position.set(65, 110);
	this.penumbra.setRange(0, 1);
	this.penumbra.setStep(0.01);
	this.penumbra.updateInterface();
	this.penumbra.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.penumbra = self.penumbra.getValue();
			self.penumbra_text.setText(self.obj.penumbra);
		}
	});
	this.form.add(this.penumbra);
	this.form.nextRow();

	//Angle
	this.form.addText("Angle");
	this.angle = new Slider(this.form.element);
	this.angle.size.set(160, 18);
	this.angle.setRange(0, 1.57);
	this.angle.setStep(0.01);
	this.angle.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.angle = self.angle.getValue();
			self.angle_text.setText(self.obj.angle);
		}
	});
	this.form.add(this.angle);
	this.form.nextRow();
	
	//Visible
	this.visible = new CheckBox(this.form.element);
	this.form.addText("Visible");
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
	this.form.addText("Static Object");
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
	this.form.addText("Cast Shadows");
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
SpotLightPanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
SpotLightPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);

	if(this.obj !== null)
	{
		this.color.setValue(this.obj.color.r, this.obj.color.g, this.obj.color.b);
		this.angle.setValue(this.obj.angle);
		this.penumbra.setValue(this.obj.penumbra);
		this.visible.setValue(this.obj.visible);
		this.static.setValue(!this.obj.matrixAutoUpdate);
		
		this.cast_shadow.setValue(this.obj.castShadow);
		this.shadow_width.setValue(this.obj.shadow.mapSize.width);
		this.shadow_height.setValue(this.obj.shadow.mapSize.height);
		this.shadow_near.setValue(this.obj.shadow.camera.near);
		this.shadow_far.setValue(this.obj.shadow.camera.far);
	}
}
