"use strict";

function TabButton(parent, tab)
{
	Element.call(this, parent);

	this.element.draggable = true;
	this.element.style.cursor = "pointer";
	this.element.style.boxSizing = "border-box";
	this.element.style.backgroundColor = Editor.theme.buttonColor;

	//Icon
	this.icon = document.createElement("img");
	this.icon.style.pointerEvents = "none";
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
	this.close.src = Editor.filePath + "icons/misc/close.png";
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

	//Tab
	this.tab = tab;

	//Self pointer
	var self = this;

	//Drag state
	var dragState = 0;

	//Drag control
	this.element.ondragstart = function(event)
	{
		event.dataTransfer.setData("tab", self.tab.index);
		dragState = 0;
	};

	//Drag drop
	this.element.ondrop = function(event)
	{
		event.preventDefault();
		this.style.borderLeft = "";
		this.style.borderRight = "";

		var index = event.dataTransfer.getData("tab");
		if(index !== "")
		{
			index = parseInt(index);

			if(index !== self.tab.index)
			{	
				//Before
				if(dragState === 1)
				{
					if(index < self.tab.index)
					{
						self.tab.container.moveButton(index, self.tab.index - 1);
					}
					else
					{
						self.tab.container.moveButton(index, self.tab.index);
					}
				}
				//After
				else if(dragState === 2)
				{
					if(index < self.tab.index)
					{
						self.tab.container.moveButton(index, self.tab.index);
					}
					else
					{
						self.tab.container.moveButton(index, self.tab.index + 1);
					}
					self.tab.container.moveButton(index, self.tab.index);
				}
			}
		}
	};

	//Drag over
	this.element.ondragover = function(event)
	{
		if(event.layerX > self.size.x * 0.8 || event.target !== this)
		{
			if(dragState !== 2)
			{
				dragState = 2;
				this.style.borderLeft = "";
				this.style.borderRight = "thick solid #999999";
			}
		}
		else if(event.layerX < self.size.x * 0.2)
		{
			if(dragState !== 1)
			{
				dragState = 1;
				this.style.borderRight = "";
				this.style.borderLeft = "thick solid #999999";
			}
		}
		else
		{
			if(dragState !== 0)
			{
				dragState = 0;
				this.style.borderLeft = "";
				this.style.borderRight = "";
			}
		}
	}

	//Drag leave
	this.element.ondragleave = function(event)
	{
		event.preventDefault();
		
		dragState = 0;
		this.style.borderLeft = "";
		this.style.borderRight = "";
	}

	//Drag end
	this.element.ondragend = function(event)
	{
		event.preventDefault();

		dragState = 0;
		this.style.borderLeft = "";
		this.style.borderRight = "";
	}

	//Mouse click
	this.element.onclick = function(event)
	{
		self.tab.container.selectTab(self.tab);
	};

	//Mouse down
	this.element.onmousedown = function(event)
	{
		//Close tab on mouse middle click
		if(tab.closeable && event.which - 1 === Mouse.MIDDLE)
		{
			self.tab.container.removeTab(self.tab);
		}
	};

	//Mouse enter
	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	//Mouse leave
	this.element.onmouseleave = function()
	{
		if(!tab.isSelected())
		{
			this.style.backgroundColor = Editor.theme.buttonColor;
		}
	};
}

TabButton.prototype = Object.create(Element.prototype);

//Set button icon
TabButton.prototype.setIcon = function(icon)
{
	this.tab.icon = icon;
	this.icon.src = icon;
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
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}
}

//Update Interface
TabButton.prototype.updateInterface = function()
{
	//Visiblity
	if(this.visible)
	{
		this.element.style.display = "block";

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
	else
	{
		this.element.style.display = "none";
	}
}
