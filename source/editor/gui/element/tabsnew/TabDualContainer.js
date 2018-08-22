"use strict";

function TabDualContainer(parent)
{
	DualContainer.call(this, parent);

	//this.divA = null
	//this.divB = null
	
	//TODO <ADD CODE HERE>
}

TabDualContainer.prototype = Object.create(DualContainer.prototype);

TabDualContainer.prototype.attachA = function(element)
{
	DualContainer.prototype.attachA.call(this, element);

	//TODO <ADD CODE HERE>
};

TabDualContainer.prototype.attachB = function(element)
{
	DualContainer.prototype.attachB.call(this, element);

	//TODO <ADD CODE HERE>
};
