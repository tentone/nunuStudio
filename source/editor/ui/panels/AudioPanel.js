"use strict";

function AudioPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

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

	//Playback Rate
	this.form.addText("Playback Rate");
	this.playbackRate = new NumberBox(this.form.element);
	this.playbackRate.size.set(60, 18);
	this.playbackRate.setStep(0.1);
	this.playbackRate.setRange(0, Number.MAX_SAFE_INTEGER);
	this.playbackRate.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.playbackRate = self.playbackRate.getValue();
		}
	});
	this.form.add(this.playbackRate);
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
			self.obj.loop = self.loop.getValue();
		}
	});
	this.form.add(this.loop);
	this.form.nextRow();

	//Update form
	this.form.updateInterface();
}

//Super prototypes
AudioPanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
AudioPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);

	if(this.obj !== null)
	{
		this.static.setValue(!this.obj.matrixAutoUpdate);
		this.autoplay.setValue(this.obj.autoplay);
		this.loop.setValue(this.obj.loop);
		this.playbackRate.setValue(this.obj.playbackRate);
	}
}
