"use strict";

function TabButton(parent, tab)
{
	if(parent === undefined)
	{
		this.parent = document.body;
	}
	else
	{
		this.parent = parent;
	}

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.cursor = "pointer";
	this.element.style.backgroundColor = Editor.theme.button_color;
	this.element.draggable = true;

	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};

	this.element.onclick = function(event)
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
		this.style.backgroundColor = Editor.theme.button_over_color;
	};

	//Mouse leave event
	this.element.onmouseleave = function()
	{
		if(!tab.isSelected())
		{
			this.style.backgroundColor = Editor.theme.button_color;
		}
	};

	//Icon
	this.icon = document.createElement("img");
	this.icon.style.position = "absolute";
	this.icon.style.top = "7px";
	this.icon.style.left = "7px";
	this.icon.style.width = "15px";
	this.icon.style.height = "15px";
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
	this.text.style.top = "8px";
	this.text.style.left = "25px";
	this.text.style.color = Editor.theme.text_color;
	this.text.innerHTML = tab.name;
	this.element.appendChild(this.text);

	//Close button
	this.close_button = new ButtonImage(this.element);
	this.close_button.visible = this.closeable;
	this.close_button.size.set(10, 10);
	this.close_button.position.set(130, 10);
	this.close_button.setImage("editor/files/icons/misc/close.png");
	this.close_button.setCallback(function()
	{
		tab.close();
	});
	this.close_button.updateInterface();

	//Element atributes
	this.size = new THREE.Vector2(150, 30);
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
	this.tab.name = text;
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
		this.element.style.backgroundColor = Editor.theme.button_over_color;
	}
	else
	{
		this.element.style.backgroundColor = Editor.theme.button_color;
	}

	//Visibility
	if(this.visible)
	{
		this.icon.style.visibility = "visible";
		this.text.style.visibility = "visible";
		this.element.style.visibility = "visible";
	}
	else
	{
		this.icon.style.visibility = "hidden";
		this.text.style.visibility = "hidden";
		this.element.style.visibility = "hidden";
	}

	//Text
	this.text.style.width = (this.size.x - 50) + "px";
	this.text.style.height = this.size.y + "px";

	//Element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";

	//Close button
	if(this.tab.closeable)
	{
		this.close_button.visible = this.visible;
		this.close_button.position.set(this.size.x - 20, 10);
		this.close_button.updateInterface();
	}
}
