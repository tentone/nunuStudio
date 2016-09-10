"use strict";

function TabButton(parent, tab)
{
	Button.call(this, parent);

	//Tab
	this.tab = tab;
	
	//Button
	this.element.draggable = true;

	//Set button callback
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

	//Mouse leave event (overrided)
	this.element.onmouseleave = function()
	{
		if(!tab.isSelected())
		{
			this.style.backgroundColor = Editor.theme.button_color;
		}
	};

	//Icon
	this.icon = new ImageBox(this.element);
	this.icon.size.set(15, 15);
	this.icon.position.set(7, 7);
	this.icon.setImage(tab.icon);
	this.icon.updateInterface();

	//Name
	this.setName(tab.name);

	//Close button
	this.close_button = new ButtonImage(this.element);
	this.close_button.visible = this.closeable;
	this.close_button.size.set(10, 10);
	this.close_button.position.set(this.size.x - 20, 10);
	this.close_button.setImage("editor/files/icons/misc/close.png");
	this.close_button.setCallback(function()
	{
		tab.close();
	});
	this.close_button.updateInterface();

	this.parent.appendChild(this.element);
}

TabButton.prototype = Object.create(Button.prototype);

//Set button icon
TabButton.prototype.setIcon = function(icon)
{
	this.tab.icon = icon;
	this.icon.setImage(icon);
}

//Set button name
TabButton.prototype.setName = function(text)
{
	if(text !== undefined && text.length > 9)
	{
		text = text.slice(0,9) + "...";
	}

	this.tab.name = text;
	this.setText(text);
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
	Button.prototype.updateInterface.call(this);

	//Icon
	this.icon.visible = this.visible;
	this.icon.updateInterface();

	//Close button
	if(this.tab.closeable)
	{
		this.close_button.visible = this.visible;
		this.close_button.position.set(this.size.x - 20, 10);
		this.close_button.updateInterface();
	}
}
