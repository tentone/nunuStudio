"use strict";

function ConsoleTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Console", Editor.filePath + "icons/misc/console.png");

	this.console = document.createElement("div");
	this.console.style.overflow = "auto";
	this.console.style.top = "0px";
	this.console.style.left = "0px";
	this.console.style.width = "100%";
	this.element.appendChild(this.console);

	this.code = document.createElement("input");
	this.code.type = "text";
	this.code.style.position = "absolute";
	this.code.style.margin = "0";
	this.code.style.boxSizing = "border-box";
	this.code.style.textIndent = "4px";
	this.code.style.color = "#FFFFFF";
	this.code.style.borderStyle = "solid";
	this.code.style.borderRightStyle = "none";
	this.code.style.borderLeftStyle = "none";
	this.code.style.borderBottomStyle = "none";
	this.code.style.borderWidth = "2px";
	this.code.style.borderColor = Editor.theme.barColor;
	this.code.style.backgroundColor = Editor.theme.panelColor;
	this.code.style.bottom = "0px";
	this.code.style.left = "0px";
	this.code.style.width = "100%";
	this.code.style.height = "25px";
	this.element.appendChild(this.code);

	var self = this;

	this.code.onkeydown = function(event)
	{
		if(event.keyCode === 13)
		{
			try
			{
				console.log(eval.call(window, this.value));
			}
			catch(e)
			{
				console.error(e);
			}

			this.value = "";
		}
	};
}

ConsoleTab.prototype = Object.create(TabElement.prototype);

//Normal log messsage
ConsoleTab.prototype.log = function(args)
{
	for(var i = 0; i < args.length; i++)
	{
		var log = document.createElement("p");
		log.innerHTML = args[i];

		this.console.appendChild(log);
	}

	this.console.scrollTop = Number.MAX_SAFE_INTEGER;
};

//Warning message
ConsoleTab.prototype.warn = function(args)
{
	for(var i = 0; i < args.length; i++)
	{
		var log = document.createElement("p");
		log.style.color = "#FFFF00";
		log.innerHTML = args[i];

		this.console.appendChild(log);
	}

	this.console.scrollTop = Number.MAX_SAFE_INTEGER;
};

//Error message
ConsoleTab.prototype.error = function(args)
{
	for(var i = 0; i < args.length; i++)
	{
		var log = document.createElement("p");
		log.style.color = "#FF0000";
		log.innerHTML = args[i];

		this.console.appendChild(log);
	}

	this.console.scrollTop = Number.MAX_SAFE_INTEGER;
};

//Update interface
ConsoleTab.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";

		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";

		this.console.style.height = (this.size.y - 25) + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};
