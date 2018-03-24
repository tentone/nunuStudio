"use strict";

function LensFlarePanel(parent, obj)
{
	Panel.call(this, parent, obj);

	var self = this;
}

LensFlarePanel.prototype = Object.create(Panel.prototype);

LensFlarePanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);
};

