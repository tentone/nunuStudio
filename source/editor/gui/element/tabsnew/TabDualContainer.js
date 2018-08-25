"use strict";

function TabDualContainer()
{
	DualContainer.call(this, parent, "div");
	
	this.tab = null;
}

TabDualContainer.prototype = Object.create(DualContainer.prototype);
