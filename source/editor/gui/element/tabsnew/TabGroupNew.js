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

	//TODO <REMOVE THIS>
	group.addTab(AboutTab, true);
	
	if(parent instanceof TabContainer)
	{
		parent.attach(container);
		parent.updateSize();
	}
	else if(parent instanceof DualContainer)
	{
		if(parent.elementA === this)
		{
			parent.attachA(container);
			parent.updateSize();
		}
		else if(parent.elementB === this)
		{
			parent.attachB(container);
			parent.updateSize();
		}
	}
};

TabGroupNew.prototype.collapse = function()
{
	if(this.parent instanceof DualContainer)
	{
		if(parent.elementA === this)
		{
			//TODO <ADD CODE HERE>
		}
		else if(parent.elementB === this)
		{
			//TODO <ADD CODE HERE>
		}
	}
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
