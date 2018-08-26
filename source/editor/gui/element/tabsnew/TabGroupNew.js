"use strict";

function TabGroupNew(parent, placement)
{
	TabGroup.call(this, parent, placement);
}

TabGroupNew.prototype = Object.create(TabGroup.prototype);

/**
 * Split this tab group into two new tab groups.
 *
 * @method split
 * @param {Number} direction Direction where to insert the new tab.
 * @return {TabGroupNew} The new created tab group.
 */
TabGroupNew.prototype.split = function(direction)
{
	if(direction === undefined)
	{
		direction = TabGroup.RIGHT;
	}

	var container = new DualContainer();
	var parent = this.parent;

	//New tab on right
	if(direction === TabGroup.RIGHT)
	{
		container.orientation = DualContainer.HORIZONTAL;
		container.attachA(this);

		var group = new TabGroupNew(container, this.placement);
		container.attachB(group);
	}
	else if(direction === TabGroup.LEFT)
	{
		container.orientation = DualContainer.HORIZONTAL;
		container.attachB(this);

		var group = new TabGroupNew(container, this.placement);
		container.attachA(group);
	}
	else if(direction === TabGroup.BOTTOM)
	{
		container.orientation = DualContainer.VERTICAL;
		container.attachA(this);

		var group = new TabGroupNew(container, this.placement);
		container.attachB(group);
	}
	else if(direction === TabGroup.TOP)
	{
		container.orientation = DualContainer.VERTICAL;
		container.attachB(this);

		var group = new TabGroupNew(container, this.placement);
		container.attachA(group);
	}

	
	if(parent instanceof TabContainer)
	{
		group.addTab(AboutTab, true);

		parent.attach(container);
		parent.updateSize();
	}
};

TabGroupNew.prototype.collapse = function()
{

};

/**
 * If the group gets empty it should be collapsed.
 */

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
