function DivisionResizable(parent)
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
	var id = "div_res" + DivisionResizable.id;
	DivisionResizable.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.style.cursor = "default";
	this.element.style.overflow = "hidden";
	this.element.style.backgroundColor = Editor.theme.panel_color;

	//Prevent Drop event
	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	//Prevent deafault when object dragged over
	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Create division resize tab
	this.resize_tab = document.createElement("div");
	this.resize_tab.style.position = "absolute";
	this.resize_tab.style.cursor = "e-resize";
	this.resize_tab.style.backgroundColor = Editor.theme.resize_tab_color;

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	this.resize_size_max = Number.MAX_VALUE;
	this.resize_size_min = 0;
	this.resize_tab_size = 5;
	this.resizable_side = DivisionResizable.LEFT;
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

	//Update element
	this.updateInterface();

	//Add element to document
	this.parent.appendChild(this.element);
	this.parent.appendChild(this.resize_tab);
}

//DivisionResizable conter
DivisionResizable.id = 0;

//Resizable side
DivisionResizable.LEFT = 0;
DivisionResizable.RIGHT = 1;
DivisionResizable.TOP = 2;
DivisionResizable.BOTTOM = 3;

//Functions Prototype
DivisionResizable.prototype.update = update;
DivisionResizable.prototype.updateInterface = updateInterface;
DivisionResizable.prototype.destroy = destroy;

//Remove element
function destroy()
{
	try
	{
		this.parent.removeChild(this.resize_tab);
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update status
function update()
{
	if(this.resizing && Mouse.buttonPressed(Mouse.LEFT))
	{
		if(this.resizable_side === DivisionResizable.LEFT)
		{	
			this.size.x -= Mouse.delta.x;
		}
		else if(this.resizable_side === DivisionResizable.RIGHT)
		{
			this.size.x += Mouse.delta.x;
		}
		else if(this.resizable_side === DivisionResizable.TOP)
		{
			this.size.y -= Mouse.delta.y;
		}
		else if(this.resizable_side === DivisionResizable.BOTTOM)
		{
			this.size.y += Mouse.delta.y;
		}

		//Limit Size
		if(this.resizable_side === DivisionResizable.BOTTOM || this.resizable_side === DivisionResizable.TOP)
		{
			if(this.size.y < (this.resize_tab_size + this.resize_size_min))
			{
				this.size.y = this.resize_tab_size + this.resize_size_min;
			}
			else if(this.size.y > this.resize_size_max)
			{
				this.size.y = this.resize_size_max;
			}
		}
		else
		{
			if(this.size.x < (this.resize_tab_size + this.resize_size_min))
			{
				this.size.x = (this.resize_tab_size + this.resize_size_min);
			}
			else if(this.size.x > this.resize_size_max)
			{
				this.size.x = this.resize_size_max;
			}	
		}

		//Update Parent interface
		Interface.updateInterface();
	}
	else
	{
		this.resizing = false;
	}
}

//Update DivisionResizable Size
function updateInterface()
{
	//Set visibility
	if(this.visible)
	{
		this.resize_tab.style.visibility = "visible";
		this.element.style.visibility = "visible";
	}
	else
	{
		this.resize_tab.style.visibility = "hidden";
		this.element.style.visibility = "hidden";
	}

	//Limit Size
	if(this.resizable_side === DivisionResizable.BOTTOM || this.resizable_side === DivisionResizable.TOP)
	{
		if(this.size.y < (this.resize_tab_size + this.resize_size_min))
		{
			this.size.y = this.resize_tab_size + this.resize_size_min;
		}
		else if(this.size.y > this.resize_size_max)
		{
			this.size.y = this.resize_size_max;
		}
	}
	else
	{
		if(this.size.x < (this.resize_tab_size + this.resize_size_min))
		{
			this.size.x = (this.resize_tab_size + this.resize_size_min);
		}
		else if(this.size.x > this.resize_size_max)
		{
			this.size.x = this.resize_size_max;
		}	
	}

	//Update element
	if(this.resizable_side == DivisionResizable.LEFT)
	{	
		this.resize_tab.style.cursor = "e-resize";

		this.resize_tab.style.top = this.position.y + "px";
		this.resize_tab.style.left = this.position.x + "px";
		this.resize_tab.style.width = this.resize_tab_size + "px";
		this.resize_tab.style.height = this.size.y + "px";

		this.element.style.top = this.position.y + "px";
		this.element.style.left = (this.position.x + this.resize_tab_size) + "px";
		this.element.style.width = (this.size.x - this.resize_tab_size) + "px";
		this.element.style.height = this.size.y + "px";
	}
	else if(this.resizable_side == DivisionResizable.RIGHT)
	{	
		this.resize_tab.style.cursor = "e-resize";

		this.resize_tab.style.top = this.position.y + "px";
		this.resize_tab.style.left = (this.position.x + (this.size.x - this.resize_tab_size))+ "px";
		this.resize_tab.style.width = this.resize_tab_size + "px";
		this.resize_tab.style.height = this.size.y + "px";

		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = (this.size.x - this.resize_tab_size) + "px";
		this.element.style.height = this.size.y + "px";
	}
	else if(this.resizable_side == DivisionResizable.TOP)
	{
		this.resize_tab.style.cursor = "n-resize";

		this.resize_tab.style.top = this.position.y + "px";
		this.resize_tab.style.left = this.position.x + "px";
		this.resize_tab.style.width = this.size.x + "px";
		this.resize_tab.style.height = this.resize_tab_size + "px";

		this.element.style.top = (this.position.y + this.resize_tab_size) + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = (this.size.y - this.resize_tab_size) + "px";
	}
	else if(this.resizable_side == DivisionResizable.BOTTOM)
	{
		this.resize_tab.style.cursor = "n-resize";

		this.resize_tab.style.top = (this.position.y + (this.size.y - this.resize_tab_size)) + "px";
		this.resize_tab.style.left = this.position.x + "px";
		this.resize_tab.style.width = this.size.x + "px";
		this.resize_tab.style.height = this.resize_tab_size + "px";

		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = (this.size.y - this.resize_tab_size) + "px";
	}
}
