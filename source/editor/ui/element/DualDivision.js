"use strict";

function DualDivision(parent)
{
	Element.call(this, parent);

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

	this.divASize = new THREE.Vector2(0, 0);

	//Division B
	this.divB = document.createElement("div");
	this.divB.style.position = "absolute";
	this.divB.style.overflow = "hidden";
	this.divB.style.backgroundColor = Editor.theme.panelColor;
	this.element.appendChild(this.divB);

	this.divBSize = new THREE.Vector2(0, 0);

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

//Update interface
DualDivision.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.display = "block";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";

		if(this.orientation === DualDivision.HORIZONTAL)
		{
			var tabPositionAbs = this.tabPosition * this.size.x;
			this.divASize.set(tabPositionAbs, this.size.y);
			this.divBSize.set(this.size.x - tabPositionAbs - this.tabSize, this.size.y);
			
			this.resizeTab.style.cursor = "e-resize";

			this.divB.style.top = "0px";
			this.divB.style.left = (this.divASize.x + this.tabSize) + "px";

			this.resizeTab.style.top = "0px";
			this.resizeTab.style.left = this.divASize.x + "px";
			this.resizeTab.style.width = this.tabSize + "px";
			this.resizeTab.style.height = this.size.y + "px";
		}
		else if(this.orientation === DualDivision.VERTICAL)
		{
			var tabPositionAbs = this.tabPosition * this.size.y;
			this.divASize.set(this.size.x, tabPositionAbs);
			this.divBSize.set(this.size.x, this.size.y - tabPositionAbs - this.tabSize);

			this.resizeTab.style.cursor = "n-resize";

			this.divB.style.top = (this.divASize.y + this.tabSize) + "px";
			this.divB.style.left = "0px";
			
			this.resizeTab.style.top = this.divASize.y + "px";
			this.resizeTab.style.left = "0px";
			this.resizeTab.style.width = this.size.x + "px";
			this.resizeTab.style.height = this.tabSize + "px";
		}

		this.divA.style.width = this.divASize.x + "px";
		this.divA.style.height = this.divASize.y + "px";
		this.divB.style.width = this.divBSize.x + "px";
		this.divB.style.height = this.divBSize.y + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};
