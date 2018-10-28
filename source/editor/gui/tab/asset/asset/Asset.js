"use strict";

/**
 * Asset represents an resource in the asset explorer.
 *
 * There are multiple types of assets this class should be used as base for other types.
 *
 * @class Asset
 * @param {Element} parent
 * @extends {Element}
 */
function Asset(parent)
{
	Element.call(this, parent, "div");

	this.asset = null;

	this.scale = new THREE.Vector2(0.7, 0.7);

	//Element
	this.element.style.display = "block";
	this.element.style.float = "left";
	this.element.style.position = "relative";
	this.element.style.cursor = "pointer";
	this.element.style.width = "70px";
	this.element.style.height = "70px";

	//Icon
	this.icon = document.createElement("img");
	this.icon.draggable = false;
	this.icon.style.display = "block";
	this.icon.style.position = "absolute";
	this.icon.style.bottom = "20px";
	this.icon.style.right = "5px";
	this.icon.style.width = "30%";
	this.icon.style.height = "30%";
	this.icon.style.pointerEvents = "none";
	this.icon.style.opacity = "0.5";
	this.icon.style.zIndex = "1";
	this.element.appendChild(this.icon);

	//Text
	this.text = document.createElement("div");
	this.text.style.position = "absolute";
	this.text.style.overflow = "hidden";
	this.text.style.textAlign = "center";
	this.text.style.pointerEvents = "none";
	this.text.style.textOverflow = "ellipsis";
	this.text.style.whiteSpace = "nowrap";
	this.text.style.color = Editor.theme.textColor;
	this.text.style.height = "20px";
	this.text.style.width = "100%";
	this.text.style.bottom = "0px";
	this.element.appendChild(this.text);

	//Text
	this.name = document.createTextNode("");
	this.text.appendChild(this.name);

	var self = this;

	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	this.element.onmouseleave = function()
	{
		if(!Editor.isSelected(self.asset))
		{
			this.style.backgroundColor = null;
		}
	};

	this.element.onclick = function(event)
	{
		if(event.ctrlKey)
		{
			if(Editor.isSelected(self.asset))
			{
				Editor.removeFromSelection(self.asset);
			}
			else
			{
				Editor.addToSelection(self.asset);
			}
		}
		else
		{
			Editor.selectObject(self.asset);
		}
	};
}

Asset.prototype = Object.create(Element.prototype);

/**
 * Update selection state and the matching visual elements.
 *
 * @method setSelected
 * @param {Boolean} selected If true set selected, otherwise se unselected.
 */
Asset.prototype.setSelected = function(selected)
{
	//this.selected = selected;

	this.element.style.backgroundColor = selected ? Editor.theme.buttonOverColor : null;
};

/**
 * Set the size of the asset.
 *
 * @method setSize
 * @param {Number} size Size in px.
 */
Asset.prototype.setSize = function(size)
{
	this.element.style.width = size + "px";
	this.element.style.height = size + "px";
};

/**
 * Set icon to use in the asset.
 *
 * @method setIcon
 * @param {String} icon Image URL.
 */
Asset.prototype.setIcon = function(icon)
{
	this.icon.src = icon;
};

/**
 * Set asset label.
 *
 * @method setText
 * @param {String} text Asset label.
 */
Asset.prototype.setText = function(text)
{
	this.name.data = text;
};

Asset.prototype.updateMetadata = function()
{
	this.setText(this.asset.name);
};

Asset.prototype.updateInterface = function(){};
