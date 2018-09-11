"use strict";

function DualDivision(parent)
{
	Element.call(this, parent, "div");

	this.element.style.overflow = "hidden";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	//Division A
	this.divA = new Element(this, "div");
	this.divA.element.style.backgroundColor = Editor.theme.panelColor;

	//Division B
	this.divB = new Element(this, "div");
	this.divB.element.style.backgroundColor = Editor.theme.panelColor;
	
	//Resize tab
	this.resizeTab = document.createElement("div");
	this.resizeTab.style.position = "absolute";
	this.resizeTab.style.cursor = "e-resize";
	this.resizeTab.style.backgroundColor = Editor.theme.resizeTabColor;
	this.element.appendChild(this.resizeTab);

	//Resize Tab
	this.tabPosition = 0.5;
	this.tabPositionMax = 1;
	this.tabPositionMin = 0;
	this.tabSize = 5;
	this.orientation = DualDivision.HORIZONTAL;

	var self = this;

	//Tab mouse down
	this.resizeTab.onmousedown = function(event)
	{
		self.manager.create();
	};

	//Tab resize event manager
	this.manager = new EventManager();
	this.manager.add(window, "mousemove", function(event)
	{
		if(self.orientation === DualDivision.HORIZONTAL)
		{	
			self.tabPosition += event.movementX / self.size.x;
		}
		else if(self.orientation === DualDivision.VERTICAL)
		{
			self.tabPosition += event.movementY / self.size.y;
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

		self.updateInterface();
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

DualDivision.HORIZONTAL = 0;
DualDivision.VERTICAL = 1;

DualDivision.prototype = Object.create(Element.prototype);

//Set container
DualDivision.prototype.setOnResize = function(callback)
{
	this.onResize = callback;
};

DualDivision.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

	if(this.orientation === DualDivision.HORIZONTAL)
	{
		var tabPositionAbs = this.tabPosition * this.size.x;
		
		this.divA.position.set(0, 0);
		this.divA.size.set(tabPositionAbs, this.size.y);
		this.divA.updateInterface();

		this.divB.size.set(this.size.x - tabPositionAbs - this.tabSize, this.size.y);
		this.divB.position.set(this.divA.size.x + this.tabSize, 0);
		this.divB.updateInterface();

		this.resizeTab.style.cursor = "e-resize";
		this.resizeTab.style.top = "0px";
		this.resizeTab.style.left = this.divA.size.x + "px";
		this.resizeTab.style.width = this.tabSize + "px";
		this.resizeTab.style.height = this.size.y + "px";
	}
	else if(this.orientation === DualDivision.VERTICAL)
	{
		var tabPositionAbs = this.tabPosition * this.size.y;

		this.divA.position.set(0, 0);
		this.divA.size.set(this.size.x, tabPositionAbs);
		this.divA.updateInterface();

		this.divB.size.set(this.size.x, this.size.y - tabPositionAbs - this.tabSize);
		this.divB.position.set(0, this.divA.size.y + this.tabSize);
		this.divB.updateInterface();

		this.resizeTab.style.cursor = "n-resize";
		this.resizeTab.style.top = this.divA.size.y + "px";
		this.resizeTab.style.left = "0px";
		this.resizeTab.style.width = this.size.x + "px";
		this.resizeTab.style.height = this.tabSize + "px";
	}
};
