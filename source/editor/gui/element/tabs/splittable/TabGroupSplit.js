"use strict";

/**
 * A tab group contains and manages tab elements.
 *
 * A splitable tab group can be splited into two tab group allowing a more flexible interface organization during runtime.
 * 
 * @class TabGroupSplit
 * @extends {TabGroup}
 * @param {Element} parent Parent element.
 */
function TabGroupSplit(parent, placement)
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
	 * If true the group can be split in two.
	 *
	 * @property canSplit
	 * @type {Boolean}
	 */
	this.canSplit = true;

	/**
	 * If true the group can be collapsed.
	 *
	 * @property canCollapse
	 * @type {Boolean}
	 */
	this.canCollapse = true;

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

	//Drag drop
	this.tab.element.ondrop = function(event)
	{
		event.preventDefault();

		var uuid = event.dataTransfer.getData("uuid");
		var tab = DragBuffer.get(uuid);

		if(tab instanceof TabElement)
		{
			var position = DOMUtils.getPosition(self.element);
			var x = event.clientX - position.x;
			var y = event.clientY - position.y;

			//Left
			if(x < self.size.x * self.dragBorder)
			{
				self.split(TabGroup.LEFT).attachTab(tab);
			}
			//Right
			else if(x > self.size.x * (1 - self.dragBorder))
			{
				self.split(TabGroup.RIGHT).attachTab(tab);
			}
			//Top
			else if(y < self.size.y * self.dragBorder)
			{
				self.split(TabGroup.TOP).attachTab(tab);
			}
			//Bottom
			else if(y > self.size.y * (1 - self.dragBorder))
			{
				self.split(TabGroup.BOTTOM).attachTab(tab);
			}
			else
			{
				self.attachTab(tab);
			}

			DragBuffer.pop(uuid);
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

		if(!(DragBuffer.buffer[0] instanceof TabElement))
		{
			return;
		}

		var position = DOMUtils.getPosition(self.element);
		var x = event.clientX - position.x;
		var y = event.clientY - position.y;

		//Left
		if(x < self.size.x * self.dragBorder)
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
		else if(x > self.size.x * (1 - self.dragBorder))
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
		else if(y < self.size.y * self.dragBorder)
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
		else if(y > self.size.y * (1 - self.dragBorder))
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

TabGroupSplit.prototype = Object.create(TabGroup.prototype);

/**
 * Split this tab group into two new tab groups.
 *
 * @method split
 * @param {Number} direction Direction where to insert the new tab.
 * @return {TabGroupSplit} The new created tab group.
 */
TabGroupSplit.prototype.split = function(direction)
{
	if(this.canSplit)
	{
		if(direction === undefined)
		{
			direction = TabGroup.RIGHT;
		}

		var container = new TabDualContainer();
		var parent = this.parent;
		var group = new TabGroupSplit(container, this.placement);

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
	}
	else
	{
		console.warn("nunuStudio: Tab is not splitable.");
	}
};

/**
 * If the tab is in a split container, move all the tabs to the other tabgroup in the container and close this group.
 *
 * @method collapse
 */ 
TabGroupSplit.prototype.collapse = function()
{
	if(this.canCollapse)
	{
		if(this.parent instanceof DualContainer)
		{
			var parent = this.parent.parent;
			var group = this.parent.elementA === this ? this.parent.elementB : this.parent.elementA;

			//Dual container
			if(parent instanceof DualContainer)
			{
				if(parent.elementA === this.parent)
				{
					this.parent.destroy();
					this.destroy();
					parent.attachA(group);
				}
				else if(parent.elementB === this.parent)
				{
					this.parent.destroy();
					this.destroy();
					parent.attachB(group);
				}
			}
			//Tab container
			else
			{
				this.parent.destroy();
				this.destroy();
				parent.attach(group);
			}
			
			parent.updateSize();
		}
		else
		{
			console.warn("nunuStudio: Tab cannot be collapsed (parent is not a dual container).");
		}
	}
	else
	{
		console.warn("nunuStudio: Tab is not collapsable.");
	}
};

/**
 * Attach tab to this group and remove it from the original group.
 *
 * @method attachTab
 * @param {TabElement} tab Tab to be moved.
 * @param {Number} insertIndex Index where to place the tab.
 */
TabGroupSplit.prototype.attachTab = function(tab, insertIndex)
{	
	var container = tab.container;
	var tab = TabGroup.prototype.attachTab.call(this, tab, insertIndex);

	if(container.options.length === 0)
	{
		container.collapse();
	}

	return tab;
};

TabGroupSplit.prototype.removeTab = function(index, dontDestroy)
{
	TabGroup.prototype.removeTab.call(this, index, dontDestroy);

	if(this.options.length === 0 && dontDestroy !== true)
	{
		this.collapse();
	}
};

TabGroupSplit.prototype.addTab = function(TabConstructor, closeable)
{
	var tab = new TabConstructor(this.tab, closeable, this, this.options.length);
	tab.button = new TabButtonSplit(this.buttons, tab);
	tab.updateInterface();

	this.options.push(tab);

	if(this.selected === null || this.options.length === 1)
	{
		this.selectTab(tab);
	}
	else
	{
		this.updateInterface();
	}
	
	return tab;
};
