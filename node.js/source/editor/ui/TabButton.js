"use strict";

function TabButton(parent, tab)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.cursor = "pointer";
	this.element.style.backgroundColor = Editor.theme.buttonColor;
	this.element.draggable = true;

	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};

	this.element.onmousedown = function(event)
	{
		//Select tab on mouse left click
		if(event.which - 1 === Mouse.LEFT)
		{
			tab.container.selectTab(tab.index);
		}
		//Close tab on mouse middle click
		else if(tab.closeable && event.which - 1 === Mouse.MIDDLE)
		{
			tab.container.removeTab(tab.index);
		}
	};

	//Mouse over and mouse out events
	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	//Mouse leave event
	this.element.onmouseleave = function()
	{
		if(!tab.isSelected())
		{
			this.style.backgroundColor = Editor.theme.buttonColor;
		}
	};

	//Icon
	this.icon = document.createElement("img");
	this.icon.style.position = "absolute";
	this.icon.src = tab.icon;
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
	this.text.innerHTML = tab.title;
	this.element.appendChild(this.text);

	//Close button
	this.close = document.createElement("img");
	this.close.style.position = "absolute";
	this.close.style.opacity = 0.6;
	this.close.style.visibility = tab.closeable ? "visible" : "hidden";
	this.close.src = "editor/files/icons/misc/close.png";
	this.element.appendChild(this.close);
	
	this.close.onmouseenter = function()
	{
		this.style.opacity = 1.0;
	};

	this.close.onmouseleave = function()
	{
		this.style.opacity = 0.6;
	};

	this.close.onclick = function()
	{
		tab.close();
	};

	//Element atributes
	this.size = new THREE.Vector2(150, 50);
	this.position = new THREE.Vector2(0, 0);
	this.visible = true;

	//Tab
	this.tab = tab;

	this.parent.appendChild(this.element);
}

//Set button icon
TabButton.prototype.setIcon = function(icon)
{
	this.tab.icon = icon;
	this.icon.setImage(icon);
}

//Set button name
TabButton.prototype.setName = function(text)
{
	this.tab.title = text;
	this.text.innerHTML = text;
}

//Destroy
TabButton.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update Interface
TabButton.prototype.updateInterface = function()
{
	//Button
	if(this.tab.isSelected())
	{
		this.element.style.backgroundColor = Editor.theme.buttonOverColor;
	}
	else
	{
		this.element.style.backgroundColor = Editor.theme.buttonColor;
	}

	//Visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Icon
	this.icon.style.top = (this.size.y * 0.2) + "px";
	this.icon.style.left = (this.size.y * 0.2) + "px"
	this.icon.style.width = (this.size.y * 0.6) + "px";
	this.icon.style.height = (this.size.y * 0.6) + "px";

	//Text
	this.text.style.top = "25%";
	this.text.style.left = this.size.y + "px";
	this.text.style.width = (this.size.x - 2 * this.size.y) + "px";
	this.text.style.height = this.size.y + "px";

	//Close
	this.close.style.visibility = this.tab.closeable ? "visible" : "hidden";
	this.close.style.width = (this.size.y * 0.4) + "px";
	this.close.style.height = (this.size.y * 0.4) + "px";
	this.close.style.top = (this.size.y * 0.3) + "px";
	this.close.style.right = (this.size.y * 0.3) + "px";

	//Element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
