"use strict";

function Form(parent)
{
	Element.call(this, parent);

	this.element.style.overflow = "visible";
	
	//Child elements
	this.spacing = new THREE.Vector2(5, 5);
	this.rows = [];
	this.rows.push([]);

	//Defaults
	this.defaultTextWidth = 80;
}

Form.prototype = Object.create(Element.prototype);

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
};

//Create text element
Form.prototype.addText = function(text, fit)
{
	var element = new Text(this.element);
	element.setAlignment(Text.LEFT);
	element.setText(text);
	element.fitContent = (fit === true);
	element.size.set(this.defaultTextWidth, 20);
	this.add(element);

	return element;
};

//Create division
Form.prototype.addDivision = function(x, y)
{
	var division = new Division(this.element);
	division.size.set(x, y);
	this.add(division);

	return division;
};

//Add new row to form
Form.prototype.nextRow = function()
{
	this.rows.push([]);
};

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
};

//Clear all elements from form
Form.prototype.removeAll = function()
{
	for(var i = 0; i < this.rows.length; i++)
	{
		for(var j = 0; j < this.rows[i].length; j++)
		{
			this.rows[i][j].destroy();
		}
	}

	this.rows = [];
	this.rows.push([]);
};

//Update interface
Form.prototype.updateInterface = function()
{
	//Visiblity
	if(this.visible)
	{
		//Position tracker and size
		var x = 0, y = 0;
		var size = this.size.set(0, 0);

		//Updated attached elements
		for(var i = 0; i < this.rows.length; i++)
		{
			var maxSizeY = 0;
			for(var j = 0; j < this.rows[i].length; j++)
			{
				var element = this.rows[i][j];
				
				if(element.visible)
				{
					//Update element
					element.position.set(x, y);
					element.visible = this.visible;
					element.updateInterface();
					
					//Restore visibility
					element.visible = true;

					//Update position tracker
					if(element.size.y > maxSizeY)
					{
						maxSizeY = element.size.y;
					}
					x += element.size.x + this.spacing.x;
				}
			}

			//Update form size x
			if(size.x < x)
			{
				size.x = x;
			}

			//Update position tracker
			if(x !== 0)
			{
				x = 0;
				y += maxSizeY + this.spacing.y;
			}
		}

		//Set size y
		size.y = y;

		//Element
		this.element.style.display = "block";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.height = this.size.y + "px";
		this.element.style.width = this.size.x + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};
