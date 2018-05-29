"use strict";

function DivisionResizable(parent)
{
	Element.call(this, parent);

	this.element.style.overflow = "visible";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	this.preventDragEvents();

	//Create division resize tab
	this.tab = document.createElement("div");
	this.tab.style.position = "absolute";
	this.tab.style.cursor = "e-resize";
	this.tab.style.backgroundColor = Editor.theme.tabColor;
	this.tab.ondrop = function(event)
	{
		event.preventDefault();
	};
	this.tab.ondragover = function(event)
	{
		event.preventDefault();
	};
	this.parent.appendChild(this.tab);

	//Resize control
	this.maxSize = Number.MAX_VALUE;
	this.direction = DivisionResizable.LEFT;
	this.minSize = 0;
	this.tabSize = 5;

	//Self pointer
	var self = this;
	this.tab.onmousedown = function(event)
	{
		self.manager.create();
	};

	//Tab resize event manager
	this.manager = new EventManager();
	this.manager.add(window, "mousemove", function(event)
	{
		if(self.direction === DivisionResizable.LEFT)
		{	
			self.size.x -= event.movementX;
		}
		else if(self.direction === DivisionResizable.RIGHT)
		{
			self.size.x += event.movementX;
		}
		else if(self.direction === DivisionResizable.TOP)
		{
			self.size.y -= event.movementY;
		}
		else if(self.direction === DivisionResizable.BOTTOM)
		{
			self.size.y += event.movementY;
		}

		//Limit Size
		if(self.direction === DivisionResizable.BOTTOM || self.direction === DivisionResizable.TOP)
		{
			if(self.size.y < (self.tabSize + self.minSize))
			{
				self.size.y = self.tabSize + self.minSize;
			}
			else if(self.size.y > self.maxSize)
			{
				self.size.y = self.maxSize;
			}
		}
		else
		{
			if(self.size.x < (self.tabSize + self.minSize))
			{
				self.size.x = (self.tabSize + self.minSize);
			}
			else if(self.size.x > self.maxSize)
			{
				self.size.x = self.maxSize;
			}	
		}

		self.onResize();
	});

	this.manager.add(window, "mouseup", function(event)
	{
		self.manager.destroy();
	});

	//onResize callback
	this.onResize = function()
	{
		Editor.gui.updateInterface();
	};
}

//Resizable side
DivisionResizable.LEFT = 0;
DivisionResizable.RIGHT = 1;
DivisionResizable.TOP = 2;
DivisionResizable.BOTTOM = 3;

DivisionResizable.prototype = Object.create(Element.prototype);

//Set container
DivisionResizable.prototype.setOnResize = function(callback)
{
	this.onResize = callback;
};

//Remove element
DivisionResizable.prototype.destroy = function()
{
	Element.prototype.destroy.call(this);

	if(this.parent.contains(this.tab))
	{
		this.parent.removeChild(this.tab);
	}
};

//Update DivisionResizable Size
DivisionResizable.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.display = "block";
		this.tab.style.display = "block";

		//Limit Size
		if(this.direction === DivisionResizable.BOTTOM || this.direction === DivisionResizable.TOP)
		{
			if(this.size.y < (this.tabSize + this.minSize))
			{
				this.size.y = this.tabSize + this.minSize;
			}
			else if(this.size.y > this.maxSize)
			{
				this.size.y = this.maxSize;
			}
		}
		else
		{
			if(this.size.x < (this.tabSize + this.minSize))
			{
				this.size.x = (this.tabSize + this.minSize);
			}
			else if(this.size.x > this.maxSize)
			{
				this.size.x = this.maxSize;
			}	
		}

		//Update element
		if(this.direction === DivisionResizable.LEFT)
		{	
			this.tab.style.cursor = "e-resize";
			this.tab.style.top = this.position.y + "px";
			this.tab.style.left = this.position.x + "px";
			this.tab.style.width = this.tabSize + "px";
			this.tab.style.height = this.size.y + "px";

			this.element.style.top = this.position.y + "px";
			this.element.style.left = (this.position.x + this.tabSize) + "px";
			this.element.style.width = (this.size.x - this.tabSize) + "px";
			this.element.style.height = this.size.y + "px";
		}
		else if(this.direction === DivisionResizable.RIGHT)
		{	
			this.tab.style.cursor = "e-resize";
			this.tab.style.top = this.position.y + "px";
			this.tab.style.left = (this.position.x + (this.size.x - this.tabSize))+ "px";
			this.tab.style.width = this.tabSize + "px";
			this.tab.style.height = this.size.y + "px";

			this.element.style.top = this.position.y + "px";
			this.element.style.left = this.position.x + "px";
			this.element.style.width = (this.size.x - this.tabSize) + "px";
			this.element.style.height = this.size.y + "px";
		}
		else if(this.direction === DivisionResizable.TOP)
		{
			this.tab.style.cursor = "n-resize";
			this.tab.style.top = this.position.y + "px";
			this.tab.style.left = this.position.x + "px";
			this.tab.style.width = this.size.x + "px";
			this.tab.style.height = this.tabSize + "px";

			this.element.style.top = (this.position.y + this.tabSize) + "px";
			this.element.style.left = this.position.x + "px";
			this.element.style.width = this.size.x + "px";
			this.element.style.height = (this.size.y - this.tabSize) + "px";
		}
		else if(this.direction === DivisionResizable.BOTTOM)
		{
			this.tab.style.cursor = "n-resize";
			this.tab.style.top = (this.position.y + (this.size.y - this.tabSize)) + "px";
			this.tab.style.left = this.position.x + "px";
			this.tab.style.width = this.size.x + "px";
			this.tab.style.height = this.tabSize + "px";

			this.element.style.top = this.position.y + "px";
			this.element.style.left = this.position.x + "px";
			this.element.style.width = this.size.x + "px";
			this.element.style.height = (this.size.y - this.tabSize) + "px";
		}
	}
	else
	{
		this.element.style.display = "none";
		this.tab.style.display = "none";
	}
};
