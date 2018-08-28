"use strict";

function TabGroupNew(parent, placement)
{
	TabGroup.call(this, parent, placement);

	var self = this;

	//Drag drop
	this.element.ondrop = function(event)
	{
		event.preventDefault();

		var uuid = event.dataTransfer.getData("uuid");
		var tab = DragBuffer.get(uuid);

		console.log(event, uuid, tab);
		//TODO <ADD CODE HERE>

		if(tab !== null)
		{
			var group = null;
			
			if(event.offsetX < self.size.x * 0.3)
			{
				group = self.split(TabGroup.LEFT);
			}
			else if(event.offsetX > self.size.x * 0.7)
			{
				group = self.split(TabGroup.RIGHT);
			}
			if(event.offsetY < self.size.y * 0.3)
			{
				group = self.split(TabGroup.TOP);
			}
			else if(event.offsetY > self.size.y * 0.7)
			{
				group = self.split(TabGroup.BOTTOM);
			}

			group.attachTab(tab);
		}
	};

	//Drag over
	this.element.ondragover = function(event)
	{
		event.preventDefault();

		//TODO <ADD CODE HERE>

		//console.log(event);
	};

	//Drag leave
	this.element.ondragleave = function(event)
	{
		event.preventDefault();

		//TODO <ADD CODE HERE>

		//console.log(event);
	};
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
	var group = new TabGroupNew(container, this.placement);

	if(direction === TabGroup.RIGHT)
	{
		container.orientation = DualContainer.HORIZONTAL;
		container.attach(this);
		container.attach(group);
	}
	else if(direction === TabGroup.LEFT)
	{
		container.orientation = DualContainer.HORIZONTAL;
		container.attach(group);
		container.attach(this);
	}
	else if(direction === TabGroup.BOTTOM)
	{
		container.orientation = DualContainer.VERTICAL;
		container.attach(this);
		container.attach(group);
	}
	else if(direction === TabGroup.TOP)
	{
		container.orientation = DualContainer.VERTICAL;
		container.attach(group);
		container.attach(this);
	}
	
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

	return group;
};

TabGroupNew.prototype.collapse = function()
{
	if(this.parent instanceof DualContainer)
	{
		var element;

		if(this.parent.elementA === this)
		{
			element = this.parent.elementB;
		}
		else if(this.parent.elementB === this)
		{
			element = this.parent.elementA;
		}

		this.parent.elementA = null;
		this.parent.elementB = null;

		var parent = this.parent.parent;

		this.parent.destroy();
		this.destroy();

		parent.attach(element);
		parent.updateSize();
	}
	else
	{
		console.warn("nunuStudio: Tab cannot be collapsed");
	}
};

/**
 * If the group gets empty it should be collapsed.
 */
TabGroupNew.prototype.removeTab = function(index, dontDestroy)
{
	TabGroup.prototype.removeTab.call(this, index, dontDestroy);

	if(this.options.length === 0)
	{
		this.collapse();
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
