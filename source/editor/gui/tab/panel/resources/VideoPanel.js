"use strict";

function VideoPanel(parent, object)
{
	ResourcePanel.call(this, parent, object);

	var self = this;

	this.form.addText("Video");
	this.video = new VideoPlayer(this.form);
	this.video.size.set(120, 120);
	this.form.add(this.video);
	this.form.nextRow();
}

VideoPanel.prototype = Object.create(ResourcePanel.prototype);

VideoPanel.prototype.updatePanel = function()
{
	ResourcePanel.prototype.updatePanel.call(this);

	this.video.setValue(this.object);
};