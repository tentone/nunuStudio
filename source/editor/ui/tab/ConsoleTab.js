"use strict";

function ConsoleTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Console", Editor.filePath + "icons/misc/console.png");

	this.history = [];

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
		if(event.keyCode === Keyboard.ENTER)
		{
			try
			{
				console.log(eval.call(window, this.value));
			}
			catch(e)
			{
				console.error(e);
			}

			self.history.push(this.value);
			this.value = "";
		}
		else if(event.keyCode === Keyboard.UP)
		{
			if(self.history.length > 0)
			{
				this.value = self.history.pop();
			}
		}
	};
}

ConsoleTab.prototype = Object.create(TabElement.prototype);


ConsoleTab.createNessage = function(object)
{
	var log = document.createElement("div");
	//log.style.borderBottomStyle = "solid";
	//log.style.borderWidth = "1px";
	//log.style.borderColor = "#222222";
	log.style.width = "100%";
	log.style.color = "#FFFFFF";

	if(object instanceof Image)
	{
		var image = args[i];

		var img = document.createElement("img");
		img.src = image.data;
		img.height = 70;
		log.appendChild(img);

		var table = document.createElement("table");
		table.style.display = "inline-block";

		var name = table.insertRow(0);
		name.insertCell(0).innerHTML = "Name";
		name.insertCell(1).innerHTML = image.name;

		var uuid = table.insertRow(1);
		uuid.insertCell(0).innerHTML = "UUID";
		uuid.insertCell(1).innerHTML = image.uuid;

		var format = table.insertRow(2);
		format.insertCell(0).innerHTML = "Format";
		format.insertCell(1).innerHTML = image.format;

		var encoding = table.insertRow(3);
		encoding.insertCell(0).innerHTML = "Encoding";
		encoding.insertCell(1).innerHTML = image.encoding;
		log.appendChild(table);
	}
	else
	{
		log.innerHTML = args[i];
	}

	return log;
};

//Normal log messsage
ConsoleTab.prototype.log = function(args)
{
	for(var i = 0; i < args.length; i++)
	{
		this.console.appendChild(ConsoleTab.createNessage(args[i]));
	}

	this.console.scrollTop = Number.MAX_SAFE_INTEGER;
};

//Warning message
ConsoleTab.prototype.warn = function(args)
{
	for(var i = 0; i < args.length; i++)
	{
		var log = ConsoleTab.createNessage(args[i]);
		log.style.color = "#FFFF00";
		this.console.appendChild(log);
	}

	this.console.scrollTop = Number.MAX_SAFE_INTEGER;
};

//Error message
ConsoleTab.prototype.error = function(args)
{
	for(var i = 0; i < args.length; i++)
	{
		var log = ConsoleTab.createNessage(args[i]);
		log.style.color = "#FF0000";
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

