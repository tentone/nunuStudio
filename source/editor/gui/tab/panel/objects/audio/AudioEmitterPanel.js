"use strict";

function AudioEmitterPanel(parent, obj)
{
	ObjectPanel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Audio player
	this.form.addText("Audio");
	this.player = new AudioPlayer(this.form.element);
	this.player.size.set(190, 20);
	this.form.add(this.player);
	this.form.nextRow();

	//Volume
	this.form.addText("Volume");
	this.volume = new Slider(this.form.element);
	this.volume.size.set(80, 18);
	this.volume.setRange(0, 1);
	this.volume.setStep(0.01);
	this.volume.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "volume", self.volume.getValue()));
	});
	this.form.add(this.volume);
	this.form.nextRow();

	//Playback Rate
	this.form.addText("Playback Rate");
	this.playbackRate = new NumberBox(this.form.element);
	this.playbackRate.size.set(60, 18);
	this.playbackRate.setStep(0.1);
	this.playbackRate.setRange(0, Number.MAX_SAFE_INTEGER);
	this.playbackRate.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "playbackRate", self.playbackRate.getValue()));
	});
	this.form.add(this.playbackRate);
	this.form.nextRow();

	//Autoplay
	this.autoplay = new CheckBox(this.form.element);
	this.form.addText("Autoplay");
	this.autoplay.size.set(15, 15);
	this.autoplay.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "autoplay", self.autoplay.getValue()));
	});
	this.form.add(this.autoplay);
	this.form.nextRow();

	//Loop
	this.loop = new CheckBox(this.form.element);
	this.form.addText("Loop");
	this.loop.size.set(15, 15);
	this.loop.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "loop", self.loop.getValue()));
	});
	this.form.add(this.loop);
	this.form.nextRow();
}

AudioEmitterPanel.prototype = Object.create(ObjectPanel.prototype);

AudioEmitterPanel.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
		this.player.destroy();
	}
	catch(e){}
};

AudioEmitterPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);

	this.player.setAudioBuffer(this.obj.audio.data);
	this.volume.setValue(this.obj.volume);
	this.static.setValue(!this.obj.matrixAutoUpdate);
	this.autoplay.setValue(this.obj.autoplay);
	this.loop.setValue(this.obj.loop);
	this.playbackRate.setValue(this.obj.playbackRate);
};
