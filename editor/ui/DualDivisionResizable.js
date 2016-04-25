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
	this.element.className = "container";

	//Division A
	this.div_a = document.createElement("div");
	this.div_a.style.position = "absolute";
	this.div_a.className = "container";

	//Division B
	this.div_b = document.createElement("div");
	this.div_b.style.position = "absolute";
	this.div_b.className = "container";

	//Create resize_tab tab
	this.resize_tab = document.createElement("div");
	this.resize_tab.style.position = "absolute";
	this.resize_tab.className = "panel_res_hor_tab";

	//Add divs and tabs to element
	this.element.appendChild(this.div_a);
	this.element.appendChild(this.div_b);
	this.element.appendChild(this.resize_tab);

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Resize Tab
	this.tab_position = 100;
	this.tab_size = 5;
	this.orientation = DualDivisionResizable.HORIZONTAL;
	this.resizing = false;

	//On mouse move event
	var self = this;
	this.resize_tab.onmousemove = function(event)
	{
		if(Mouse.buttonPressed(Mouse.LEFT))
		{
			self.resizing = true;
		}
	};
	
	//Update element
	this.updateInterface();

	//Add element to document
	this.parent.appendChild(this.element);
}

//DualDivisionResizable conter
DualDivisionResizable.id = 0;

//Resizable side
DualDivisionResizable.HORIZONTAL = 0;
DualDivisionResizable.VERTICAL = 1;

//Functions Prototype
DualDivisionResizable.prototype.update = update;
DualDivisionResizable.prototype.updateInterface = updateInterface;
DualDivisionResizable.prototype.destroy = destroy;

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
		if(this.orientation == DualDivisionResizable.HORIZONTAL)
		{	
			this.tab_position += Mouse.pos_diff.x;
			if(this.tab_position > (this.size.x-this.tab_size))
			{
				this.tab_position = (this.size.x-this.tab_size);
			}
		}
		else if(this.orientation == DualDivisionResizable.VERTICAL)
		{
			this.tab_position += Mouse.pos_diff.y;
			if(this.tab_position > (this.size.y-this.tab_size))
			{
				this.tab_position = (this.size.y-this.tab_size);
			}
		}

		//Limit Size
		if(this.tab_position < this.tab_size)
		{
			this.tab_position = this.tab_size;
		}

		Interface.updateInterface();
	}
	else
	{
		this.resizing = false;
	}
}

//Update DualDivisionResizable Size
function updateInterface()
{
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
		this.resize_tab.className = "panel_res_hor_tab";

		this.div_a.style.top = "0px";
		this.div_a.style.left = "0px";
		this.div_a.style.width = this.tab_position + "px";
		this.div_a.style.height = this.size.y + "px";

		this.div_b.style.top = "0px";
		this.div_b.style.left = this.tab_position + "px";
		this.div_b.style.width = (this.size.x - this.tab_position - this.tab_size)+ "px";
		this.div_b.style.height = this.size.y + "px";
		
		this.resize_tab.style.top = "0px";
		this.resize_tab.style.left = this.tab_position + "px";
		this.resize_tab.style.width = this.tab_size + "px";
		this.resize_tab.style.height = this.size.y + "px";
	}
	else if(this.orientation == DualDivisionResizable.VERTICAL)
	{
		this.resize_tab.className = "panel_res_ver_tab";

		this.div_a.style.top = "0px";
		this.div_a.style.left = "0px";
		this.div_a.style.width = this.size.x + "px";
		this.div_a.style.height = this.tab_position + "px";

		this.div_b.style.top = this.tab_position + "px";
		this.div_b.style.left = "0px";
		this.div_b.style.width = this.size.x + "px";
		this.div_b.style.height = (this.size.y - this.tab_position - this.tab_size)+ "px";
		
		this.resize_tab.style.top = this.tab_position + "px";
		this.resize_tab.style.left = "0px";
		this.resize_tab.style.width = this.size.x + "px";
		this.resize_tab.style.height = this.tab_size + "px";

	}
}
