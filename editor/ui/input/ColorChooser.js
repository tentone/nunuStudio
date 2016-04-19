function ColorChooser(parent)
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
	var id = "color" + ColorChooser.id;
	ColorChooser.id++;

	//Create element
	this.element = document.createElement("input");
	this.element.type = "text";
	this.element.className = "text_box";
	this.element.id = id;
	this.element.style.position = "absolute";

	//Color chooser
	this.color = new jscolor(this.element);
	this.color.shadow = false;
	this.color.borderWidth = 0;
	this.color.borderRadius = 0;
	this.color.zIndex = 500;

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	this.callback = null;

	//Click event
	var self = this;
	this.element.onchange = function()
	{
		if(self.callback !== null)
		{
			self.callback();
		}
	};

	//Add element to document
	this.parent.appendChild(this.element);
}

//ColorChooser ID counter
ColorChooser.id = 0;

//Functions Prototype
ColorChooser.prototype.update = update;
ColorChooser.prototype.updateInterface = updateInterface;
ColorChooser.prototype.destroy = destroy;
ColorChooser.prototype.getValue = getValue;
ColorChooser.prototype.setValue = setValue;
ColorChooser.prototype.setOnChange = setOnChange;

//Set onchange callback
function setOnChange(callback)
{
	this.element.onchange = callback;
}

//Set color
function setValue(r, g, b)
{
	this.color.fromRGB(r*255, g*255, b*255);
}

//Get Slider value
function getValue()
{
	return {r: this.color.rgb[0]/255, g: this.color.rgb[1]/255, b: this.color.rgb[2]/255};
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

//Update
function update(){}

//Update Interface
function updateInterface()
{
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