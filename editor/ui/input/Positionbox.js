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

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";

	//X Text
	this.x_text = document.createElement("div");
	this.x_text.style.position = "absolute";
	this.x_text.style.width = "15px";
	this.x_text.style.textAlign = "center";
	this.x_text.style.verticalAlign = "middle";
	this.x_text.innerHTML = "X";
	this.element.appendChild(this.x_text);

	//X
	this.x = document.createElement("input");
	this.x.type = "number";
	this.x.className = "text_box";
	this.x.style.position = "absolute";
	this.x.style.left = "15px";
	this.element.appendChild(this.x);

	//Y Text
	this.y_text = document.createElement("div");
	this.y_text.style.position = "absolute";
	this.y_text.style.width = "15px";
	this.y_text.style.textAlign = "center";
	this.y_text.style.verticalAlign = "middle";
	this.y_text.innerHTML = "Y";
	this.element.appendChild(this.y_text);;

	//Y
	this.y = document.createElement("input");
	this.y.type = "number";
	this.y.className = "text_box";
	this.y.style.position = "absolute";
	this.element.appendChild(this.y);

	//Z Text
	this.z_text = document.createElement("div");
	this.z_text.style.position = "absolute";
	this.z_text.style.width = "15px";
	this.z_text.style.textAlign = "center";
	this.z_text.style.verticalAlign = "middle";
	this.z_text.innerHTML = "Z";
	this.element.appendChild(this.z_text);

	//Z
	this.z = document.createElement("input");
	this.z.type = "number";
	this.z.className = "text_box";
	this.z.style.position = "absolute";
	this.element.appendChild(this.z);

	//Attributes
	this.mode = PositionBox.VECTOR3;
	this.size = new THREE.Vector2(220, 20);
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
	if(x instanceof THREE.Vector2)
	{
		this.x.value = x.x;
		this.y.value = x.y;
	}
	else if(x instanceof THREE.Vector3)
	{
		this.x.value = x.x;
		this.y.value = x.y;
		this.z.value = x.z;
	}
	else
	{
		this.x.value = x;
		this.y.value = y;
		this.z.value = z;
	}
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
		else
		{
			this.z.style.visibility = "hidden";
			this.z_text.style.visibility = "hidden";
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

	var size_x = (this.size.x - 45) / 3;
	var size_y = this.size.y + "px";

	this.x_text.style.height = size_y;
	this.x_text.style.lineHeight = size_y;
	this.x.style.width = size_x + "px";
	this.x.style.height = (this.size.y - 2) + "px";

	this.y_text.style.left = (15 + size_x) + "px";
	this.y_text.style.height = size_y;
	this.y_text.style.lineHeight = size_y;
	this.y.style.left = (30 + size_x) + "px";
	this.y.style.width = size_x + "px";
	this.y.style.height = (this.size.y - 2) + "px";

	this.z_text.style.left = (30 + (2 * size_x)) + "px";
	this.z_text.style.height = size_y;
	this.z_text.style.lineHeight = size_y;
	this.z.style.left = (45 + (2 * size_x)) + "px";
	this.z.style.width = size_x + "px";
	this.z.style.height = (this.size.y - 2) + "px";

	//Main element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}