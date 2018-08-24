"use strict";

function TabGroupNew(parent)
{
	TabGroup.call(this, parent, "div");
}

TabGroupNew.prototype = Object.create(TabGroup.prototype);

/**
 * Tab split test using a dualcontainer element.
 */
TabGroupNew.prototype.split = function(direction)
{
	var container = new DualContainer(this.parent);
	container.attachA(this);

	var group = new TabGroupNew(container);
	container.attachB(group);

	Editor.gui.tab = container;
	Editor.gui.updateInterface();
};

//TODO
TabGroupNew.prototype.simplify = function()
{
	//TODO <ADD CODE HERE>
};

//Update all tabs object data
TabGroupNew.prototype.updateMetadata = function()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].updateMetadata();
	}
};

//Update all tab object views
TabGroupNew.prototype.updateObjectsView = function(changes)
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].updateObjectsView();
	}
};

//Update all tab object views
TabGroupNew.prototype.updateSelection = function()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].updateSelection();
	}
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
