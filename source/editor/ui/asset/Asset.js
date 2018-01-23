"use strict";

function Asset(parent)
{
	Element.call(this, parent);

	this.asset = null;

	this.element.style.cursor = "pointer";

	//Icon
	this.icon = document.createElement("img");
	this.icon.draggable = false;
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
	this.text.style.visibility = "inherit";
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

	//Icon scale
	this.scale = new THREE.Vector2(0.65, 0.65);

	//Mouse enter
	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	//Mouse leave
	this.element.onmouseleave = function()
	{
		this.style.backgroundColor = "";
	};
}

Asset.prototype = Object.create(Element.prototype);

//Set parent
Asset.prototype.setParent = function(parent)
{
	if(parent !== this.parent)
	{
		this.parent = parent;
		this.parent.appendChild(this.element);
	}
};

//Set file icon
Asset.prototype.setIcon = function(icon)
{
	this.icon.src = icon;
};

//Set file label
Asset.prototype.setText = function(text)
{
	this.text.innerHTML = text;
};

//Update Interface
Asset.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
};