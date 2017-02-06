"use strict";

function SkyPanel(parent)
{
	Panel.call(this, parent);

	//Self pointer
	var self = this;

	//Auto update
	this.auto_update = new CheckBox(this.form.element);
	this.auto_update.setText("Auto update");
	this.auto_update.size.set(200, 15);
	this.auto_update.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.auto_update = self.auto_update.getValue();
		}
	});
	this.form.add(this.auto_update);
	this.form.nextRow();

	//Day time
	this.form.addText("Day duration");
	this.day_time = new NumberBox(this.form.element);
	this.day_time.size.set(60, 18);
	this.day_time.setStep(0.1);
	this.day_time.setOnChange(function()
	{
		if(self.obj !== null)
		{
			//Check and set day time
			var day_time = self.day_time.getValue();
			if(day_time < 0)
			{
				day_time = 0;
				self.day_time.setValue(day_time);
			}
			self.obj.day_time = day_time;

			//Check actual time
			if(self.obj.time > day_time)
			{
				self.obj.time = day_time;
				self.time.setValue(day_time);
			}

			self.time.setRange(0, day_time);
			self.obj.updateSky();
		}
	});
	this.form.add(this.day_time);
	this.form.addText("s");
	this.form.nextRow();

	//Actual time 
	this.form.addText("Time");
	this.time = new NumberBox(this.form.element);
	this.time.size.set(60, 18);
	this.time.setStep(0.1);
	this.time.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var time = self.time.getValue();

			if(time < 0)
			{
				time = 0;
				self.time.setValue(time);
			}
			else if(time > self.obj.day_time)
			{
				time = self.obj.day_time;
				self.time.setValue(time);
			}

			self.obj.time = time;
			self.obj.updateSky();
		}
	});
	this.form.add(this.time);
	this.form.addText("s");
	this.form.nextRow();

	//Sun distance
	this.form.addText("Sun distance");
	this.sun_distance = new NumberBox(this.form.element);
	this.sun_distance.size.set(60, 18);
	this.sun_distance.setStep(10);
	this.sun_distance.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.sun_distance = self.sun_distance.getValue();
			self.obj.updateSky();
		}
	});
	this.form.add(this.sun_distance);
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
			self.obj.sun.castShadow = self.cast_shadow.getValue();
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
			self.obj.sun.shadow.mapSize.width = self.shadow_width.getValue();
			self.obj.sun.updateShadowMap();
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
			self.obj.sun.shadow.mapSize.height = self.shadow_height.getValue();
			self.obj.sun.updateShadowMap();
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
			self.obj.sun.shadow.camera.near = self.shadow_near.getValue();
			self.obj.sun.updateShadowMap();
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
			self.obj.sun.shadow.camera.far = self.shadow_far.getValue();
			self.obj.sun.updateShadowMap();
		}
	});
	this.form.add(this.shadow_far);
	this.form.nextRow();

	//Shadowmap camera left
	this.form.addText("Left");
	this.shadow_left = new NumberBox(this.form.element);
	this.shadow_left.size.set(60, 18);
	this.shadow_left.setStep(0.1);
	this.shadow_left.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.sun.shadow.camera.left = self.shadow_left.getValue();
			self.obj.sun.updateShadowMap();
		}
	});
	this.form.add(this.shadow_left);

	//Shadowmap camera right
	this.form.addText("Right");
	this.shadow_right = new NumberBox(this.form.element);
	this.shadow_right.size.set(60, 18);
	this.shadow_right.setStep(0.1);
	this.shadow_right.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.sun.shadow.camera.right = self.shadow_right.getValue();
			self.obj.sun.updateShadowMap();
		}
	});
	this.form.add(this.shadow_right);
	this.form.nextRow();

	//Shadowmap camera top
	this.form.addText("Top");
	this.shadow_top = new NumberBox(this.form.element);
	this.shadow_top.size.set(60, 18);
	this.shadow_top.setStep(0.1);
	this.shadow_top.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.sun.shadow.camera.top = self.shadow_top.getValue();
			self.obj.sun.updateShadowMap();
		}
	});
	this.form.add(this.shadow_top);

	//Shadowmap camera bottom
	this.form.addText("Bottom");
	this.shadow_bottom = new NumberBox(this.form.element);
	this.shadow_bottom.size.set(60, 18);
	this.shadow_bottom.setStep(0.1);
	this.shadow_bottom.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.sun.shadow.camera.bottom = self.shadow_bottom.getValue();
			self.obj.sun.updateShadowMap();
		}
	});
	this.form.add(this.shadow_bottom);
	this.form.nextRow();

	//Update form
	this.form.updateInterface();
}

//Super prototypes
SkyPanel.prototype = Object.create(Panel.prototype);

//Update panel with object data
SkyPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);
	
	if(this.obj !== null)
	{
		this.auto_update.setValue(this.obj.auto_update);
		this.day_time.setValue(this.obj.day_time);
		this.time.setValue(this.obj.time);
		this.sun_distance.setValue(this.obj.sun_distance);

		this.cast_shadow.setValue(this.obj.sun.castShadow);
		this.shadow_width.setValue(this.obj.sun.shadow.mapSize.width);
		this.shadow_height.setValue(this.obj.sun.shadow.mapSize.height);
		this.shadow_near.setValue(this.obj.sun.shadow.camera.near);
		this.shadow_far.setValue(this.obj.sun.shadow.camera.far);
		this.shadow_left.setValue(this.obj.sun.shadow.camera.left);
		this.shadow_right.setValue(this.obj.sun.shadow.camera.right);
		this.shadow_top.setValue(this.obj.sun.shadow.camera.top);
		this.shadow_bottom.setValue(this.obj.sun.shadow.camera.bottom);
	}
}
