"use strict";

function AudioPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Audio player
	this.player = new AudioPlayer(this.form.element);
	this.player.size.set(240, 40);
	this.form.add(this.player);
	this.form.nextRow();

	//Static
	this.form.addText("Static Object");
	this.static = new CheckBox(this.form.element);
	this.static.size.set(20, 15);
	this.static.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.matrixAutoUpdate = !(self.static.getValue());
			Editor.history.push(self.obj, Action.CHANGED);
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
			Editor.history.push(self.obj, Action.CHANGED);
		}
	});
	this.form.add(this.playbackRate);
	this.form.nextRow();

	//Autoplay
	this.autoplay = new CheckBox(this.form.element);
	this.form.addText("Autoplay");
	this.autoplay.size.set(20, 15);
	this.autoplay.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.autoplay = self.autoplay.getValue();
			Editor.history.push(self.obj, Action.CHANGED);
		}
	});
	this.form.add(this.autoplay);
	this.form.nextRow();

	//Loop
	this.loop = new CheckBox(this.form.element);
	this.form.addText("Loop");
	this.loop.size.set(20, 15);
	this.loop.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.loop = self.loop.getValue();
			Editor.history.push(self.obj, Action.CHANGED);
		}
	});
	this.form.add(this.loop);
	this.form.nextRow();

	//Update form
	this.form.updateInterface();
}

//Super prototypes
AudioPanel.prototype = Object.create(Panel.prototype);

//Destroy audio panel
AudioPanel.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
		this.player.destroy();
	}
	catch(e){}
}

//Update panel content from attached object
AudioPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);

	if(this.obj !== null)
	{
		var player = this.player;
		this.player.setAudioBuffer(this.obj.audio.data, function()
		{
			player.play();
		});

		this.static.setValue(!this.obj.matrixAutoUpdate);
		this.autoplay.setValue(this.obj.autoplay);
		this.loop.setValue(this.obj.loop);
		this.playbackRate.setValue(this.obj.playbackRate);
	}
}
