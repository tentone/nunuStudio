"use strict";

function AudioPanel(parent, obj)
{
	ResourcePanel.call(this, parent, obj);

	var self = this;

	//Audio player
	this.form.addText("Audio");
	this.player = new AudioPlayer(this.form.element);
	this.player.size.set(190, 20);
	this.form.add(this.player);
	this.form.nextRow();
}

AudioPanel.prototype = Object.create(ResourcePanel.prototype);

AudioPanel.prototype.updatePanel = function()
{
	ResourcePanel.prototype.updatePanel.call(this);

	this.player.setAudioBuffer(this.obj.data);
};