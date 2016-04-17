function LightPanel(parent)
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
	var id = "light_panel" + LightPanel.id;
	LightPanel.id++;

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
	this.fit_parent = true;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Self pointer
	var self = this;

	//Name text
	var text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Name");
	text.position.set(5, 20);
	text.updateInterface();

	//Name textbox
	this.name = new Textbox(this.element);
	this.name.position.set(50, 10);
	this.name.size.set(200, 18);
	this.name.updateInterface();
	this.name.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.name = self.name.getText();
			Editor.updateTreeView();
		}
	});

	//Position
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Position");
	text.position.set(5, 50);
	text.updateInterface();

	this.pos = new Positionbox(this.element);
	this.pos.position.set(56, 40);
	this.pos.updateInterface();
	this.pos.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var position = self.pos.getValue();
			self.obj.position.set(position.x, position.y, position.z);
		}
	});

	//Color
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Color");
	text.position.set(5, 75);
	text.updateInterface();

	this.color = new ColorChooser(this.element);
	this.color.size.set(50, 20);
	this.color.position.set(50, 65);
	this.color.updateInterface();
	this.color.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.color.setHex(self.color.getValue());
		}
	});

	//Add element to document
	this.parent.appendChild(this.element);
}

//LightPanel conter
LightPanel.id = 0;

//Functions Prototype
LightPanel.prototype.update = update;
LightPanel.prototype.updateInterface = updateInterface;
LightPanel.prototype.destroy = destroy;
LightPanel.prototype.attachObject = attachObject;
LightPanel.prototype.updateObject = updateObject;

function updateObject()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);

		this.pos.setValue(this.obj.position.x, this.obj.position.y, this.obj.position.z);
		this.color.setValue(this.obj.color.getHexString());
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

//Update LightPanel
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
