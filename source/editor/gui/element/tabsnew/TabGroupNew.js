"use strict";

function TabGroupNew(parent, placement)
{
	TabGroup.call(this, parent, placement);
}

TabGroupNew.prototype = Object.create(TabGroup.prototype);

/**
 * Tab split test using a dualcontainer element.
 */
TabGroupNew.prototype.split = function(direction)
{
	var container = new DualContainer(this.parent);
	container.attachA(this);

	var group = new TabGroupNew(container, this.placement);
	container.attachB(group);

	Editor.gui.tab = container;
	Editor.gui.updateInterface();
};

//Add new option to tab grounp
TabGroupNew.prototype.addTab = function(TabConstructor, closeable)
{
	var tab = new TabConstructor(this.tab, closeable, this, this.options.length);
	tab.button = new TabButtonNew(this.buttons, tab);

	this.options.push(tab);
	if(this.selected === null)
	{
		this.selectTab(tab);
	}

	return tab;
};
