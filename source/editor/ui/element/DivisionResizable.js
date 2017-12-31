"use strict";

function DivisionResizable(parent)
{
	Element.call(this, parent);

	this.element.style.cursor = "default";
	this.element.style.overflow = "visible";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	this.preventDragEvents();

	//Create division resize tab
	this.resizeTab = document.createElement("div");
	this.resizeTab.draggable = false;
	this.resizeTab.style.position = "absolute";
	this.resizeTab.style.cursor = "e-resize";
	this.resizeTab.style.backgroundColor = Editor.theme.resizeTabColor;

	//Resize control
	this.resizeSizeMax = Number.MAX_VALUE;
	this.resizeSizeMin = 0;
	this.resizeTabSize = 5;
	this.resizableSide = DivisionResizable.LEFT;

	//Self pointer
	var self = this;
	var resizing = false;

	//On mouse down start resizing
	this.resizeTab.onmousedown = function(event)
	{
		resizing = true;
		requestAnimationFrame(resizeDivision);
	};

	var resizeDivision = function()
	{
		if(Editor.mouse.buttonPressed(Mouse.LEFT))
		{
			if(self.resizableSide === DivisionResizable.LEFT)
			{	
				self.size.x -= Editor.mouse.delta.x;
			}
			else if(self.resizableSide === DivisionResizable.RIGHT)
			{
				self.size.x += Editor.mouse.delta.x;
			}
			else if(self.resizableSide === DivisionResizable.TOP)
			{
				self.size.y -= Editor.mouse.delta.y;
			}
			else if(self.resizableSide === DivisionResizable.BOTTOM)
			{
				self.size.y += Editor.mouse.delta.y;
			}

			//Limit Size
			if(self.resizableSide === DivisionResizable.BOTTOM || self.resizableSide === DivisionResizable.TOP)
			{
				if(self.size.y < (self.resizeTabSize + self.resizeSizeMin))
				{
					self.size.y = self.resizeTabSize + self.resizeSizeMin;
				}
				else if(self.size.y > self.resizeSizeMax)
				{
					self.size.y = self.resizeSizeMax;
				}
			}
			else
			{
				if(self.size.x < (self.resizeTabSize + self.resizeSizeMin))
				{
					self.size.x = (self.resizeTabSize + self.resizeSizeMin);
				}
				else if(self.size.x > self.resizeSizeMax)
				{
					self.size.x = self.resizeSizeMax;
				}	
			}

			//onResize callback
			self.onResize();
		}
		else
		{
			resizing = false;
		}

		if(resizing)
		{
			requestAnimationFrame(resizeDivision);
		}
	};

	//onResize callback
	this.onResize = function()
	{
		Interface.updateInterface();
	};

	this.parent.appendChild(this.resizeTab);
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
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}

	if(this.parent.contains(this.resizeTab))
	{
		this.parent.removeChild(this.resizeTab);
	}
};

//Update DivisionResizable Size
DivisionResizable.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";
		this.resizeTab.style.display = "block";

		//Limit Size
		if(this.resizableSide === DivisionResizable.BOTTOM || this.resizableSide === DivisionResizable.TOP)
		{
			if(this.size.y < (this.resizeTabSize + this.resizeSizeMin))
			{
				this.size.y = this.resizeTabSize + this.resizeSizeMin;
			}
			else if(this.size.y > this.resizeSizeMax)
			{
				this.size.y = this.resizeSizeMax;
			}
		}
		else
		{
			if(this.size.x < (this.resizeTabSize + this.resizeSizeMin))
			{
				this.size.x = (this.resizeTabSize + this.resizeSizeMin);
			}
			else if(this.size.x > this.resizeSizeMax)
			{
				this.size.x = this.resizeSizeMax;
			}	
		}

		//Update element
		if(this.resizableSide == DivisionResizable.LEFT)
		{	
			this.resizeTab.style.cursor = "e-resize";

			this.resizeTab.style.top = this.position.y + "px";
			this.resizeTab.style.left = this.position.x + "px";
			this.resizeTab.style.width = this.resizeTabSize + "px";
			this.resizeTab.style.height = this.size.y + "px";

			this.element.style.top = this.position.y + "px";
			this.element.style.left = (this.position.x + this.resizeTabSize) + "px";
			this.element.style.width = (this.size.x - this.resizeTabSize) + "px";
			this.element.style.height = this.size.y + "px";
		}
		else if(this.resizableSide == DivisionResizable.RIGHT)
		{	
			this.resizeTab.style.cursor = "e-resize";

			this.resizeTab.style.top = this.position.y + "px";
			this.resizeTab.style.left = (this.position.x + (this.size.x - this.resizeTabSize))+ "px";
			this.resizeTab.style.width = this.resizeTabSize + "px";
			this.resizeTab.style.height = this.size.y + "px";

			this.element.style.top = this.position.y + "px";
			this.element.style.left = this.position.x + "px";
			this.element.style.width = (this.size.x - this.resizeTabSize) + "px";
			this.element.style.height = this.size.y + "px";
		}
		else if(this.resizableSide == DivisionResizable.TOP)
		{
			this.resizeTab.style.cursor = "n-resize";

			this.resizeTab.style.top = this.position.y + "px";
			this.resizeTab.style.left = this.position.x + "px";
			this.resizeTab.style.width = this.size.x + "px";
			this.resizeTab.style.height = this.resizeTabSize + "px";

			this.element.style.top = (this.position.y + this.resizeTabSize) + "px";
			this.element.style.left = this.position.x + "px";
			this.element.style.width = this.size.x + "px";
			this.element.style.height = (this.size.y - this.resizeTabSize) + "px";
		}
		else if(this.resizableSide == DivisionResizable.BOTTOM)
		{
			this.resizeTab.style.cursor = "n-resize";

			this.resizeTab.style.top = (this.position.y + (this.size.y - this.resizeTabSize)) + "px";
			this.resizeTab.style.left = this.position.x + "px";
			this.resizeTab.style.width = this.size.x + "px";
			this.resizeTab.style.height = this.resizeTabSize + "px";

			this.element.style.top = this.position.y + "px";
			this.element.style.left = this.position.x + "px";
			this.element.style.width = this.size.x + "px";
			this.element.style.height = (this.size.y - this.resizeTabSize) + "px";
		}
	}
	else
	{
		this.element.style.display = "none";
		this.resizeTab.style.display = "none";
	}
};
