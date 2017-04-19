"use strict";

function DualDivisionResizable(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.overflow = "hidden";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	//Division A
	this.divA = document.createElement("div");
	this.divA.style.position = "absolute";
	this.divA.style.top = "0px";
	this.divA.style.left = "0px";
	this.divA.style.overflow = "hidden";
	this.divA.style.backgroundColor = Editor.theme.panelColor;
	this.element.appendChild(this.divA);

	//Division B
	this.divB = document.createElement("div");
	this.divB.style.position = "absolute";
	this.divB.style.overflow = "hidden";
	this.divB.style.backgroundColor = Editor.theme.panelColor;
	this.element.appendChild(this.divB);

	//Resize tab
	this.resizeTab = document.createElement("div");
	this.resizeTab.draggable = false;
	this.resizeTab.style.position = "absolute";
	this.resizeTab.style.cursor = "e-resize";
	this.resizeTab.style.backgroundColor = Editor.theme.resizeTabColor;
	this.element.appendChild(this.resizeTab);
	
	//Attributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Resize Tab
	this.tabPosition = 0.5;
	this.tabPositionMax = 1;
	this.tabPositionMin = 0;
	this.tabSize = 5;
	this.orientation = DualDivisionResizable.HORIZONTAL;

	//Self pointer
	var self = this;
	var resizing = false;

	//Tab mouse down
	this.resizeTab.onmousedown = function(event)
	{
		resizing = true;
		requestAnimationFrame(resizeDivision);
	};
	
	var resizeDivision = function()
	{
		if(Editor.mouse.buttonPressed(Mouse.LEFT))
		{
			if(self.orientation == DualDivisionResizable.HORIZONTAL)
			{	
				self.tabPosition += Editor.mouse.delta.x/self.size.x;
			}
			else if(self.orientation == DualDivisionResizable.VERTICAL)
			{
				self.tabPosition += Editor.mouse.delta.y/self.size.y;
			}

			//Limit tab position
			if(self.tabPosition > self.tabPositionMax)
			{
				self.tabPosition = self.tabPositionMax;
			}
			else if(self.tabPosition < self.tabPositionMin)
			{
				self.tabPosition = self.tabPositionMin;
			}

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
};

//Remove element
DualDivisionResizable.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}
};

//Update interface
DualDivisionResizable.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";

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
			this.divB.style.left = (tabPositionAbs + this.tabSize) + "px";
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
	else
	{
		this.element.style.display = "none";
	}
};
