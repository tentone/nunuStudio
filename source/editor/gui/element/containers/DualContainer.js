"use strict";

function DualContainer(parent)
{
	Element.call(this, parent);

	this.element.style.overflow = "hidden";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	//Division A
	this.divA = null

	//Division B
	this.divB = null

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
	this.orientation = DualContainer.HORIZONTAL;

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
		if(self.orientation === DualContainer.HORIZONTAL)
		{	
			self.tabPosition += event.movementX / self.size.x;
		}
		else if(self.orientation === DualContainer.VERTICAL)
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
	});

	this.manager.add(window, "mouseup", function(event)
	{
		self.manager.destroy();
	});
}

DualContainer.HORIZONTAL = 0;
DualContainer.VERTICAL = 1;

DualContainer.prototype = Object.create(Element.prototype);

DualContainer.prototype.attachA = function(element)
{
	this.divA = element;

	if(element.parent !== this.element)
	{
		element.parent = this.element;
		this.element.appendChild(element.element);
	}
};

DualContainer.prototype.attachB = function(element)
{
	this.divB = element;

	if(element.parent !== this.element)
	{
		element.parent = this.element;
		this.element.appendChild(element.element);
	}
};

DualContainer.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.display = "block";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";

		if(this.orientation === DualContainer.HORIZONTAL)
		{
			var tabPositionAbs = this.tabPosition * this.size.x;

			this.divA.size.set(tabPositionAbs, this.size.y);

			this.divB.size.set(this.size.x - tabPositionAbs - this.tabSize, this.size.y);
			this.divB.position.set(this.divA.size.x + this.tabSize, 0);

			this.resizeTab.style.cursor = "e-resize";
			this.resizeTab.style.top = "0px";
			this.resizeTab.style.left = this.divA.size.x + "px";
			this.resizeTab.style.width = this.tabSize + "px";
			this.resizeTab.style.height = this.size.y + "px";
		}
		else if(this.orientation === DualContainer.VERTICAL)
		{
			var tabPositionAbs = this.tabPosition * this.size.y;
			
			this.divA.size.set(this.size.x, tabPositionAbs);
			
			this.divB.size.set(this.size.x, this.size.y - tabPositionAbs - this.tabSize);
			this.divB.position.set(0, this.divA.size.y + this.tabSize);
			
			this.resizeTab.style.cursor = "n-resize";
			this.resizeTab.style.top = this.divA.size.y + "px";
			this.resizeTab.style.left = "0px";
			this.resizeTab.style.width = this.size.x + "px";
			this.resizeTab.style.height = this.tabSize + "px";
		}

		this.divA.updateInterface();
		this.divB.updateInterface();
	}
	else
	{
		this.element.style.display = "none";
	}
};
