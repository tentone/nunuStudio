"use strict";

function CoordinatesBox(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

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
	this.x.style.backgroundColor = Editor.theme.box_color;
	this.x.style.color = Editor.theme.text_color;
	this.x.style.borderStyle = "none";
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
	this.y.style.backgroundColor = Editor.theme.box_color;
	this.y.style.color = Editor.theme.text_color;
	this.y.style.borderStyle = "none";
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
	this.z.style.backgroundColor = Editor.theme.box_color;
	this.z.style.color = Editor.theme.text_color;
	this.z.style.borderStyle = "none";
	this.z.style.position = "absolute";
	this.element.appendChild(this.z);

	//W Text
	this.w_text = document.createElement("div");
	this.w_text.style.position = "absolute";
	this.w_text.style.width = "15px";
	this.w_text.style.textAlign = "center";
	this.w_text.style.verticalAlign = "middle";
	this.w_text.innerHTML = "W";
	this.element.appendChild(this.w_text);

	//W
	this.w = document.createElement("input");
	this.w.type = "number";
	this.w.style.backgroundColor = Editor.theme.box_color;
	this.w.style.color = Editor.theme.text_color;
	this.w.style.borderStyle = "none";
	this.w.style.position = "absolute";
	this.element.appendChild(this.w);

	//Order
	this.order = "XYZ";

	//Attributes
	this.mode = CoordinatesBox.VECTOR3;
	this.size = new THREE.Vector2(220, 20);
	this.position = new THREE.Vector2(0, 0);
	this.visible = true;
	
	//Add element to document
	this.parent.appendChild(this.element);
}

//Positionbox mode
CoordinatesBox.VECTOR2 = 2;
CoordinatesBox.VECTOR3 = 3;
CoordinatesBox.QUATERNION = 4;

//Set position box mode
CoordinatesBox.prototype.setMode = function(mode)
{
	if(this.mode !== mode)
	{
		this.mode = mode;
		this.updateInterface();
	}
}

//Set step for position box
CoordinatesBox.prototype.setStep = function(value)
{
	var value = String(value);
	this.x.step = value;
	this.y.step = value;
	this.z.step = value;
	this.w.step = value;
}

//Set coordinate range
CoordinatesBox.prototype.setRange = function(min, max)
{
 	var min = String(min);
 	var max = String(max);
	this.x.min = min;
	this.x.max = max;
	this.y.min = min;
	this.y.max = max;
	this.z.min = min;
	this.z.max = max;
	this.w.min = min;
	this.w.max = max;	
}

//Get value of position box
CoordinatesBox.prototype.getValue = function()
{
	return {x: parseFloat(this.x.value), y: parseFloat(this.y.value), z: parseFloat(this.z.value), w: parseFloat(this.w.value), order: this.order};
}

//Set value of position box
CoordinatesBox.prototype.setValue = function(x, y, z, w)
{
	if(x instanceof THREE.Vector2)
	{
		this.x.value = x.x;
		this.y.value = x.y;
		this.setMode(CoordinatesBox.VECTOR2);
	}
	else if(x instanceof THREE.Vector3)
	{
		this.x.value = x.x;
		this.y.value = x.y;
		this.z.value = x.z;
		this.setMode(CoordinatesBox.VECTOR3);
	}
	else if(x instanceof THREE.Euler)
	{
		this.x.value = x.x;
		this.y.value = x.y;
		this.z.value = x.z;
		this.order = x.order;
		this.setMode(CoordinatesBox.VECTOR3);
	}
	else if(x instanceof THREE.Quaternion)
	{
		this.x.value = x.x;
		this.y.value = x.y;
		this.z.value = x.z;
		this.w.value = x.w;
		this.setMode(CoordinatesBox.QUATERNION);
	}
	else
	{
		this.x.value = x;
		this.y.value = y;
		this.z.value = (z !== undefined) ? z : 0;
		this.w.value = (w !== undefined) ? w : 0;
	}
}

//Set onchange callback
CoordinatesBox.prototype.setOnChange = function(callback)
{
	this.x.onchange = callback;
	this.y.onchange = callback;
	this.z.onchange = callback;
	this.w.onchange = callback;
}

//Remove element
CoordinatesBox.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update
CoordinatesBox.prototype.update = function(){}

//Update Interface
CoordinatesBox.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";
		this.x.style.visibility = "visible";
		this.x_text.style.visibility = "visible";
		this.y.style.visibility = "visible";
		this.y_text.style.visibility = "visible";

		if(this.mode === CoordinatesBox.VECTOR2)
		{
			this.z.style.visibility = "hidden";
			this.z_text.style.visibility = "hidden";
			this.w.style.visibility = "hidden";
			this.w_text.style.visibility = "hidden";
		}
		else if(this.mode === CoordinatesBox.VECTOR3)
		{
			this.z_text.style.visibility = "visible";
			this.z.style.visibility = "visible";
			this.w.style.visibility = "hidden";
			this.w_text.style.visibility = "hidden";
		}
		else if(this.mode === CoordinatesBox.QUATERNION)
		{
			this.z_text.style.visibility = "visible";
			this.z.style.visibility = "visible";
			this.w.style.visibility = "visible";
			this.w_text.style.visibility = "visible";
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

	var size_x = (this.size.x - 60) / this.mode;
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

	if(this.mode >= CoordinatesBox.VECTOR3)
	{
		this.z_text.style.left = (30 + (2 * size_x)) + "px";
		this.z_text.style.height = size_y;
		this.z_text.style.lineHeight = size_y;
		this.z.style.left = (45 + (2 * size_x)) + "px";
		this.z.style.width = size_x + "px";
		this.z.style.height = (this.size.y - 2) + "px";

		if(this.mode === CoordinatesBox.QUATERNION)
		{
			this.w_text.style.left = (45 + (3 * size_x)) + "px";
			this.w_text.style.height = size_y;
			this.w_text.style.lineHeight = size_y;
			this.w.style.left = (60 + (3 * size_x)) + "px";
			this.w.style.width = size_x + "px";
			this.w.style.height = (this.size.y - 2) + "px";
		}
	}

	//Main element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}