"use strict";

function Form(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Create element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	this.enabled = true;
	
	//Elements attached
	this.spacing = new THREE.Vector2(10, 10);
	this.rows = [];
	this.rows.push([]);

	//Default elements
	this.default_text_width = 100;

	//Add element to document
	this.parent.appendChild(this.element);
}

//Add a element to form (in actual row)
Form.prototype.add = function(elem)
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

//Create text element and add to form
Form.prototype.addText = function(text, fit)
{
	var element = new Text(this.element);
	element.setAlignment(Text.LEFT);
	element.setText(text);
	element.fit_content = (fit === true);
	element.size.set(this.default_text_width, 20);
	this.add(element);

	return element;
}

//Create div element and add to form
Form.prototype.addDivision = function(x, y)
{
	var division = new Division(this.element);
	division.size.set(x, y);

	this.add(division);

	return division;
}

//Add new row to form
Form.prototype.nextRow = function()
{
	this.rows.push([]);
}

//Add last row from form
Form.prototype.removeLastRow = function()
{
	if(this.rows.length > 0)
	{
		var row = this.rows.pop();

		for(var i = 0; i < row.length; i++)
		{
			row[i].destroy();
		}
	}
}

//Remove element
Form.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update
Form.prototype.update = function(){}

//Update interface
Form.prototype.updateInterface = function()
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

	//Position and size trackers
	var position = new THREE.Vector2(0, 0);
	var size = this.size.set(0, 0);

	//Updated attached elements
	for(var i = 0; i < this.rows.length; i++)
	{
		var max_size_y = 0;
		for(var j = 0; j < this.rows[i].length; j++)
		{
			var element = this.rows[i][j];
			
			if(element.visible)
			{
				//Update element
				element.position.set(position.x, position.y);
				element.visible = this.visible;
				element.updateInterface();
				
				//Restore visibility
				element.visible = true;

				//Update position tracker
				if(element.size.y > max_size_y)
				{
					max_size_y = element.size.y;
				}
				position.x += element.size.x + this.spacing.x;
			}
		}

		//Update form size x
		if(size.x < position.x)
		{
			size.x = position.x;
		}

		//Update position tracker
		if(position.x !== 0)
		{
			position.x = 0;
			position.y += max_size_y + this.spacing.y;
		}
	}

	//Set size y
	size.y = position.y;

	//Update element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
