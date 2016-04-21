function DropdownList(parent)
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
	var id = "droplist" + DropdownList.id;
	DropdownList.id++;

	//Create element
	this.element = document.createElement("select");
	this.element.className = "text_box";
	this.element.id = id;
	this.element.style.position = "absolute";

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Add element to document
	this.parent.appendChild(this.element);
}

//DropdownList ID counter
DropdownList.id = 0;

//Functions Prototype
DropdownList.prototype.update = update;
DropdownList.prototype.updateInterface = updateInterface;
DropdownList.prototype.destroy = destroy;
DropdownList.prototype.getValue = getValue;
DropdownList.prototype.addValue = addValue;
DropdownList.prototype.setOnChange = setOnChange;
DropdownList.prototype.getSelectedIndex = getSelectedIndex;
DropdownList.prototype.setSelectedIndex = setSelectedIndex;

//Set onchange callback
function setOnChange(callback)
{
	this.element.onchange = callback;
}

//Add element
function addValue(text, value)
{
	var option = document.createElement("option");
	if(value !== undefined)
	{
		option.value = value;
	}
	else
	{
		option.value = text;
	}
	
	option.innerHTML = text;
	this.element.appendChild(option);
}

//Get DropdownList value
function getValue()
{
	return this.element.value;
}

//Get dropdownlist selected index
function getSelectedIndex()
{
	return this.element.selectedIndex;
}

//Set dropdownlist selected index
function setSelectedIndex(index)
{
	this.element.selectedIndex = index;
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