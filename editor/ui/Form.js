function Form(parent)
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
	var id = "form" + Form.id;
	Form.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Elements attached
	this.spacing = new THREE.Vector2(10, 10);
	this.rows = [];
	this.rows.push([]);

	//Add element to document
	this.parent.appendChild(this.element);
}

//Form conter
Form.id = 0;

//Functions Prototype
Form.prototype.update = update;
Form.prototype.updateInterface = updateInterface;
Form.prototype.destroy = destroy;
Form.prototype.nextRow = nextRow;
Form.prototype.add = add;
Form.prototype.addText = addText;
Form.prototype.addDivision = addDivision;

//Add new row to form
function nextRow()
{
	this.rows.push([]);
}

//Create div element and add to form
function addDivision(x, y)
{
	var division = new Division(this.element);
	division.size.set(x, y);

	this.add(division);

	return division;
}

//Create text element and add to form
function addText(text)
{
	var element = new Text(this.element);
	element.fit_content = true;
	element.size.set(0, 20);
	element.setAlignment(Text.LEFT);
	element.setText(text);

	this.add(element);

	return element;
}

//Add a element to form (in actual row)
function add(elem)
{
	if(this.rows.length > 0)
	{
		this.rows[this.rows.length - 1].push(elem);

		if(elem.parent !== this.element)
		{
			elem.parent = this.element;
			this.element.appendChild(elem.element);
		}
	}
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

//Update Form
function update(){}

//Update division Size
function updateInterface()
{
	//Set visiblity
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Updated attached elements
	var position = new THREE.Vector2(0, 0);
	var size = new THREE.Vector2(0, 0);
	for(var i = 0; i < this.rows.length; i++)
	{
		var max_size_y = 0;
		for(var j = 0; j < this.rows[i].length; j++)
		{
			//Update elements
			var element = this.rows[i][j];
			element.position.set(position.x, position.y);
			element.visible = this.visible;
			element.updateInterface();

			//Update position tracker
			if(element.size.y > max_size_y)
			{
				max_size_y = element.size.y;
			}
			position.x += element.size.x + this.spacing.x;
		}

		//Update form size X
		if(size.x < position.x)
		{
			size.x = position.x;
		}

		//Update position tracker
		position.x = 0;
		position.y += max_size_y + this.spacing.y;
	}
	size.y = position.y;
	
	//Update form size
	this.size.copy(size);

	//Update element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
