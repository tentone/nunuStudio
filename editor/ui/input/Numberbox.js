function NumberBox(parent)
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
	var id = "num_box" + NumberBox.id;
	NumberBox.id++;

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

//NumberBox ID counter
NumberBox.id = 0;

//Functions Prototype
NumberBox.prototype.update = update;
NumberBox.prototype.updateInterface = updateInterface;
NumberBox.prototype.destroy = destroy;
NumberBox.prototype.getValue = getValue;
NumberBox.prototype.setValue = setValue;
NumberBox.prototype.setStep = setStep;
NumberBox.prototype.setRange = setRange;
NumberBox.prototype.setOnChange = setOnChange;
NumberBox.prototype.setDisabled = setDisabled;

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