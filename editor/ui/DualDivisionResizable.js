"use strict";

function DualDivisionResizable(parent)
{
	//Parent
	if(parent === undefined)
	{
		this.parent = document.body;
	}
	else
	{
		this.parent = parent;
	}

	//ID
	var id = "div_dual" + DualDivisionResizable.id;
	DualDivisionResizable.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.style.cursor = "default";
	this.element.style.overflow = "hidden";
	this.element.style.backgroundColor = Editor.theme.panel_color;

	//Division A
	this.div_a = document.createElement("div");
	this.div_a.style.position = "absolute";
	this.div_a.style.top = "0px";
	this.div_a.style.left = "0px";
	this.div_a.style.cursor = "default";
	this.div_a.style.overflow = "hidden";
	this.div_a.style.backgroundColor = Editor.theme.panel_color;
	this.element.appendChild(this.div_a);

	//Division B
	this.div_b = document.createElement("div");
	this.div_b.style.position = "absolute";
	this.div_b.style.cursor = "default";
	this.div_b.style.overflow = "hidden";
	this.div_b.style.backgroundColor = Editor.theme.panel_color;
	this.element.appendChild(this.div_b);

	//Create resize_tab tab
	this.resize_tab = document.createElement("div");
	this.resize_tab.style.position = "absolute";
	this.resize_tab.style.cursor = "e-resize";
	this.resize_tab.style.backgroundColor = Editor.theme.resize_tab_color;
	this.element.appendChild(this.resize_tab);

	//Element atributes
	this.fit_parent = false;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Resize Tab
	this.tab_position = 0.5;
	this.tab_position_max = 1;
	this.tab_position_min = 0;
	this.tab_size = 5;
	this.orientation = DualDivisionResizable.HORIZONTAL;
	this.resizing = false;

	//Self pointer
	var self = this;

	//On mouse down start resizing
	this.resize_tab.onmousedown = function(event)
	{
		self.resizing = true;
	};
	
	//Prevent Drop event
	this.resize_tab.ondrop = function(event)
	{
		event.preventDefault();
	};

	//Prevent deafault when object dragged over
	this.resize_tab.ondragover = function(event)
	{
		event.preventDefault();
	};
	
	this.container = Interface;

	//Add element to document
	this.parent.appendChild(this.element);
}

//DualDivisionResizable conter
DualDivisionResizable.id = 0;

//Resizable side
DualDivisionResizable.HORIZONTAL = 0;
DualDivisionResizable.VERTICAL = 1;

//Set container
DualDivisionResizable.prototype.setContainer = function(container)
{
	this.container = container;
}

//Remove element
DualDivisionResizable.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
		this.parent.removeChild(this.resize_tab);
	}
	catch(e){}
}

//Update status
DualDivisionResizable.prototype.update = function()
{
	if(this.resizing)
	{
		if(Mouse.buttonPressed(Mouse.LEFT))
		{
			if(this.orientation == DualDivisionResizable.HORIZONTAL)
			{	
				this.tab_position += Mouse.delta.x/this.size.x;
			}
			else if(this.orientation == DualDivisionResizable.VERTICAL)
			{
				this.tab_position += Mouse.delta.y/this.size.y;
			}

			//Limit tab position
			if(this.tab_position > this.tab_position_max)
			{
				this.tab_position = this.tab_position_max;
			}
			else if(this.tab_position < this.tab_position_min)
			{
				this.tab_position = this.tab_position_min;
			}

			this.container.updateInterface();
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
	if(this.fit_parent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}
	
	//Set visibility
	if(this.visible)
	{
		this.resize_tab.style.visibility = "visible";
		this.div_a.style.visibility = "visible";
		this.div_b.style.visibility = "visible";
		this.element.style.visibility = "visible";
	}
	else
	{
		this.div_a.style.visibility = "hidden";
		this.div_b.style.visibility = "hidden";
		this.resize_tab.style.visibility = "hidden";
		this.element.style.visibility = "hidden";
	}

	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";

	if(this.orientation == DualDivisionResizable.HORIZONTAL)
	{	
		var tab_position_abs = this.tab_position * this.size.x;

		this.resize_tab.style.cursor = "e-resize";

		this.div_a.style.width = tab_position_abs + "px";
		this.div_a.style.height = this.size.y + "px";

		this.div_b.style.top = "0px";
		this.div_b.style.left = tab_position_abs + "px";
		this.div_b.style.width = (this.size.x - tab_position_abs - this.tab_size)+ "px";
		this.div_b.style.height = this.size.y + "px";
		
		this.resize_tab.style.top = "0px";
		this.resize_tab.style.left = tab_position_abs + "px";
		this.resize_tab.style.width = this.tab_size + "px";
		this.resize_tab.style.height = this.size.y + "px";
	}
	else if(this.orientation == DualDivisionResizable.VERTICAL)
	{
		var tab_position_abs = this.tab_position * this.size.y;

		this.resize_tab.style.cursor = "n-resize";

		this.div_a.style.width = this.size.x + "px";
		this.div_a.style.height = tab_position_abs + "px";

		this.div_b.style.top = tab_position_abs + "px";
		this.div_b.style.left = "0px";
		this.div_b.style.width = this.size.x + "px";
		this.div_b.style.height = (this.size.y - tab_position_abs - this.tab_size)+ "px";
		
		this.resize_tab.style.top = tab_position_abs + "px";
		this.resize_tab.style.left = "0px";
		this.resize_tab.style.width = this.size.x + "px";
		this.resize_tab.style.height = this.tab_size + "px";
	}
}
