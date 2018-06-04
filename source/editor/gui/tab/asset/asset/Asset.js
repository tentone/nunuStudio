"use strict";

function Asset(parent)
{
	Element.call(this, parent);

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
		if(!Editor.isObjectSelected(self.asset))
		{
			this.style.backgroundColor = "";
		}
	};

	this.element.onclick = function(event)
	{
		if(event.ctrlKey)
		{
			if(Editor.isObjectSelected(self.asset))
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

//Update background based on selection state
Asset.prototype.updateSelection = function()
{
	this.element.style.backgroundColor = Editor.isObjectSelected(this.asset) ? Editor.theme.buttonOverColor : "";
};

//Set parent
Asset.prototype.setParent = function(parent)
{
	if(parent !== this.parent)
	{
		this.parent = parent;
		this.parent.appendChild(this.element);
	}
};

Asset.prototype.setSize = function(size)
{
	this.element.style.width = size + "px";
	this.element.style.height = size + "px";
};

//Set file icon
Asset.prototype.setIcon = function(icon)
{
	this.icon.src = icon;
};

//Set file label
Asset.prototype.setText = function(text)
{
	this.name.data = text;
};

//Update metadata
Asset.prototype.updateMetadata = function()
{
	this.setText(this.asset.name);
};

//Update Interface
Asset.prototype.updateInterface = function(){};
