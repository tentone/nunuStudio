import {Mouse} from "../../../../../core/input/Mouse.js";
import {Text} from "../../../Text.js";
import {TabGroup} from "../../TabGroup.js";
import {TabComponent} from "../../TabComponent.js";
import {TabButton} from "../../TabButton.js";
import {Component} from "../../../Component.js";
import {Button} from "../../../buttons/Button.js";

/**
 * Tab button is used to navigate trough tabs.
 *
 * The split version of the tab button is intended to be used alongside splitable tab groups.
 * 
 * @class TabButtonSplit
 * @extends {Component}
 * @param {Component} parent
 * @param {TabComponent} tab
 */
function TabButtonSplit(parent, tab)
{
	Component.call(this, parent, "div");

	var self = this;

	this.element.draggable = true;
	this.element.style.cursor = "pointer";
	this.element.style.boxSizing = "border-box";
	this.element.style.backgroundColor = "var(--bar-color)";

	// Tab
	this.tab = tab;

	// Icon
	this.icon = document.createElement("img");
	this.icon.style.pointerEvents = "none";
	this.icon.style.position = "absolute";
	this.icon.src = tab.icon;
	this.element.appendChild(this.icon);

	// Text
	this.text = document.createElement("div");
	this.text.style.position = "absolute";
	this.text.style.overflow = "hidden";
	this.text.style.textAlign = "center";
	this.text.style.pointerEvents = "none";
	this.text.style.textOverflow = "ellipsis";
	this.text.style.whiteSpace = "nowrap";
	this.text.style.color = "var(--color-light)";
	this.element.appendChild(this.text);

	// Title
	this.title = document.createTextNode(tab.title);
	this.text.appendChild(this.title);

	// Close button
	this.close = document.createElement("img");
	this.close.draggable = false;
	this.close.style.position = "absolute";
	this.close.style.opacity = 0.5;
	this.close.style.display = (tab.closeable) ? "block" : "none";
	this.close.src = Global.FILE_PATH + "icons/misc/close.png";
	this.element.appendChild(this.close);

	this.close.onmouseenter = function()
	{
		this.style.opacity = 1.0;
	};

	this.close.onmouseleave = function()
	{
		this.style.opacity = 0.5;
	};

	this.close.onclick = function()
	{
		self.tab.close();
	};
	
	// Drag state
	var dragState = TabButtonSplit.NONE;

	// Drag control
	this.element.ondragstart = function(event)
	{
		event.dataTransfer.setData("uuid", self.tab.uuid);
		DragBuffer.push(self.tab);

		event.dataTransfer.setData("tab", self.tab.index);
		dragState = TabButtonSplit.NONE;
	};

	// Drag drop
	this.element.ondrop = function(event)
	{
		event.preventDefault();
		this.style.borderLeft = null;
		this.style.borderRight = null;
		this.style.borderBottom = null;
		this.style.borderTop = null;

		var uuid = event.dataTransfer.getData("uuid");
		var tab = DragBuffer.get(uuid);

		if(tab instanceof TabComponent)
		{
			// In the same container
			if(tab.container === self.tab.container)
			{
				var index = event.dataTransfer.getData("tab");
				index = parseInt(index);

				if(index !== self.tab.index)
				{	
					// Before
					if(dragState === TabButtonSplit.PREVIOUS)
					{
						self.tab.container.moveTabIndex(index, index < self.tab.index ? self.tab.index - 1 : self.tab.index);
					}
					// After
					else if(dragState === TabButtonSplit.NEXT)
					{
						self.tab.container.moveTabIndex(index, index < self.tab.index ? self.tab.index : self.tab.index + 1);
					}
					
					DragBuffer.pop(uuid);
				}
			}
			// From another container
			else
			{
				// Before
				if(dragState === TabButtonSplit.PREVIOUS)
				{
					self.tab.container.attachTab(tab, self.tab.index);
				}
				// After
				else if(dragState === TabButtonSplit.NEXT)
				{
					self.tab.container.attachTab(tab, self.tab.index + 1);
				}
				
				DragBuffer.pop(uuid);
			}
		}
	};

	// Drag over
	this.element.ondragover = function(event)
	{
		if(self.tab.container.placement === TabGroup.TOP || self.tab.container.placement === TabGroup.BOTTOM)
		{	
			if(event.layerX > self.size.x * 0.8 || event.target !== this)
			{
				if(dragState !== TabButtonSplit.NEXT)
				{
					dragState = TabButtonSplit.NEXT;
					this.style.borderLeft = null;
					this.style.borderRight = "thick solid #999999";
				}
			}
			else if(event.layerX < self.size.x * 0.2)
			{
				if(dragState !== TabButtonSplit.PREVIOUS)
				{
					dragState = TabButtonSplit.PREVIOUS;
					this.style.borderRight = null;
					this.style.borderLeft = "thick solid #999999";
				}
			}
			else
			{
				if(dragState !== TabButtonSplit.NONE)
				{
					dragState = TabButtonSplit.NONE;
					this.style.borderLeft = null;
					this.style.borderRight = null;
				}
			}
		}
		else
		{
			if(event.layerY > self.size.y * 0.7 || event.target !== this)
			{
				if(dragState !== TabButtonSplit.NEXT)
				{
					dragState = TabButtonSplit.NEXT;
					this.style.borderTop = null;
					this.style.borderBottom = "solid #999999";
				}
			}
			else if(event.layerY < self.size.y * 0.3)
			{
				if(dragState !== TabButtonSplit.PREVIOUS)
				{
					dragState = TabButtonSplit.PREVIOUS;
					this.style.borderBottom = null;
					this.style.borderTop = "solid #999999";
				}
			}
			else
			{
				if(dragState !== TabButtonSplit.NONE)
				{
					dragState = TabButtonSplit.NONE;
					this.style.borderBottom = null;
					this.style.borderTop = null;
				}
			}
		}
	};

	// Drag end
	this.element.ondragend = function(event)
	{
		event.preventDefault();
		
		DragBuffer.pop(self.tab.uuid);

		dragState = TabButtonSplit.NONE;
		this.style.borderLeft = null;
		this.style.borderRight = null;
		this.style.borderBottom = null;
		this.style.borderTop = null;
	};

	// Drag leave
	this.element.ondragleave = function(event)
	{
		event.preventDefault();
		
		dragState = TabButtonSplit.NONE;
		this.style.borderLeft = null;
		this.style.borderRight = null;
		this.style.borderBottom = null;
		this.style.borderTop = null;
	};

	// Mouse down
	this.element.onmousedown = function(event)
	{
		var button = event.which - 1;

		// Select tab
		if(button === Mouse.LEFT)
		{
			self.tab.container.selectTab(self.tab);
		}
		// Close tab
		else if(tab.closeable && button === Mouse.MIDDLE)
		{
			self.tab.container.removeTab(self.tab);
		}
	};

	// Mouse enter
	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = "var(--button-over-color)";
	};

	// Mouse leave
	this.element.onmouseleave = function()
	{
		if(tab.isSelected())
		{
			this.style.backgroundColor = "var(--button-over-color)";
		}
		else
		{
			this.style.backgroundColor = "var(--bar-color)";
		}
	};
}

