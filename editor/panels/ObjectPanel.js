function ObjectPanel(parent)
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
	var id = "obj_panel" + ObjectPanel.id;
	ObjectPanel.id++;

	//Create element
	this.element = document.createElement("form");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.className = "panel";
	this.element.onsubmit = function(event)
	{
		event.preventDefault();
	};
	
	//Object attached
	this.obj = null;

	//Element atributes
	this.fit_parent = false;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Self pointer
	var self = this;

	//Name text
	var text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Name:");
	text.position.set(5, 20);
	text.updateInterface();

	//Name textbox
	this.name = new Textbox(this.element);
	this.name.position.set(50, 10);
	this.name.size.set(200, 20);
	this.name.updateInterface();
	this.name.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.name = self.name.getText();
			Editor.updateTreeView();
		}
	});

	//Position text
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Position: X");
	text.position.set(5, 45);
	text.updateInterface();

	//X
	this.pos_x= new Numberbox(this.element);
	this.pos_x.position.set(50, 45);
	this.pos_x.size.set(50, 20);
	this.pos_x.updateInterface();
	this.pos_x.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.position.x = self.pos_x.getValue();
			Editor.updateTreeView();
		}
	});

	//Checkbox test
	this.check = new Checkbox(this.element);
	this.check.size.set(200, 15);
	this.check.position.set(5, 50);
	this.check.updateInterface();

	//Color chooser
	this.color = new ColorChooser(this.element);
	this.color.size.set(200, 15);
	this.color.position.set(5, 80);
	this.color.updateInterface();

	//Slider
	this.slider = new Slider(this.element);
	this.slider.size.set(200, 15);
	this.slider.position.set(5, 110);
	this.slider.updateInterface();

	//Dropdown
	this.drop = new DropdownList(this.element);
	this.drop.size.set(200, 20);
	this.drop.position.set(0, 140);
	this.drop.updateInterface();

	this.drop.addValue("AAAAA");
	this.drop.addValue("BBBBB");
	this.drop.addValue("CCCCC");

	//Add element to document
	this.parent.appendChild(this.element);
}

//ObjectPanel conter
ObjectPanel.id = 0;

//Functions Prototype
ObjectPanel.prototype.update = update;
ObjectPanel.prototype.updateInterface = updateInterface;
ObjectPanel.prototype.destroy = destroy;
ObjectPanel.prototype.attachObject = attachObject;
ObjectPanel.prototype.updateObject = updateObject;

function updateObject()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.pos_x.setValue(this.obj.position.x);
	}
}

//Attach object to panel
function attachObject(obj)
{
	this.obj = obj;
	this.updateObject();
	this.updateInterface();
}

//Remove element
function destroy()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update ObjectPanel
function update(){}

//Update division Size
function updateInterface()
{
	if(this.fit_parent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}
	
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
