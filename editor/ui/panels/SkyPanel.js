"use strict";

function SkyPanel(parent)
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
	this.position.setStep(0.1);
	this.position.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.position.copy(self.position.getValue());
		}
	});
	this.form.add(this.position);
	this.form.nextRow();

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
	this.form.addText("Day duration(s)");
	this.day_time = new NumberBox(this.form.element);
	this.day_time.size.set(100, 18);
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
	this.form.nextRow();

	//Actual time 
	this.form.addText("Time(s)")
	this.time = new NumberBox(this.form.element);
	this.time.size.set(100, 18);
	this.time.setStep(0.1);
	this.time.setOnChange(function()
	{
		if(self.obj!== null)
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
	this.form.nextRow();

	//Sun distance
	this.form.addText("Sun distance");
	this.sun_distance = new NumberBox(this.form.element);
	this.sun_distance.size.set(80, 18);
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

	//Update form
	this.form.updateInterface();
}

//Super prototypes
SkyPanel.prototype = Object.create(Panel.prototype);

//Update panel with object data
SkyPanel.prototype.updatePanel = function()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.position.setValue(this.obj.position);
		this.auto_update.setValue(this.obj.auto_update);
		this.day_time.setValue(this.obj.day_time);
		this.time.setValue(this.obj.time);
		this.sun_distance.setValue(this.obj.sun_distance);
	}
}