TabButtonSplit.prototype = Object.create(Component.prototype);

TabButtonSplit.NONE = 0;
TabButtonSplit.PREVIOUS = 1;
TabButtonSplit.NEXT = 2;

/**
 * Set the tab icon image.
 *
 * @method setIcon
 * @param {string} icon URL of the icon image.
 */
TabButtonSplit.prototype.setIcon = function(icon)
{
	this.tab.icon = icon;
	this.icon.src = icon;
};

/**
 * Set text to be displayed in the button as its name.
 *
 * @method setName
 * @param {string} text
 */
TabButtonSplit.prototype.setName = function(text)
{
	this.tab.title = text;
	this.title.data = text;
};

TabButtonSplit.prototype.updateSelection = function()
{
	this.element.style.backgroundColor = this.tab.isSelected() ? "var(--button-over-color)" : "var(--bar-color)";
};

TabButtonSplit.prototype.updateSize = function()
{
	Component.prototype.updateSize.call(this);
	
	// Icon
	this.icon.style.top = (this.size.y * 0.2) + "px";
	this.icon.style.left = (this.size.y * 0.2) + "px"
	this.icon.style.width = (this.size.y * 0.6) + "px";
	this.icon.style.height = (this.size.y * 0.6) + "px";

	// Text
	this.text.style.left = this.size.y + "px";
	this.text.style.top = ((this.size.y - 12) / 2) + "px";
	this.text.style.width = (this.size.x - 2 * this.size.y) + "px";
	this.text.style.height = this.size.y + "px";

	// Close
	if(this.tab.closeable === true)
	{
		this.close.style.width = (this.size.y * 0.4) + "px";
		this.close.style.height = (this.size.y * 0.4) + "px";
		this.close.style.top = (this.size.y * 0.3) + "px";
		this.close.style.right = (this.size.y * 0.3) + "px";
		this.close.style.display = "block";
	}
	else
	{
		this.close.style.display = "none";
	}

	this.updateSelection();
};

export {TabButtonSplit};