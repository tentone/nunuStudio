function PositionBox(parent)
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
	var id = "pos_box" + PositionBox.id;
	PositionBox.id++;

	//Base element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";

	//X Text
	this.x_text = document.createElement("div");
	this.x_text.style.position = "absolute";
	this.x_text.style.left = "0px";
	this.x_text.style.top = "3px";
	this.x_text.className = "text";
	this.element.appendChild(this.x_text);
	var span = document.createElement("span");
	span.style.whiteSpace = "nowrap";
	span.innerHTML = "X";
	this.x_text.appendChild(span);

	//X
	this.x = document.createElement("input");
	this.x.type = "number";
	this.x.className = "text_box";
	this.x.step = "0.1";
	this.x.style.position = "absolute";
	this.x.style.left = "15px";
	this.x.style.top = "0px";
	this.x.style.width = "60px";
	this.x.style.height = "18px";
	this.element.appendChild(this.x);

	//Y Text
	this.y_text = document.createElement("div");
	this.y_text.style.position = "absolute";
	this.y_text.style.left = "80px";
	this.y_text.style.top = "3px";
	this.y_text.className = "text";
	this.element.appendChild(this.y_text);
	var span = document.createElement("span");
	span.style.whiteSpace = "nowrap";
	span.innerHTML = "Y";
	this.y_text.appendChild(span);

	//Y
	this.y = document.createElement("input");
	this.y.type = "number";
	this.y.className = "text_box";
	this.y.step = "0.1";
	this.y.style.position = "absolute";
	this.y.style.left = "95px";
	this.y.style.top = "0px";
	this.y.style.width = "60px";
	this.y.style.height = "18px";
	this.element.appendChild(this.y);

	//Z Text
	this.z_text = document.createElement("div");
	this.z_text.style.position = "absolute";
	this.z_text.style.left = "160px";
	this.z_text.style.top = "3px";
	this.z_text.className = "text";
	this.element.appendChild(this.z_text);
	var span = document.createElement("span");
	span.style.whiteSpace = "nowrap";
	span.innerHTML = "Z";
	this.z_text.appendChild(span);

	//Z
	this.z = document.createElement("input");
	this.z.type = "number";
	this.z.className = "text_box";
	this.z.step = "0.1";
	this.z.style.position = "absolute";
	this.z.style.left = "175px";
	this.z.style.top = "0px";
	this.z.style.width = "60px";
	this.z.style.height = "18px";
	this.element.appendChild(this.z);

	//Element atributes
	this.mode = PositionBox.VECTOR3;
	this.size = new THREE.Vector2(250, 18);
	this.position = new THREE.Vector2(0, 0);
	this.visible = true;
	
	//Add element to document
	this.parent.appendChild(this.element);
}

//PositionBox ID counter
PositionBox.id = 0;

//Positionbox mode
PositionBox.VECTOR2 = 0;
PositionBox.VECTOR3 = 1;

//Functions Prototype
PositionBox.prototype.update = update;
PositionBox.prototype.updateInterface = updateInterface;
PositionBox.prototype.destroy = destroy;
PositionBox.prototype.setOnChange = setOnChange;
PositionBox.prototype.getValue = getValue;
PositionBox.prototype.setValue = setValue;
PositionBox.prototype.setStep = setStep;
PositionBox.prototype.setMode = setMode;

//Set position box mode
function setMode(mode)
{
	this.mode = mode;

	if(mode === PositionBox.VECTOR2)
	{
		this.z.style.visibility = "hidden";
		this.z_text.style.visibility = "hidden";
	}
	else if(mode === PositionBox.VECTOR3)
	{
		this.z_text.style.visibility = "visible";
		this.z.style.visibility = "visible";
	}
}

//Set step for position box
function setStep(value)
{
	var value = String(value);
	this.x.step = value;
	this.y.step = value;
	this.x.step = value;
}

//Get value of position box
function getValue()
{
	return {x: parseFloat(this.x.value), y: parseFloat(this.y.value), z: parseFloat(this.z.value)};
}

//Set value of position box
function setValue(x, y, z)
{
	this.x.value = x;
	this.y.value = y;
	this.z.value = z;
}

//Set onchange callback
function setOnChange(callback)
{
	this.x.onchange = callback;
	this.y.onchange = callback;
	this.z.onchange = callback;
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
		this.x.style.visibility = "visible";
		this.x_text.style.visibility = "visible";
		this.y.style.visibility = "visible";
		this.y_text.style.visibility = "visible";
		if(this.mode === PositionBox.VECTOR3)
		{
			this.z.style.visibility = "visible";
			this.z_text.style.visibility = "visible";
		}
	}
	else
	{
		this.element.style.visibility = "hidden";
		this.x.style.visibility = "hidden";
		this.x_text.style.visibility = "hidden";
		this.y.style.visibility = "hidden";
		this.y_text.style.visibility = "hidden";
		this.z.style.visibility = "hidden";
		this.z_text.style.visibility = "hidden";
	}

	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}