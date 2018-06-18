"use strict";

function TabSelector(parent, tab)
{
	TabButton.call(this, parent, tab);

	var self = this;

	//Drag state
	var dragState = 0;

	//Drag control
	this.element.ondragstart = function(event)
	{
		event.dataTransfer.setData("uuid", self.tab.uuid);
		DragBuffer.pushDragElement(self.tab);

		event.dataTransfer.setData("tab", self.tab.index);
		dragState = 0;
	};

	//Drag drop
	this.element.ondrop = function(event)
	{
		event.preventDefault();
		this.style.borderLeft = null;
		this.style.borderRight = null;
		this.style.borderBottom = null;
		this.style.borderTop = null;

		//Move tab between containers
		var uuid = event.dataTransfer.getData("uuid");
		var tab = DragBuffer.popDragElement(uuid);

		self.tab.container.attachTab(tab);
	};

	//Drag over
	this.element.ondragover = function(event)
	{
		if(self.tab.container.mode === TabGroup.TOP || self.tab.container.mode === TabGroup.BOTTOM)
		{
			if(event.layerX > self.size.x * 0.8 || event.target !== this)
			{
				if(dragState !== 2)
				{
					dragState = 2;
					this.style.borderLeft = null;
					this.style.borderRight = "thick solid #999999";
				}
			}
			else if(event.layerX < self.size.x * 0.2)
			{
				if(dragState !== 1)
				{
					dragState = 1;
					this.style.borderRight = null;
					this.style.borderLeft = "thick solid #999999";
				}
			}
			else
			{
				if(dragState !== 0)
				{
					dragState = 0;
					this.style.borderLeft = null;
					this.style.borderRight = null;
				}
			}
		}
		else
		{
			if(event.layerY > self.size.y * 0.7 || event.target !== this)
			{
				if(dragState !== 2)
				{
					dragState = 2;
					this.style.borderTop = null;
					this.style.borderBottom = "solid #999999";
				}
			}
			else if(event.layerY < self.size.y * 0.3)
			{
				if(dragState !== 1)
				{
					dragState = 1;
					this.style.borderBottom = null;
					this.style.borderTop = "solid #999999";
				}
			}
			else
			{
				if(dragState !== 0)
				{
					dragState = 0;
					this.style.borderBottom = null;
					this.style.borderTop = null;
				}
			}
		}
	};

	//Drag end
	this.element.ondragend = function(event)
	{
		event.preventDefault();

		var uuid = event.dataTransfer.getData("uuid");
		DragBuffer.popDragElement(uuid);

		dragState = 0;
		this.style.borderLeft = null;
		this.style.borderRight = null;
		this.style.borderBottom = null;
		this.style.borderTop = null;
	};

	//Drag leave
	this.element.ondragleave = function(event)
	{
		event.preventDefault();
		
		dragState = 0;
		this.style.borderLeft = null;
		this.style.borderRight = null;
		this.style.borderBottom = null;
		this.style.borderTop = null;
	};

	//Mouse click
	this.element.onclick = function(event)
	{
		self.tab.container.selectTab(self.tab);
	};

	//Mouse down
	this.element.onmousedown = function(event)
	{
		//Close tab on mouse middle click
		if(tab.closeable && event.which - 1 === Mouse.MIDDLE)
		{
			self.tab.container.removeTab(self.tab);
		}
	};

	//Mouse enter
	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	//Mouse leave
	this.element.onmouseleave = function()
	{
		if(tab.isSelected())
		{
			this.style.backgroundColor = Editor.theme.buttonOverColor;
		}
		else
		{
			this.style.backgroundColor = Editor.theme.buttonColor;
		}
	};
}

TabSelector.prototype = Object.create(TabButton.prototype);

//Update Interface
TabSelector.prototype.updateInterface = function()
{
	if(this.visible)
	{
		//Icon
		this.icon.style.top = (this.size.y * 0.2) + "px";
		this.icon.style.left = (this.size.y * 0.2) + "px"
		this.icon.style.width = (this.size.y * 0.6) + "px";
		this.icon.style.height = (this.size.y * 0.6) + "px";

		//Text
		this.text.style.left = this.size.y + "px";
		this.text.style.top = ((this.size.y - 12) / 2) + "px";
		this.text.style.width = (this.size.x - 2 * this.size.y) + "px";
		this.text.style.height = this.size.y + "px";

		//Close
		this.close.style.display = (this.tab.closeable) ? "block" : "none";
		this.close.style.width = (this.size.y * 0.4) + "px";
		this.close.style.height = (this.size.y * 0.4) + "px";
		this.close.style.top = (this.size.y * 0.3) + "px";
		this.close.style.right = (this.size.y * 0.3) + "px";

		//Element
		this.element.style.display = "block";
		this.element.style.backgroundColor = this.tab.isSelected() ? Editor.theme.buttonOverColor : Editor.theme.buttonColor;
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};
