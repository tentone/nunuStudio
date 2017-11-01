"use strict";

function VideoTextureEditor(parent, closeable, container, index)
{
	TextureEditor.call(this, parent, closeable, container, index);

	var self = this;
	
	//Volume
	this.form.addText("Volume");
	this.volume = new Slider(this.form.element);
	this.volume.size.set(80, 18);
	this.volume.setRange(0, 1);
	this.volume.setStep(0.01);
	this.volume.setOnChange(function()
	{
		if(self.texture !== null)
		{
			self.texture.setVolume(self.volume.getValue());
		}
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
		if(self.texture !== null)
		{
			self.texture.setPlaybackRate(self.playbackRate.getValue());
		}
	});
	this.form.add(this.playbackRate);
	this.form.nextRow();

	//Autoplay
	this.autoplay = new CheckBox(this.form.element);
	this.form.addText("Autoplay");
	this.autoplay.size.set(15, 15);
	this.autoplay.setOnChange(function()
	{
		if(self.texture !== null)
		{
			Editor.history.add(new ChangeAction(self.texture, "autoplay", self.autoplay.getValue()));
		}
	});
	this.form.add(this.autoplay);
	this.form.nextRow();

	//Loop
	this.loop = new CheckBox(this.form.element);
	this.form.addText("Loop");
	this.loop.size.set(15, 15);
	this.loop.setOnChange(function()
	{
		if(self.texture !== null)
		{
			self.texture.setLoop(self.loop.getValue());
		}
	});
	this.form.add(this.loop);
	this.form.nextRow();
}

VideoTextureEditor.prototype = Object.create(TextureEditor.prototype);

VideoTextureEditor.prototype.attach = function(texture)
{
	TextureEditor.prototype.attach.call(this, texture);

	this.volume.setValue(this.texture.volume);
	this.autoplay.setValue(this.texture.autoplay);
	this.loop.setValue(this.texture.loop);
	this.playbackRate.setValue(this.texture.playbackRate);
};
