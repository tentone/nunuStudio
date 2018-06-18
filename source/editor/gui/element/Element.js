"use strict";

/**
 * Element is the base object for all GUI elements.
 * 
 * All GUI elements are based on the Element class, components can be inserted into other componens or into DOM elements.
 * 
 * @class Element
 * @param {DOM} parent Parent element.
 * @param {String} type Type of the based DOM element.
 */
function Element(parent, type)
{
	/** 
	 * The parent DOM element that contains this Element.
	 *
	 * @attribute parent
	 * @type {DOM}
	 */
	this.parent = (parent !== undefined) ? parent : document.body;

	/** 
	 * Base DOM element for this component.
	 *
	 * Different components may use diferent base element types.
	 * 
	 * @attribute element
	 * @type {DOM}
	 */
	this.element = document.createElement((type !== undefined) ? type : "div");
	this.element.style.position = "absolute";
	this.element.style.overflow = "hidden";
	this.parent.appendChild(this.element);
	
	/** 
	 * True if the element is visible.
	 *
	 * @attribute visible
	 * @type {Boolean}
	 */
	this.visible = true;
	
	/**
	 * Size of this component in px.
	 *
	 * @attribute size
	 * @type {THREE.Vector2}
	 */
	this.size = new THREE.Vector2(0, 0);
	
	/**
	 * Position of this component relatively to its parent in px.
	 *
	 * @attribute position
	 * @type {THREE.Vector2}
	 */
	this.position = new THREE.Vector2(0, 0);

	/**
	 * Positioning mode, indicates how to anchor the component.
	 *
	 * @attribute mode
	 * @type {Number}
	 */
	this._mode = Element.TOP_LEFT;
}

Element.prototype.constructor = Element;

/**
 * Top-left positioning.
 *
 * @static
 * @attribute TOP_LEFT
 * @type {Number}
 */
Element.TOP_LEFT = 0;

/**
 * Top-right positioning.
 *
 * @static
 * @attribute TOP_RIGHT
 * @type {Number}
 */
Element.TOP_RIGHT = 1;

/**
 * Bottom-left positioning.
 *
 * @static
 * @attribute BOTTOM_LEFT
 * @type {Number}
 */
Element.BOTTOM_LEFT = 2;

/**
 * Bottom-right positioning.
 *
 * @static
 * @attribute BOTTOM_RIGHT
 * @type {Number}
 */
Element.BOTTOM_RIGHT = 3;


Element.preventDefault = function(event)
{
	event.preventDefault();
};

/** 
 * Add a CSS class to the base DOM element of this Element.
 * 
 * @method addClass
 * @param {String} name Name of the class to be added.
 */
Element.prototype.addClass = function(name)
{
	this.element.classList.add(name);
};

/** 
 * Remove a CSS class from the base DOM element of this Element.
 * 
 * @method removeClass
 * @param {String} name Name of the class to be removed.
 */
Element.prototype.removeClass = function(name)
{
	if(this.element.classList.contains(name))
	{
		this.element.classList.remove(name);
	}
};

/** 
 * Add and drag and drop default event prevention to this component.
 *
 * Usefull to avoid unwanted actions on draggable components. 
 *
 * @method preventDragEvents
 */
Element.prototype.preventDragEvents = function()
{
	this.element.ondrop = Element.preventDefault;
	this.element.ondragover = Element.preventDefault;
};

/**
 * Set alt text, that is displayed when the mouse is over the element. Returns the element created that is attached to the document body.
 *
 * @method setAltText
 * @param {String} altText Alt text.
 */
Element.prototype.setAltText = function(altText)
{
	var element = document.createElement("div");
	element.style.position = "absolute";
	element.style.display = "none";
	element.style.alignItems = "center";
	element.style.zIndex = "10000";
	element.style.border = "3px solid";
	element.style.borderRadius = "5px";
	element.style.color = Editor.theme.textColor;
	element.style.backgroundColor = Editor.theme.barColor;
	element.style.borderColor = Editor.theme.barColor;
	element.style.width = "fit-content";
	element.style.height = "fit-content";
	document.body.appendChild(element);

	//Text
	var text = document.createTextNode(altText);
	element.appendChild(text);

	//Destroy
	var destroyFunction = this.destroy;
	this.destroy = function()
	{	
		destroyFunction.call(this);

		if(document.body.contains(element))
		{
			document.body.removeChild(element);
		}
	};
	
	this.element.style.pointerEvents = "auto"; 

	//Mouse mouse move event
	this.element.onmousemove = function(event)
	{
		element.style.display = "flex";
		element.style.left = event.clientX + "px";
		element.style.top = (event.clientY - 30) + "px";
	};

	//Mouse out event
	this.element.onmouseout = function()
	{
		element.style.display = "none";
	};

	return element;
};

/**
 * Attach this component to a new parent component.
 * 
 * Destroys the object and reataches the base DOM element to the new parent element.
 * 
 * @method attachTo
 * @param {Container} parent Parent container.
 */
Element.prototype.attachTo = function(parent)
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}

	this.parent = parent;
	this.parent.appendChild(this.element);
	this.updateInterface();
};

/**
 * Called to destroy a component.
 *
 * Destroy the element and removes it from its DOM parent.
 * 
 * @method destroy
 */
Element.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}
};

/**
 * Set positioning mode.
 * 
 * @method setMode
 * @param {Number} setMode
 */
Element.prototype.setMode = function(mode)
{
	this._mode = mode;
	this.element.style.bottom = null;
	this.element.style.top = null;
	this.element.style.right = null;
	this.element.style.left = null;
};

/**
 * Update visibility of this element.
 *
 * @method setVisibility
 */
Element.prototype.setVisibility = function(visible)
{
	this.visible = visible;
	this.updateVisibility();
};


/**
 * Update the visibility of this element.
 *
 * @method updateVisibility
 */
Element.prototype.updateVisibility = function()
{
	this.element.style.display = this.visible ? "block" : "none";
};


/**
 * Update the position of this element.
 * 
 * @method updatePosition
 */
Element.prototype.updatePosition = function(mode)
{
	if(mode !== undefined)
	{
		this._mode = mode;
	}

	if(this._mode === Element.TOP_LEFT || this._mode === Element.TOP_RIGHT)
	{
		this.element.style.top = this.position.y + "px";
	}
	else
	{
		this.element.style.bottom = this.position.y + "px";
	}

	if(this._mode === Element.TOP_LEFT || this._mode === Element.BOTTOM_LEFT)
	{
		this.element.style.left = this.position.x + "px";
	}
	else
	{
		this.element.style.right = this.position.x + "px";
	}
};

/**
 * Update the size of this element.
 * 
 * @method updateSize
 */
Element.prototype.updateSize = function()
{
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
};

/**
 * Update component appearance.
 * 
 * Should be called after changing size or position.
 *
 * Uses the updateVisibility and if the element is visible calls the updateSize and updatePosition (in this order) methods to update the interface.
 * 
 * @method update
 */
Element.prototype.updateInterface = function()
{
	this.updateVisibility();

	if(this.visible)
	{
		this.updateSize();
		this.updatePosition();
	}
};
