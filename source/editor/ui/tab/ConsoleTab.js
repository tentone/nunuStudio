"use strict";

function ConsoleTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Console", Editor.filePath + "icons/misc/console.png");

	this.history = [];

	//Filters
	this.filterThreeJS = false;

	//Top bar
	this.bar = document.createElement("div");
	this.bar.style.top = "0px";
	this.bar.style.left = "0px";
	this.bar.style.width = "100%";
	this.bar.style.height = "20px";
	this.bar.style.backgroundColor = Editor.theme.barColor;
	this.element.appendChild(this.bar);

	var menu = new ButtonMenu(this.bar);
	menu.setText("Clear");
	menu.size.set(100, 20);
	menu.position.set(0, 0);
	menu.setCallback(function()
	{
		console.clear();
	});
	menu.updateInterface();

	//Console messages division
	this.console = document.createElement("div");
	this.console.style.overflow = "auto";
	this.console.style.top = "20px";
	this.console.style.left = "0px";
	this.console.style.width = "100%";
	this.element.appendChild(this.console);

	//Command input division
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
				var result = eval.call(window, this.value);
				console.log(" >> " + this.value);
				console.log(result);
			}
			catch(e)
			{
				console.error(" >> " + this.value);
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

	this.useConsole();
}

ConsoleTab.prototype = Object.create(TabElement.prototype);

//Use this console as the predefined console
ConsoleTab.prototype.useConsole = function()
{
	var self = this;

	var log = window.console.log;
	window.console.log = function()
	{
		self.log(arguments);
		log.apply(null, arguments);
	};

	var warn = window.console.warn;
	window.console.warn = function()
	{
		self.warn(arguments);
		warn.apply(null, arguments);
	};

	var error = window.console.error;
	window.console.error = function()
	{
		self.error(arguments);
		error.apply(null, arguments);
	};

	var clear = window.console.clear;
	window.console.clear = function()
	{
		self.clear(arguments);
		clear.apply(null, arguments);
	};
};

//Normal log messsage
ConsoleTab.prototype.log = function(args)
{
	if(this.filter(args))
	{
		return;
	}

	for(var i = 0; i < args.length; i++)
	{
		this.console.appendChild(ConsoleTab.createMessage(args[i]));
	}

	this.console.appendChild(ConsoleTab.createBar());
	this.console.scrollTop = Number.MAX_SAFE_INTEGER;
};

//Warning message
ConsoleTab.prototype.warn = function(args)
{
	if(this.filter(args))
	{
		return;
	}

	for(var i = 0; i < args.length; i++)
	{
		var log = ConsoleTab.createMessage(args[i]);
		log.style.color = "#FFFF00";
		this.console.appendChild(log);
	}

	this.console.appendChild(ConsoleTab.createBar());
	this.console.scrollTop = Number.MAX_SAFE_INTEGER;
};

//Error message
ConsoleTab.prototype.error = function(args)
{
	if(this.filter(args))
	{
		return;
	}

	for(var i = 0; i < args.length; i++)
	{
		var log = ConsoleTab.createMessage(args[i]);
		log.style.color = "#FF0000";
		this.console.appendChild(log);
	}

	this.console.appendChild(ConsoleTab.createBar());
	this.console.scrollTop = Number.MAX_SAFE_INTEGER;
};

//Clear commands
ConsoleTab.prototype.clear = function(args)
{
	this.history = [];

	while(this.console.hasChildNodes())
	{
    	this.console.removeChild(this.console.lastChild);
	}

	this.console.scrollTop = Number.MAX_SAFE_INTEGER;
};

//Apply filters to messages
ConsoleTab.prototype.filter = function(args)
{
	if(this.filterThreeJS)
	{
		if(args.length > 0 && (args[0] + "").startsWith("THREE"))
		{
			return true;
		}
	}

	return false;
};

//Update interface
ConsoleTab.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.display = "block";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";

		this.console.style.height = (this.size.y - 45) + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};

