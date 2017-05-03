"use strict";

function CoordinatesBox(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";

	//X Text
	this.xText = document.createElement("div");
	this.xText.style.position = "absolute";
	this.xText.style.width = "15px";
	this.xText.style.textAlign = "center";
	this.xText.style.verticalAlign = "middle";
	//this.xText.style.backgroundColor = "#AA0000";
	//this.xText.style.borderRadius = "4px";
	this.xText.innerHTML = "X";
	this.element.appendChild(this.xText);

	//X
	this.x = document.createElement("input");
	this.x.type = "number";
	this.x.style.backgroundColor = Editor.theme.boxColor;
	this.x.style.color = Editor.theme.textColor;
	this.x.style.borderStyle = "none";
	this.x.style.position = "absolute";
	this.x.style.left = "15px";
	this.x.style.boxSizing = "border-box";
	this.x.style.textIndent = "4px";
	this.x.style.borderRadius = "4px";
	this.element.appendChild(this.x);

	//Y Text
	this.yText = document.createElement("div");
	this.yText.style.position = "absolute";
	this.yText.style.width = "15px";
	this.yText.style.textAlign = "center";
	this.yText.style.verticalAlign = "middle";
	//this.yText.style.backgroundColor = "#00AA00";
	//this.yText.style.borderRadius = "4px";
	this.yText.innerHTML = "Y";
	this.element.appendChild(this.yText);

	//Y
	this.y = document.createElement("input");
	this.y.type = "number";
	this.y.style.backgroundColor = Editor.theme.boxColor;
	this.y.style.color = Editor.theme.textColor;
	this.y.style.borderStyle = "none";
	this.y.style.position = "absolute";
	this.y.style.boxSizing = "border-box";
	this.y.style.textIndent = "4px";
	this.y.style.borderRadius = "4px";
	this.element.appendChild(this.y);

	//Z Text
	this.zText = document.createElement("div");
	this.zText.style.position = "absolute";
	this.zText.style.width = "15px";
	this.zText.style.textAlign = "center";
	this.zText.style.verticalAlign = "middle";
	//this.zText.style.backgroundColor = "#0000AA";
	//this.zText.style.borderRadius = "4px";
	this.zText.innerHTML = "Z";
	this.element.appendChild(this.zText);

	//Z
	this.z = document.createElement("input");
	this.z.type = "number";
	this.z.style.backgroundColor = Editor.theme.boxColor;
	this.z.style.color = Editor.theme.textColor;
	this.z.style.borderStyle = "none";
	this.z.style.position = "absolute";
	this.z.style.boxSizing = "border-box";
	this.z.style.textIndent = "4px";
	this.z.style.borderRadius = "4px";
	this.element.appendChild(this.z);

	//W Text
	this.wText = document.createElement("div");
	this.wText.style.position = "absolute";
	this.wText.style.width = "15px";
	this.wText.style.textAlign = "center";
	this.wText.style.verticalAlign = "middle";
	this.wText.innerHTML = "W";
	this.element.appendChild(this.wText);

	//W
	this.w = document.createElement("input");
	this.w.type = "number";
	this.w.style.backgroundColor = Editor.theme.boxColor;
	this.w.style.color = Editor.theme.textColor;
	this.w.style.borderStyle = "none";
	this.w.style.position = "absolute";
	this.element.appendChild(this.w);

	//Order
	this.order = "XYZ";
	this.mode = CoordinatesBox.VECTOR3;

	//Attributes
	this.size = new THREE.Vector2(180, 18);
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
};

//Set step for position box
CoordinatesBox.prototype.setStep = function(value)
{
	var value = String(value);
	this.x.step = value;
	this.y.step = value;
	this.z.step = value;
	this.w.step = value;
};

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
};

//Get value of position box
CoordinatesBox.prototype.getValue = function()
{
	return {x: parseFloat(this.x.value), y: parseFloat(this.y.value), z: parseFloat(this.z.value), w: parseFloat(this.w.value), order: this.order};
};

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
};

//Set onchange onChange
CoordinatesBox.prototype.setOnChange = function(onChange)
{
	this.x.onchange = onChange;
	this.y.onchange = onChange;
	this.z.onchange = onChange;
	this.w.onchange = onChange;
};

//Remove element
CoordinatesBox.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}
};

//Update Interface
CoordinatesBox.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";

		var sizeX = Math.round((this.size.x - this.mode * 15) / this.mode);
		var sizeY = this.size.y + "px";

		this.xText.style.height = sizeY;
		this.xText.style.lineHeight = sizeY;
		this.x.style.width = sizeX + "px";

		this.yText.style.left = (15 + sizeX) + "px";
		this.yText.style.height = sizeY;
		this.yText.style.lineHeight = sizeY;
		this.y.style.left = (30 + sizeX) + "px";
		this.y.style.width = sizeX + "px";

		if(this.mode >= CoordinatesBox.VECTOR3)
		{
			this.zText.style.left = (30 + (2 * sizeX)) + "px";
			this.zText.style.height = sizeY;
			this.zText.style.lineHeight = sizeY;
			this.z.style.left = (45 + (2 * sizeX)) + "px";
			this.z.style.width = sizeX + "px";

			if(this.mode === CoordinatesBox.QUATERNION)
			{
				this.wText.style.left = (45 + (3 * sizeX)) + "px";
				this.wText.style.height = sizeY;
				this.wText.style.lineHeight = sizeY;
				this.w.style.left = (60 + (3 * sizeX)) + "px";
				this.w.style.width = sizeX + "px";

				this.zText.style.visibility = "visible";
				this.z.style.visibility = "visible";
				this.w.style.visibility = "visible";
				this.wText.style.visibility = "visible";
			}
			else
			{
				this.zText.style.visibility = "visible";
				this.z.style.visibility = "visible";
				this.w.style.visibility = "hidden";
				this.wText.style.visibility = "hidden";
			}
		}
		else
		{
			this.z.style.visibility = "hidden";
			this.zText.style.visibility = "hidden";
			this.w.style.visibility = "hidden";
			this.wText.style.visibility = "hidden";
		}
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Main element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
};