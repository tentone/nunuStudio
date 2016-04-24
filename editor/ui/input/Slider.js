function Slider(parent)
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
	var id = "slider" + Slider.id;
	Slider.id++;

	//Create element
	this.element = document.createElement("input");
	this.element.type = "range";
	this.element.min = "0";
	this.element.max = "100";
	this.element.id = id;
	this.element.style.position = "absolute";

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Add element to document
	this.parent.appendChild(this.element);
}

//Slider ID counter
Slider.id = 0;

//Functions Prototype
Slider.prototype.update = update;
Slider.prototype.updateInterface = updateInterface;
Slider.prototype.destroy = destroy;
Slider.prototype.getValue = getValue;
Slider.prototype.setValue = setValue;
Slider.prototype.setOnChange = setOnChange;
Slider.prototype.setRange = setRange;
Slider.prototype.setStep = setStep;

//Set slider min step
function setStep(step)
{
	this.element.step = String(step);
}

//Set slider range
function setRange(min, max)
{
	this.element.min = String(min);
	this.element.max = String(max);
}

//Set onchange callback
function setOnChange(callback)
{
	this.element.onchange = callback;
}

//Get Slider value
function setValue(value)
{
	this.element.value = value;
}

//Get Slider value
function getValue()
{
	return this.element.value;
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