function Numberbox(parent)
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
	var id = "num_box" + Numberbox.id;
	Numberbox.id++;

	//Create element
	this.element = document.createElement("input");
	this.element.type = "number";
	this.element.className = "text_box";
	this.element.step = "0.1";
	this.element.style.position = "absolute";

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Add element to document
	this.parent.appendChild(this.element);
}

//Numberbox ID counter
Numberbox.id = 0;

//Functions Prototype
Numberbox.prototype.update = update;
Numberbox.prototype.updateInterface = updateInterface;
Numberbox.prototype.destroy = destroy;
Numberbox.prototype.getValue = getValue;
Numberbox.prototype.setValue = setValue;
Numberbox.prototype.setStep = setStep;
Numberbox.prototype.setRange = setRange;
Numberbox.prototype.setOnChange = setOnChange;
Numberbox.prototype.setDisabled = setDisabled;

//Set if element if disabled
function setDisabled(value)
{
	this.element.disabled = value;
}

//Set numberbox range
function setRange(min, max)
{
	this.element.min = String(min);
	this.element.max = String(max);
}

//Set step
function setStep(value)
{
	this.element.step = String(value);
}

//Set onchange callback
function setOnChange(callback)
{
	this.element.onchange = callback;
}

//Set value
function setValue(value)
{
	this.element.value = value;
}

//Get text
function getValue()
{
	return parseFloat(this.element.value);
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