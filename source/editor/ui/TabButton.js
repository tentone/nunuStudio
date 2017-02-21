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

	//Self pointer
	var self = this;

	//Drag control
	var _mouse = new THREE.Vector2(0, 0);
	var _position = new THREE.Vector2(0, 0);
	var _index = 0;

	this.element.ondragstart = function(event)
	{
		_mouse.set(event.clientX, event.clientY);
		_position.copy(self.position);

		event.dataTransfer.setDragImage(this.cloneNode(false), 0, 0);

		this.style.zIndex = "1000";
	};

	this.element.ondrag = function(event)
	{
		if(self.tab.container.mode === TabGroup.TOP)
		{
			this.style.left = (_position.x + event.clientX - _mouse.x) + "px";
			
			_index = (_position.x + event.clientX - _mouse.x) / self.size.x;

			self.tab.container.draggingTab(self.tab, _index);
		}
	};

	this.element.ondragend = function(event)
	{
		this.style.left = _position.x + "px";
		this.style.top = _position.y + "px";
		this.style.zIndex = "";
	};

	this.element.onmousedown = function(event)
	{
		//Select tab on mouse left click
		if(event.which - 1 === Mouse.LEFT)
		{
			self.tab.container.selectTab(self.tab);
		}
		//Close tab on mouse middle click
		else if(tab.closeable && event.which - 1 === Mouse.MIDDLE)
		{
			self.tab.container.removeTab(self.tab);
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
	this.icon.draggable = false;
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
	this.text.style.top = "25%";
	this.text.innerHTML = tab.title;
	this.element.appendChild(this.text);

	//Close button
	this.close = document.createElement("img");
	this.close.draggable = false;
	this.close.style.position = "absolute";
	this.close.style.opacity = 0.5;
	this.close.style.display = (tab.closeable) ? "block" : "none";
	this.close.src = "editor/files/icons/misc/close.png";
	this.element.appendChild(this.close);
	
	this.close.onmouseenter = function()
	{
		this.style.opacity = 1.0;
	};

	this.close.onmouseleave = function()
	{
		this.style.opacity = 0.5;
	};

	this.close.onclick = function()
	{
		self.tab.close();
	};

	//Attributes
	this.size = new THREE.Vector2(0, 0);
	this.position = new THREE.Vector2(0, 0);
	this.visible = true;

	//Tab
	this.tab = tab;

	//Add to parent
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
	//Visiblity
	if(this.visible)
	{
		this.element.style.display = "block";
	}
	else
	{
		this.element.style.display = "none";
	}

	//Button
	if(this.tab.isSelected())
	{
		this.element.style.backgroundColor = Editor.theme.buttonOverColor;
	}
	else
	{
		this.element.style.backgroundColor = Editor.theme.buttonColor;
	}

	//Icon
	this.icon.style.top = (this.size.y * 0.2) + "px";
	this.icon.style.left = (this.size.y * 0.2) + "px"
	this.icon.style.width = (this.size.y * 0.6) + "px";
	this.icon.style.height = (this.size.y * 0.6) + "px";

	//Text
	this.text.style.left = this.size.y + "px";
	this.text.style.width = (this.size.x - 2 * this.size.y) + "px";
	this.text.style.height = this.size.y + "px";

	//Close
	this.close.style.display = (this.tab.closeable) ? "block" : "none";
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
