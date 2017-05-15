"use strict";

function SkyPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;
	
	//Auto update
	this.autoUpdate = new CheckBox(this.form.element);
	this.form.addText("Auto update");
	this.autoUpdate.size.set(15, 15);
	this.autoUpdate.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.autoUpdate = self.autoUpdate.getValue();
		}
	});
	this.form.add(this.autoUpdate);
	this.form.nextRow();

	//Sky color
	this.form.addText("Sky color");
	this.form.nextRow();

	//Top color
	this.form.addText("Top color");
	this.colorTop = [];
	for(var i = 0; i < 4; i++)
	{
		this.colorTop.push(new ColorChooser(this.form.element));
		this.colorTop[i].element.index = i;
		this.colorTop[i].size.set(42, 18);
		this.colorTop[i].setOnChange(function()
		{
			if(self.obj !== null)
			{
				var color = self.colorTop[this.index].getValue();
				self.obj.colorTop[this.index].setRGB(color.r, color.g, color.b);
				self.obj.updateSky();
			}
		});
		this.form.add(this.colorTop[i]);
	}
	this.form.nextRow();

	//Bottom color
	this.form.addText("Bottom color");
	this.colorBottom = [];
	for(var i = 0; i < 4; i++)
	{
		this.colorBottom.push(new ColorChooser(this.form.element));
		this.colorBottom[i].element.index = i;
		this.colorBottom[i].size.set(42, 18);
		this.colorBottom[i].setOnChange(function()
		{
			if(self.obj !== null)
			{
				var color = self.colorBottom[this.index].getValue();
				self.obj.colorBottom[this.index].setRGB(color.r, color.g, color.b);
				self.obj.updateSky();
			}
		});
		this.form.add(this.colorBottom[i]);
	}
	this.form.nextRow();

	this.form.addText("Sun Color");
	this.sunColor = new ColorChooser(this.form.element);
	this.sunColor.size.set(80, 18);
	this.sunColor.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.sunColor = self.sunColor.getValueHex();
			self.obj.updateSky();
		}
	});
	this.form.add(this.sunColor);
	this.form.nextRow();

	this.form.addText("Moon Color");
	this.moonColor = new ColorChooser(this.form.element);
	this.moonColor.size.set(80, 18);
	this.moonColor.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.moonColor = self.moonColor.getValueHex();
			self.obj.updateSky();
		}
	});
	this.form.add(this.moonColor);
	this.form.nextRow();

	//Day time
	this.form.addText("Day time");
	this.form.nextRow();

	//Day time
	this.form.addText("Day duration");
	this.dayTime = new NumberBox(this.form.element);
	this.dayTime.size.set(60, 18);
	this.dayTime.setStep(0.1);
	this.dayTime.setOnChange(function()
	{
		if(self.obj !== null)
		{
			//Check and set day time
			var dayTime = self.dayTime.getValue();
			if(dayTime < 0)
			{
				dayTime = 0;
				self.dayTime.setValue(dayTime);
			}
			self.obj.dayTime = dayTime;

			//Check actual time
			if(self.obj.time > dayTime)
			{
				self.obj.time = dayTime;
				self.time.setValue(dayTime);
			}

			self.time.setRange(0, dayTime);
			self.obj.updateSky();
		}
	});
	this.form.add(this.dayTime);
	this.form.addText("s", true);
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
			else if(time > self.obj.dayTime)
			{
				time = self.obj.dayTime;
				self.time.setValue(time);
			}

			self.obj.time = time;
			self.obj.updateSky();
		}
	});
	this.form.add(this.time);
	this.form.addText("s", true);
	this.form.nextRow();

	//Sun distance
	this.form.addText("Sun distance");
	this.sunDistance = new NumberBox(this.form.element);
	this.sunDistance.size.set(60, 18);
	this.sunDistance.setStep(10);
	this.sunDistance.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.sunDistance = self.sunDistance.getValue();
			self.obj.updateSky();
		}
	});
	this.form.add(this.sunDistance);
	this.form.nextRow();

	//Shadow map
	this.form.addText("Shadows");
	this.form.nextRow();

	//Cast shadow
	this.castShadow = new CheckBox(this.form.element);
	this.form.addText("Cast Shadows");
	this.castShadow.size.set(15, 15);
	this.castShadow.position.set(5, 85);
	this.castShadow.updateInterface();
	this.castShadow.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.sun.castShadow = self.castShadow.getValue();
		}
	});
	this.form.add(this.castShadow);
	this.form.nextRow();

	//Shadow resolution
	this.form.addText("Resolution");
	this.shadowWidth = new DropdownList(this.form.element);
	this.shadowWidth.size.set(60, 18);
	this.shadowWidth.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.sun.shadow.mapSize.width = self.shadowWidth.getValue();
			self.obj.sun.updateShadowMap();
		}
	});
	this.form.add(this.shadowWidth);
	this.form.addText("x", true);
	this.shadowHeight = new DropdownList(this.form.element);
	this.shadowHeight.size.set(60, 18);
	this.shadowHeight.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.sun.shadow.mapSize.height = self.shadowHeight.getValue();
			self.obj.sun.updateShadowMap();
		}
	});
	this.form.add(this.shadowHeight);
	this.form.nextRow();
	for(var i = 5; i < 13; i++)
	{
		var size = Math.pow(2, i);
		this.shadowWidth.addValue(size.toString(), size);
		this.shadowHeight.addValue(size.toString(), size);
	}

	//Shadowmap camera near
	this.form.addText("Near");
	this.shadowNear = new NumberBox(this.form.element);
	this.shadowNear.size.set(60, 18);
	this.shadowNear.setStep(0.1);
	this.shadowNear.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.sun.shadow.camera.near = self.shadowNear.getValue();
			self.obj.sun.updateShadowMap();
		}
	});
	this.form.add(this.shadowNear);
	this.form.nextRow();
	
	//Shadowmap camera far
	this.form.addText("Far");
	this.shadowFar = new NumberBox(this.form.element);
	this.shadowFar.size.set(60, 18);
	this.shadowFar.setStep(0.1);
	this.shadowFar.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.sun.shadow.camera.far = self.shadowFar.getValue();
			self.obj.sun.updateShadowMap();
		}
	});
	this.form.add(this.shadowFar);
	this.form.nextRow();

	//Shadowmap camera left
	this.form.addText("Left");
	this.shadowLeft = new NumberBox(this.form.element);
	this.shadowLeft.size.set(60, 18);
	this.shadowLeft.setStep(0.1);
	this.shadowLeft.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.sun.shadow.camera.left = self.shadowLeft.getValue();
			self.obj.sun.updateShadowMap();
		}
	});
	this.form.add(this.shadowLeft);
	this.form.nextRow();

	//Shadowmap camera right
	this.form.addText("Right");
	this.shadowRight = new NumberBox(this.form.element);
	this.shadowRight.size.set(60, 18);
	this.shadowRight.setStep(0.1);
	this.shadowRight.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.sun.shadow.camera.right = self.shadowRight.getValue();
			self.obj.sun.updateShadowMap();
		}
	});
	this.form.add(this.shadowRight);
	this.form.nextRow();

	//Shadowmap camera top
	this.form.addText("Top");
	this.shadowTop = new NumberBox(this.form.element);
	this.shadowTop.size.set(60, 18);
	this.shadowTop.setStep(0.1);
	this.shadowTop.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.sun.shadow.camera.top = self.shadowTop.getValue();
			self.obj.sun.updateShadowMap();
		}
	});
	this.form.add(this.shadowTop);
	this.form.nextRow();

	//Shadowmap camera bottom
	this.form.addText("Bottom");
	this.shadowBottom = new NumberBox(this.form.element);
	this.shadowBottom.size.set(60, 18);
	this.shadowBottom.setStep(0.1);
	this.shadowBottom.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.sun.shadow.camera.bottom = self.shadowBottom.getValue();
			self.obj.sun.updateShadowMap();
		}
	});
	this.form.add(this.shadowBottom);
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
		this.autoUpdate.setValue(this.obj.autoUpdate);

		for(var i = 0; i < 4; i++)
		{
			this.colorBottom[i].setValue(this.obj.colorBottom[i].r, this.obj.colorBottom[i].g, this.obj.colorBottom[i].b);
			this.colorTop[i].setValue(this.obj.colorTop[i].r, this.obj.colorTop[i].g, this.obj.colorTop[i].b);
		}
		this.sunColor.setValueHex(this.obj.sunColor);
		this.moonColor.setValueHex(this.obj.moonColor);

		this.dayTime.setValue(this.obj.dayTime);
		this.time.setValue(this.obj.time);
		this.sunDistance.setValue(this.obj.sunDistance);

		this.castShadow.setValue(this.obj.sun.castShadow);
		this.shadowWidth.setValue(this.obj.sun.shadow.mapSize.width);
		this.shadowHeight.setValue(this.obj.sun.shadow.mapSize.height);
		this.shadowNear.setValue(this.obj.sun.shadow.camera.near);
		this.shadowFar.setValue(this.obj.sun.shadow.camera.far);
		this.shadowLeft.setValue(this.obj.sun.shadow.camera.left);
		this.shadowRight.setValue(this.obj.sun.shadow.camera.right);
		this.shadowTop.setValue(this.obj.sun.shadow.camera.top);
		this.shadowBottom.setValue(this.obj.sun.shadow.camera.bottom);
	}
};
