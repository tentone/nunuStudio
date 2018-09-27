"use strict";

/**
 * Table form element automatically organizes element into a grid like form.
 * 
 * @class TableForm
 * @extends {Element}
 * @param {Element} parent Parent element.
 */
function TableForm(parent)
{
	Element.call(this, parent, "div");

	this.element.style.overflow = "visible";
	
	/**
	 * Set if the form needs to be automatically resized.
	 *
	 * @property autoSize
	 * @type {Boolean}
	 */
	this.autoSize = true;

	/**
	 * Resize the last element of the rows to fit the size of the container.
	 *
	 * @method fitElements
	 * @type {Boolean}
	 */
	this.fitElements = true;

	/**
	 * Spacing between elements and rows.
	 *
	 * @property spacing
	 * @type {THREE.Vector2}
	 */
	this.spacing = new THREE.Vector2(5, 5);

	/**
	 * Default text width.
	 *
	 * @property defaultTextWidth
	 * @type {Number}
	 */
	this.defaultTextWidth = 80;

	/**
	 * Rows of this form table.
	 *
	 * @property rows
	 * @type {Array}
	 */
	this.rows = [];
	this.rows.push([]);
}

TableForm.prototype = Object.create(Element.prototype);

/**
 * Set if the form should be automatically resized, and ajust overflow value.
 *
 * @method setAutoSize
 * @param {Boolean} autoSize
 */
TableForm.prototype.setAutoSize = function(autoSize)
{
	this.autoSize = autoSize;
	this.element.style.overflow = autoSize ? "visible" : "auto";
};

/**
 * Add a element to form (in actual row).
 *
 * @method add
 */
TableForm.prototype.add = function(element)
{
	if(this.rows.length > 0)
	{
		this.rows[this.rows.length - 1].push(element);

		if(element.parent !== this.element)
		{
			element.parent = this.element;
			this.element.appendChild(element.element);
		}
	}
};

/**
 * Create text element.
 *
 * @method addText
 */
TableForm.prototype.addText = function(text, fit)
{
	var element = new Text(this);
	element.setAlignment(Text.LEFT);
	element.setText(text);
	element.size.set(this.defaultTextWidth, 20);
	
	if(fit === true)
	{
		element.fitContent = true;
	}
	else
	{
		element.setOverflow(Text.ELLIPSIS);
	}

	this.add(element);

	return element;
};

/**
 * Create division.
 *
 * @method addDivision
 */
TableForm.prototype.addDivision = function(x, y)
{
	var division = new Division(this);
	division.size.set(x, y);
	this.add(division);

	return division;
};

/**
 * Add new row to form.
 *
 * @method nextRow
 */
TableForm.prototype.nextRow = function()
{
	this.rows.push([]);
};

/**
 * Remove last row from form.
 *
 * @method removeLastRow
 */
TableForm.prototype.removeLastRow = function()
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

/**
 * Clear all elements from form.
 *
 * @method removeAll
 */
TableForm.prototype.removeAll = function()
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

TableForm.prototype.updateSize = function()
{
	var x = 0, y = 0;
	var sizeX = 0;

	if(!this.autoSize)
	{
		x = this.spacing.x;
		y = this.spacing.y;
	}

	for(var i = 0; i < this.rows.length; i++)
	{
		var maxSizeY = 0;

		for(var j = 0; j < this.rows[i].length; j++)
		{
			var element = this.rows[i][j];
			
			if(element.visible)
			{
				//Resize last element
				if(this.fitElements && j === this.rows[i].length - 1)
				{
					element.size.x = this.size.x - x - 15;
				}

				element.position.set(x, y);
				element.updateInterface();

				//Size tracker
				if(element.size.y > maxSizeY)
				{
					maxSizeY = element.size.y;
				}

				x += element.size.x + this.spacing.x;
			}
		}

		//Form size x
		if(sizeX < x)
		{
			sizeX = x;
		}

		//Update position tracker
		if(x !== 0)
		{
			x = this.autoSize ? 0 : this.spacing.x;
			y += maxSizeY + this.spacing.y;
		}
	}

	if(this.autoSize)
	{
		this.size.set(sizeX, y);
	}

	Element.prototype.updateSize.call(this);
};
