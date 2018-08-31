"use strict";

function TabGroupNew(parent, placement)
{
	TabGroup.call(this, parent, placement);

	var self = this;

	/**
	 * Border where another another tabs can be dragged to for this tab to be spplited.
	 *
	 * @property dragBorder
	 * @type {Number}
	 */
	this.dragBorder = 0.2;

	/**
	 * DOM element to be displayed when a tab is dragged over.
	 *
	 * @property tabArea
	 * @type {DOM}
	 */
	this.tabArea = document.createElement("div");
	this.tabArea.style.zIndex = "1000";
	this.tabArea.style.position = "absolute";
	this.tabArea.style.backgroundColor = "rgba(0.0, 0.0, 0.0, 0.2)";
	this.tabArea.style.pointerEvents = "none";
	this.tab.element.appendChild(self.tabArea);

	//Drag drop
	this.tab.element.ondrop = function(event)
	{
		event.preventDefault();

		var uuid = event.dataTransfer.getData("uuid");
		var tab = DragBuffer.get(uuid);

		if(tab instanceof TabElement)
		{
			//Left
			if(event.offsetX < self.size.x * self.dragBorder)
			{
				self.split(TabGroup.LEFT).attachTab(tab);
			}
			//Right
			else if(event.offsetX > self.size.x * (1 - self.dragBorder))
			{
				self.split(TabGroup.RIGHT).attachTab(tab);
			}
			//Top
			else if(event.offsetY < self.size.y * self.dragBorder)
			{
				self.split(TabGroup.TOP).attachTab(tab);
			}
			//Bottom
			else if(event.offsetY > self.size.y * (1 - self.dragBorder))
			{
				self.split(TabGroup.BOTTOM).attachTab(tab);
			}
		}

		if(self.tab.element.contains(self.tabArea))
		{
			self.tab.element.removeChild(self.tabArea);
		}
	};

	//Drag over
	this.tab.element.ondragover = function(event)
	{
		event.preventDefault();

		//Left
		if(event.offsetX < self.size.x * self.dragBorder)
		{
			self.tabArea.style.right = null;
			self.tabArea.style.bottom = null;
			self.tabArea.style.top = "0px";
			self.tabArea.style.left = "0px";
			self.tabArea.style.width = "50%";
			self.tabArea.style.height = "100%";

			if(!self.tab.element.contains(self.tabArea))
			{
				self.tab.element.appendChild(self.tabArea);
			}
		}
		//Right
		else if(event.offsetX > self.size.x * (1 - self.dragBorder))
		{
			self.tabArea.style.left = null;
			self.tabArea.style.bottom = null;
			self.tabArea.style.top = "0px";
			self.tabArea.style.right = "0px";
			self.tabArea.style.width = "50%";
			self.tabArea.style.height = "100%";

			if(!self.tab.element.contains(self.tabArea))
			{
				self.tab.element.appendChild(self.tabArea);
			}
		}
		//Top
		else if(event.offsetY < self.size.y * self.dragBorder)
		{
			self.tabArea.style.right = null;
			self.tabArea.style.bottom = null;
			self.tabArea.style.top = "0px";
			self.tabArea.style.left = "0px";
			self.tabArea.style.width = "100%";
			self.tabArea.style.height = "50%";

			if(!self.tab.element.contains(self.tabArea))
			{
				self.tab.element.appendChild(self.tabArea);
			}
		}
		//Bottom
		else if(event.offsetY > self.size.y * (1 - self.dragBorder))
		{
			self.tabArea.style.top = null;
			self.tabArea.style.right = null;
			self.tabArea.style.bottom = "0px";
			self.tabArea.style.left = "0px";
			self.tabArea.style.width = "100%";
			self.tabArea.style.height = "50%";

			if(!self.tab.element.contains(self.tabArea))
			{
				self.tab.element.appendChild(self.tabArea);
			}
		}
		else
		{
			if(self.tab.element.contains(self.tabArea))
			{
				self.tab.element.removeChild(self.tabArea);
			}
		}
	};

	//Drag leave
	this.tab.element.ondragleave = function(event)
	{
		event.preventDefault();

		if(self.tab.element.contains(self.tabArea))
		{
			self.tab.element.removeChild(self.tabArea);
		}
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

/**
 * If the tab is in a split container, move all the tabs to the other tabgroup in the container and close this group.
 *
 * @method collapse
 */ 
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
		console.warn("nunuStudio: Tab cannot be collapsed.");
	}
};

TabGroupNew.prototype.removeTab = function(index, dontDestroy)
{
	TabGroup.prototype.removeTab.call(this, index, dontDestroy);

	if(this.options.length === 0)
	{
		this.collapse();
	}
};

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
