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
	this.element.className = "panel";

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

//Add new row to form
function nextRow()
{
	this.rows.push([]);
}

//Create text element and add to form
function addText(text)
{
	var elem = new Text(this.element);
	elem.setAlignment(Text.LEFT);
	elem.fit_content = true;
	elem.setText(text);
	elem.size.set(0, 20);
	elem.updateInterface();

	this.add(elem);

	return elem;
}

//Add a element to form (in actual row)
function add(elem)
{
	if(this.rows.length > 0)
	{
		this.rows[this.rows.length - 1].push(elem);

		elem.parent = this.element;
		this.element.appendChild(elem.element);
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
	var position = new THREE.Vector2(this.spacing.x, this.spacing.y);
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

		//Update position tracker
		position.x = this.spacing.x;
		position.y += max_size_y + this.spacing.y;
	}

	//Update element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
