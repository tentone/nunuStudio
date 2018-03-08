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

		if(self.orientation === DualContainer.HORIZONTAL)
		{
			var tabPositionAbs = self.tabPosition * self.size.x;
			self.divA.size.set(tabPositionAbs, self.size.y);
			self.divB.size.set(self.size.x - tabPositionAbs - self.tabSize, self.size.y);
		}
		else if(self.orientation === DualContainer.VERTICAL)
		{
			var tabPositionAbs = self.tabPosition * self.size.y;
			self.divA.size.set(self.size.x, tabPositionAbs);
			self.divB.size.set(self.size.x, self.size.y - tabPositionAbs - self.tabSize);
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

//Update interface
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
			

			this.divB.style.top = "0px";
			this.divB.style.left = (this.divA.size.x + this.tabSize) + "px";

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

			this.divB.style.top = (this.divA.size.y + this.tabSize) + "px";
			this.divB.style.left = "0px";
			
			this.resizeTab.style.cursor = "n-resize";
			this.resizeTab.style.top = this.divA.size.y + "px";
			this.resizeTab.style.left = "0px";
			this.resizeTab.style.width = this.size.x + "px";
			this.resizeTab.style.height = this.tabSize + "px";
		}

		this.divA.style.width = this.divA.size.x + "px";
		this.divA.style.height = this.divA.size.y + "px";
		this.divB.style.width = this.divB.size.x + "px";
		this.divB.style.height = this.divB.size.y + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};