//Create a new log division element and fill with information from the object
ConsoleTab.createMessage = function(object)
{
	var log = document.createElement("div");
	log.style.width = "100%";
	log.style.color = "#FFFFFF";

	if(object instanceof Image)
	{
		var preview = document.createElement("img");
		preview.src = object.data;
		preview.height = 60;
		log.appendChild(preview);

		var table = document.createElement("table");
		table.style.display = "inline-block";

		var type = table.insertRow(0);
		type.insertCell(0).appendChild(document.createTextNode("Image"));

		var name = table.insertRow(1);
		name.insertCell(0).appendChild(document.createTextNode("Name"));
		name.insertCell(1).appendChild(document.createTextNode(object.name));

		var uuid = table.insertRow(2);
		uuid.insertCell(0).appendChild(document.createTextNode("UUID"));
		uuid.insertCell(1).appendChild(document.createTextNode(object.uuid));

		var format = table.insertRow(3);
		format.insertCell(0).appendChild(document.createTextNode("Format"));
		format.insertCell(1).appendChild(document.createTextNode(object.format));

		var encoding = table.insertRow(4);
		encoding.insertCell(0).appendChild(document.createTextNode("Encoding"));
		encoding.insertCell(1).appendChild(document.createTextNode(object.encoding));

		log.appendChild(table);
	}
	/*else if(object instanceof THREE.Texture)
	{
		var preview = TextureRenderer.generateElement(object);
		preview.height = 60;
		log.appendChild(preview);

		var table = document.createElement("table");
		table.style.display = "inline-block";

		var type = table.insertRow(0);
		type.insertCell(0).appendChild(document.createTextNode("Type";
		type.insertCell(1).appendChild(document.createTextNode(object.type;

		var name = table.insertRow(1);
		name.insertCell(0).appendChild(document.createTextNode("Name";
		name.insertCell(1).appendChild(document.createTextNode(object.name;

		var uuid = table.insertRow(2);
		uuid.insertCell(0).appendChild(document.createTextNode("UUID";
		uuid.insertCell(1).appendChild(document.createTextNode(object.uuid;

		log.appendChild(table);
	}*/
	else if(object instanceof THREE.Material)
	{
		var preview = MaterialRenderer.generateElement(object);
		preview.height = 60;
		log.appendChild(preview);

		var table = document.createElement("table");
		table.style.display = "inline-block";

		var type = table.insertRow(0);
		type.insertCell(0).appendChild(document.createTextNode("Type"));
		type.insertCell(1).appendChild(document.createTextNode(object.type));

		var name = table.insertRow(1);
		name.insertCell(0).appendChild(document.createTextNode("Name"));
		name.insertCell(1).appendChild(document.createTextNode(object.name));

		var uuid = table.insertRow(2);
		uuid.insertCell(0).appendChild(document.createTextNode("UUID"));
		uuid.insertCell(1).appendChild(document.createTextNode(object.uuid));

		log.appendChild(table);
	}
	else if(object instanceof THREE.Vector2)
	{
		var table = document.createElement("table");
		table.style.display = "inline-block";

		var coord = table.insertRow(0);
		coord.insertCell(0).appendChild(document.createTextNode("X"));
		coord.insertCell(1).appendChild(document.createTextNode("Y"));

		var value = table.insertRow(1);
		value.insertCell(0).appendChild(document.createTextNode(object.x));
		value.insertCell(1).appendChild(document.createTextNode(object.y));

		log.appendChild(table);
	}
	else if(object instanceof THREE.Vector3)
	{
		var table = document.createElement("table");
		table.style.display = "inline-block";

		var coord = table.insertRow(0);
		coord.insertCell(0).appendChild(document.createTextNode("X"));
		coord.insertCell(1).appendChild(document.createTextNode("Y"));
		coord.insertCell(2).appendChild(document.createTextNode("Z"));

		var value = table.insertRow(1);
		value.insertCell(0).appendChild(document.createTextNode(object.x));
		value.insertCell(1).appendChild(document.createTextNode(object.y));
		value.insertCell(2).appendChild(document.createTextNode(object.z));

		log.appendChild(table);
	}
	else if(object instanceof THREE.Vector4 || object instanceof THREE.Quaternion)
	{
		var table = document.createElement("table");
		table.style.display = "inline-block";

		var coord = table.insertRow(0);
		coord.insertCell(0).appendChild(document.createTextNode("X"));
		coord.insertCell(1).appendChild(document.createTextNode("Y"));
		coord.insertCell(2).appendChild(document.createTextNode("Z"));
		coord.insertCell(3).appendChild(document.createTextNode("W"));

		var value = table.insertRow(1);
		value.insertCell(0).appendChild(document.createTextNode(object.x));
		value.insertCell(1).appendChild(document.createTextNode(object.y));
		value.insertCell(2).appendChild(document.createTextNode(object.z));
		value.insertCell(3).appendChild(document.createTextNode(object.w));

		log.appendChild(table);
	}
	else if(object instanceof THREE.Matrix4)
	{
		var table = document.createElement("table");
		table.style.display = "inline-block";

		for(var i = 0, j = 0; i < 16; i += 4, j++)
		{
			var row = table.insertRow(j);
			row.insertCell(0).appendChild(document.createTextNode(object.elements[i]));
			row.insertCell(1).appendChild(document.createTextNode(object.elements[i + 1]));
			row.insertCell(2).appendChild(document.createTextNode(object.elements[i + 2]));
			row.insertCell(3).appendChild(document.createTextNode(object.elements[i + 3]));
		}

		log.appendChild(table);
	}
	else if(object instanceof THREE.Matrix3)
	{
		var table = document.createElement("table");
		table.style.display = "inline-block";

		for(var i = 0, j = 0; i < 9; i += 3, j++)
		{
			var row = table.insertRow(j);
			row.insertCell(0).appendChild(document.createTextNode(object.elements[i]));
			row.insertCell(1).appendChild(document.createTextNode(object.elements[i + 1]));
			row.insertCell(2).appendChild(document.createTextNode(object.elements[i + 2]));
		}

		log.appendChild(table);
	}
	else if(object === null)
	{
		log.appendChild(document.createTextNode("null"));
	}
	else
	{
		log.appendChild(document.createTextNode(object));
	}

	return log;
};

ConsoleTab.createBar = function()
{
	var bar = document.createElement("div");
	bar.style.width = "100%";
	bar.style.height = "1px";
	bar.style.marginTop = "4px";
	bar.style.marginBottom = "4px";
	bar.style.backgroundColor = Editor.theme.barColor;
	return bar;
};
