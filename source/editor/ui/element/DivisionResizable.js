"use strict";

function DivisionResizable(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.cursor = "default";
	this.element.style.overflow = "hidden";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Create division resize tab
	this.resizeTab = document.createElement("div");
	this.resizeTab.style.position = "absolute";
	this.resizeTab.style.cursor = "e-resize";
	this.resizeTab.style.backgroundColor = Editor.theme.resizeTabColor;

	this.resizeTab.ondrop = function(event)
	{
		event.preventDefault();
	};

	this.resizeTab.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Attributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Resize control
	this.resizeSizeMax = Number.MAX_VALUE;
	this.resizeSizeMin = 0;
	this.resizeTabSize = 5;
	this.resizableSide = DivisionResizable.LEFT;
	this.resizing = false;

	//Self pointer
	var self = this;

	//On mouse down start resizing
	this.resizeTab.onmousedown = function(event)
	{
		self.resizing = true;
	};

	this.onResize = function()
	{
		Interface.updateInterface();
	};

	this.parent.appendChild(this.element);
	this.parent.appendChild(this.resizeTab);
}

//Resizable side
DivisionResizable.LEFT = 0;
DivisionResizable.RIGHT = 1;
DivisionResizable.TOP = 2;
DivisionResizable.BOTTOM = 3;

//Set container
DivisionResizable.prototype.setOnResize = function(callback)
{
	this.onResize = callback;
};

//Remove element
DivisionResizable.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.resizeTab);
		this.parent.removeChild(this.element);
	}
	catch(e){}
};

//Update status
DivisionResizable.prototype.update = function()
{
	if(this.resizing)
	{
		if(Editor.mouse.buttonPressed(Mouse.LEFT))
		{
			if(this.resizableSide === DivisionResizable.LEFT)
			{	
				this.size.x -= Editor.mouse.delta.x;
			}
			else if(this.resizableSide === DivisionResizable.RIGHT)
			{
				this.size.x += Editor.mouse.delta.x;
			}
			else if(this.resizableSide === DivisionResizable.TOP)
			{
				this.size.y -= Editor.mouse.delta.y;
			}
			else if(this.resizableSide === DivisionResizable.BOTTOM)
			{
				this.size.y += Editor.mouse.delta.y;
			}

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

			//onResize callback
			this.onResize();
		}
		else
		{
			this.resizing = false;
		}
	}
};

//Update DivisionResizable Size
DivisionResizable.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.resizeTab.style.visibility = "visible";
		this.element.style.visibility = "visible";
	}
	else
	{
		this.resizeTab.style.visibility = "hidden";
		this.element.style.visibility = "hidden";
	}

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
};
