"use strict";

function AudioPanel(parent, object)
{
	ResourcePanel.call(this, parent, object);

	var self = this;

	//Audio player
	this.form.addText("Audio");
	this.player = new AudioPlayer(this.form);
	this.player.size.set(190, 18);
	this.form.add(this.player);
	this.form.nextRow();
}

AudioPanel.prototype = Object.create(ResourcePanel.prototype);

AudioPanel.prototype.destroy = function()
{
	ResourcePanel.prototype.destroy.call(this);

	this.player.destroy();
};

AudioPanel.prototype.updatePanel = function()
{
	ResourcePanel.prototype.updatePanel.call(this);

	this.player.setAudioBuffer(this.object.data);
};