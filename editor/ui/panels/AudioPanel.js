function AudioPanel(parent)
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

	//Autoplay
	this.autoplay = new CheckBox(this.form.element);
	this.autoplay.setText("Autoplay");
	this.autoplay.size.set(150, 15);
	this.autoplay.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.autoplay = self.autoplay.getValue();
		}
	});
	this.form.add(this.autoplay);
	this.form.nextRow();

	//Loop
	this.loop = new CheckBox(this.form.element);
	this.loop.setText("Loop");
	this.loop.size.set(150, 15);
	this.loop.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.souce.loop = self.loop.getValue();
		}
	});
	this.form.add(this.loop);
	this.form.nextRow();

	//Playback Rate
	this.form.addText("Playback Speed");
	this.playbackRate = new NumberBox(this.form.element);
	this.playbackRate.size.set(60, 18);
	this.playbackRate.setStep(0.01);
	this.playbackRate.setRange(0, 9999999);
	this.playbackRate.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.playbackRate = self.playbackRate.getValue();
		}
	});
	this.form.add(this.playbackRate);
	this.form.nextRow();

	this.form.updateInterface();
}

//Functions Prototype
AudioPanel.prototype = Object.create(Panel.prototype);
AudioPanel.prototype.attachObject = attachObject;
AudioPanel.prototype.updatePanel = updatePanel;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.autoplay.setValue(this.obj.autoplay);
		this.loop.setValue(this.obj.source.loop);
		this.playbackRate.setValue(this.obj.playbackRate);
	}
}

//Attach object to panel
function attachObject(obj)
{
	this.obj = obj;
	this.updatePanel();
	this.updateInterface();
}
