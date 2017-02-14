"use strict";

function DualDivisionResizable(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Create element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.overflow = "hidden";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	//Division A
	this.divA = document.createElement("div");
	this.divA.style.position = "absolute";
	this.divA.style.top = "0px";
	this.divA.style.left = "0px";
	this.divA.style.cursor = "default";
	this.divA.style.overflow = "hidden";
	this.divA.style.backgroundColor = Editor.theme.panelColor;
	this.element.appendChild(this.divA);

	//Division B
	this.divB = document.createElement("div");
	this.divB.style.position = "absolute";
	this.divB.style.cursor = "default";
	this.divB.style.overflow = "hidden";
	this.divB.style.backgroundColor = Editor.theme.panelColor;
	this.element.appendChild(this.divB);

	//Create resizeTab tab
	this.resizeTab = document.createElement("div");
	this.resizeTab.style.position = "absolute";
	this.resizeTab.style.cursor = "e-resize";
	this.resizeTab.style.backgroundColor = Editor.theme.resizeTabColor;
	this.element.appendChild(this.resizeTab);

	//Attributes
	this.fitParent = false;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Resize Tab
	this.tabPosition = 0.5;
	this.tabPositionMax = 1;
	this.tabPositionMin = 0;
	this.tabSize = 5;
	this.orientation = DualDivisionResizable.HORIZONTAL;
	this.resizing = false;

	//Self pointer
	var self = this;

	//On mouse down start resizing
	this.resizeTab.onmousedown = function(event)
	{
		self.resizing = true;
	};
	
	//Prevent Drop event
	this.resizeTab.ondrop = function(event)
	{
		event.preventDefault();
	};

	//Prevent deafault when object dragged over
	this.resizeTab.ondragover = function(event)
	{
		event.preventDefault();
	};
	
	this.onResize = function()
	{
		Interface.updateInterface();
	};

	//Add element to document
	this.parent.appendChild(this.element);
}

//Resizable side
DualDivisionResizable.HORIZONTAL = 0;
DualDivisionResizable.VERTICAL = 1;

//Set container
DualDivisionResizable.prototype.setOnResize = function(callback)
{
	this.onResize = callback;
}

//Remove element
DualDivisionResizable.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update status
DualDivisionResizable.prototype.update = function()
{
	if(this.resizing)
	{
		if(Editor.mouse.buttonPressed(Mouse.LEFT))
		{
			if(this.orientation == DualDivisionResizable.HORIZONTAL)
			{	
				this.tabPosition += Editor.mouse.delta.x/this.size.x;
			}
			else if(this.orientation == DualDivisionResizable.VERTICAL)
			{
				this.tabPosition += Editor.mouse.delta.y/this.size.y;
			}

			//Limit tab position
			if(this.tabPosition > this.tabPositionMax)
			{
				this.tabPosition = this.tabPositionMax;
			}
			else if(this.tabPosition < this.tabPositionMin)
			{
				this.tabPosition = this.tabPositionMin;
			}

			//onResize callback
			this.onResize();
		}
		else
		{
			this.resizing = false;
		}
	}
}

//Update interface
DualDivisionResizable.prototype.updateInterface = function()
{
	//Fit parent
	if(this.fitParent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}
	
	//Set visibility
	if(this.visible)
	{
		this.resizeTab.style.visibility = "visible";
		this.divA.style.visibility = "visible";
		this.divB.style.visibility = "visible";
		this.element.style.visibility = "visible";
	}
	else
	{
		this.divA.style.visibility = "hidden";
		this.divB.style.visibility = "hidden";
		this.resizeTab.style.visibility = "hidden";
		this.element.style.visibility = "hidden";
	}

	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";

	if(this.orientation == DualDivisionResizable.HORIZONTAL)
	{	
		var tabPositionAbs = this.tabPosition * this.size.x;

		this.resizeTab.style.cursor = "e-resize";

		this.divA.style.width = tabPositionAbs + "px";
		this.divA.style.height = this.size.y + "px";

		this.divB.style.top = "0px";
		this.divB.style.left = tabPositionAbs + "px";
		this.divB.style.width = (this.size.x - tabPositionAbs - this.tabSize)+ "px";
		this.divB.style.height = this.size.y + "px";
		
		this.resizeTab.style.top = "0px";
		this.resizeTab.style.left = tabPositionAbs + "px";
		this.resizeTab.style.width = this.tabSize + "px";
		this.resizeTab.style.height = this.size.y + "px";
	}
	else if(this.orientation == DualDivisionResizable.VERTICAL)
	{
		var tabPositionAbs = this.tabPosition * this.size.y;

		this.resizeTab.style.cursor = "n-resize";

		this.divA.style.width = this.size.x + "px";
		this.divA.style.height = tabPositionAbs + "px";

		this.divB.style.top = (tabPositionAbs + this.tabSize) + "px";
		this.divB.style.left = "0px";
		this.divB.style.width = this.size.x + "px";
		this.divB.style.height = (this.size.y - tabPositionAbs - this.tabSize)+ "px";
		
		this.resizeTab.style.top = tabPositionAbs + "px";
		this.resizeTab.style.left = "0px";
		this.resizeTab.style.width = this.size.x + "px";
		this.resizeTab.style.height = this.tabSize + "px";
	}
}
