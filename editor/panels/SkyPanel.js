function SkyPanel(parent)
{
	Panel.call(this, parent);

	//Self pointer
	var self = this;

	//Name
	var text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Name");
	text.position.set(5, 20);
	text.updateInterface();

	this.name = new Textbox(this.element);
	this.name.position.set(45, 10);
	this.name.size.set(200, 18);
	this.name.updateInterface();
	this.name.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.name = self.name.getText();
			Editor.updateTreeView();
		}
	});

	//Auto update
	this.auto_update = new Checkbox(this.element);
	this.auto_update.setText("Auto update");
	this.auto_update.size.set(200, 15);
	this.auto_update.position.set(0, 35);
	this.auto_update.updateInterface();
	this.auto_update.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.auto_update = self.auto_update.getValue();
		}
	});

	//Day time
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Day duration(s)");
	text.size.set(100, 0);
	text.position.set(5, 70);
	text.updateInterface();

	this.day_time = new Numberbox(this.element);
	this.day_time.size.set(100, 18);
	this.day_time.position.set(95, 60);
	this.day_time.updateInterface();
	this.day_time.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.day_time = self.day_time.getValue();
			self.obj.updateSky();
		}
	});

	//Actual time 
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Time(s)")
	text.size.set(100, 0);
	text.position.set(5, 95);
	text.updateInterface();

	this.time = new Numberbox(this.element);
	this.time.size.set(100, 18);
	this.time.position.set(55, 85);
	this.time.updateInterface();
	this.time.setOnChange(function()
	{
		if(self.obj!== null)
		{
			var time = self.time.getValue();

			if(time < 0)
			{
				self.time.setValue(0);
				time = 0;
			}
			else if(time > self.obj.day_time)
			{
				self.time.setValue(self.obj.day_time);
				time = self.obj.day_time;
			}

			self.obj.time = time;
			self.obj.updateSky();
		}
	});

	//Sun distance
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Sun distance");
	text.size.set(100, 0);
	text.position.set(5, 120);
	text.updateInterface();
	
	this.sun_distance = new Numberbox(this.element);
	this.sun_distance.size.set(80, 18);
	this.sun_distance.position.set(80, 110);
	this.sun_distance.setStep(10);
	this.sun_distance.updateInterface();
	this.sun_distance.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.sun_distance = self.sun_distance.getValue();
			self.obj.updateSky();
		}
	});
}

//Functions Prototype
SkyPanel.prototype = Object.create(Panel.prototype);
SkyPanel.prototype.attachObject = attachObject;
SkyPanel.prototype.updatePanel = updatePanel;

//Update panel with object data
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.auto_update.setValue(this.obj.auto_update);
		this.day_time.setValue(this.obj.day_time);
		this.time.setValue(this.obj.time);
		this.sun_distance.setValue(this.obj.sun_distance);
	}
}

//Attach object to panel
function attachObject(obj)
{
	if(obj instanceof Sky)
	{
		this.obj = obj;
		this.updatePanel();
		this.updateInterface();
	}
}
