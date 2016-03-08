function DivisionResizable(parent, id)
{
	//Parent
	if(parent === undefined)
	{
		this.parent = null;
	}
	else
	{
		this.parent = parent;
	}

	//ID
	if(id === undefined)
	{
		var id = "div_resizable" + DivisionResizable.id;
		DivisionResizable.id++;
	}

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.style.backgroundColor = "#333333";

	//Create resize_tab tab
	this.resize_tab = document.createElement("div");
	this.resize_tab.id = id + "_tab";
	this.resize_tab.style.position = "absolute";
	this.resize_tab.style.backgroundColor = "#222222";

	this.resize_tab_size = 10;
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

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);

	//Update element
	this.updateInterface();

	//Add element to document
	document.body.appendChild(this.element);
	document.body.appendChild(this.resize_tab);
}

//DivisionResizable conter
DivisionResizable.id = 0;

//Functions Prototype
DivisionResizable.prototype.update = update;
DivisionResizable.prototype.updateInterface = updateInterface;

//Update status
function update()
{
	if(this.resizing && Mouse.buttonPressed(Mouse.LEFT))
	{
		this.size.x -= Mouse.pos_diff.x;

		//Limit Size
		if(this.size.x < this.resize_tab_size)
		{
			this.size.x = this.resize_tab_size;
		}
		if(this.size.y < this.resize_tab_size)
		{
			this.size.y = this.resize_tab_size;
		}

		//Update Parent interface
		if(parent != null)
		{
			this.parent.updateInterface();
		}
	}
	else
	{
		this.resizing = false;
	}
}

//Update DivisionResizable Size
function updateInterface()
{
	this.resize_tab.style.top = this.position.y + "px";
	this.resize_tab.style.left = this.position.x + "px";
	this.resize_tab.style.width = this.resize_tab_size + "px";
	this.resize_tab.style.height = this.size.y + "px";

	this.element.style.top = this.position.y + "px";
	this.element.style.left = (this.position.x + this.resize_tab_size) + "px";
	this.element.style.width = (this.size.x - this.resize_tab_size) + "px";
	this.element.style.height = this.size.y + "px";
}
