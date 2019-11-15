"use strict";

function ConsoleTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Console", Global.FILE_PATH + "icons/misc/console.png");

	this.history = [];

	/**
	 * List of filter keywords. If the log message starts with one of these words it is ommited.
	 *
	 * @attribute filters
	 * @type {Array}
	 */
	this.filters = []; //["THREE"];

	/**
	 * Stores a pointer to the original console functions.
	 *
	 * Used to enable and disable the virtual console.
	 *
	 * @attribute handlers
	 * @type {Object}
	 */
	this.handlers = 
	{
		log: window.console.log,
		info: window.console.info,
		warn: window.console.warn,
		error: window.console.error,
		clear: window.console.clear
	};

	/**
	 * Indicates if the virtual console is enable or disable.
	 *
	 * @attribute enable
	 * @type {boolean} 
	 */
	this.enabled = !Nunu.developmentMode();

	/**
	 * Top menu bar displayed on top of the console.
	 *
	 * @attribute bar
	 * @type {Division}
	 */
	this.bar = new Division(this);
	this.bar.element.style.top = "0px";
	this.bar.element.style.left = "0px";
	this.bar.element.style.width = "100%";
	this.bar.element.style.height = "20px";
	this.bar.element.style.backgroundColor = Editor.theme.barColor;

	var menu = new ButtonText(this.bar);
	menu.setText(Locale.clear);
	menu.size.set(100, 20);
	menu.position.set(0, 0);
	menu.setOnClick(function()
	{
		console.clear();
	});
	menu.updateInterface();

	/**
	 * Button to toggle the console.
	 *
	 * @property enableButton
	 * @type {ButtonText}
	 */
	this.enableButton = new ButtonText(this.bar);
	this.enableButton.setText(Locale.disable);
	this.enableButton.size.set(100, 20);
	this.enableButton.position.set(100, 0);
	this.enableButton.setOnClick(function()
	{
		self.useConsole(!self.enabled);
	});
	this.enableButton.updateInterface();	

	/**
	 * Console messages division
	 *
	 * @property console
	 * @type {Element}
	 */
	this.console = document.createElement("div");
	this.console.style.position = "absolute";
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

	this.useConsole(this.enabled);
}

ConsoleTab.prototype = Object.create(TabElement.prototype);

/**
 * Use this console as the predefined console.
 *
 * Overrides the browser provided window.console methods and displays the logs in this tab.
 *
 * @method useConsole
 * @param {boolean} enabled
 */
ConsoleTab.prototype.useConsole = function(enabled)
{
	var self = this;

	this.enabled = enabled;
	this.enableButton.setText(this.enabled ? Locale.disable : Locale.enable);

	if(this.enabled)
	{
		window.console.log = function()
		{
			self.log(arguments);
			self.handlers.log.apply(null, arguments);
		};

		window.console.warn = function()
		{
			self.warn(arguments);
			self.handlers.warn.apply(null, arguments);
		};

		window.console.error = function()
		{
			self.error(arguments);
			self.handlers.error.apply(null, arguments);
		};

		window.console.clear = function()
		{
			self.clear(arguments);
			self.handlers.clear.apply(null, arguments);
		};
	}
	else
	{
		window.console.log = self.handlers.log;
		window.console.warn = self.handlers.warn;
		window.console.error = self.handlers.error;
		window.console.clear = self.handlers.clear;
	}
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

/**
 * Apply filters to messages.
 *
 * @method filter
 * @param {Array} Values to filter.
 */
ConsoleTab.prototype.filter = function(args)
{
	for(var i = 0; i < this.filters.length; i++)
	{
		if(args.length > 0 && (args[0] + "").startsWith(this.filters[i]))
		{
			return true;
		}
	}

	return false;
};

ConsoleTab.prototype.updateSize = function()
{
	TabElement.prototype.updateSize.call(this);

	this.console.style.height = (this.size.y - 45) + "px";
};

/**
 * Create a new log division element and fill with information from the object.
 *
 * Checks the type of the object and creates the log accordingly.
 * 
 * @static
 * @method createMessage
 * @param {Object} object Object to be logged into the console.
 * @return {Element} Element created.
 */
ConsoleTab.createMessage = function(object)
{
	var log = document.createElement("div");
	log.style.width = "100%";
	log.style.color = "#FFFFFF";

	if(object === undefined)
	{
		log.appendChild(document.createTextNode("undefined"));
	}
	else if(object === null)
	{
		log.appendChild(document.createTextNode("null"));
	}
	else if(object instanceof Image)
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
		name.insertCell(0).appendChild(document.createTextNode(Locale.name));
		name.insertCell(1).appendChild(document.createTextNode(object.name));

		var uuid = table.insertRow(2);
		uuid.insertCell(0).appendChild(document.createTextNode(Locale.uuid));
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
		type.insertCell(0).appendChild(document.createTextNode(Locale.type;
		type.insertCell(1).appendChild(document.createTextNode(object.type;

		var name = table.insertRow(1);
		name.insertCell(0).appendChild(document.createTextNode(Locale.name;
		name.insertCell(1).appendChild(document.createTextNode(object.name;

		var uuid = table.insertRow(2);
		uuid.insertCell(0).appendChild(document.createTextNode(Locale.uuid;
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
		type.insertCell(0).appendChild(document.createTextNode(Locale.type));
		type.insertCell(1).appendChild(document.createTextNode(object.type));

		var name = table.insertRow(1);
		name.insertCell(0).appendChild(document.createTextNode(Locale.name));
		name.insertCell(1).appendChild(document.createTextNode(object.name));

		var uuid = table.insertRow(2);
		uuid.insertCell(0).appendChild(document.createTextNode(Locale.uuid));
		uuid.insertCell(1).appendChild(document.createTextNode(object.uuid));

		log.appendChild(table);
	}
	else if(object.isVector2)
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
	else if(object.isVector3)
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
	else if(object.isVector4 || object.isQuaternion)
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
	else if(object instanceof Object)
	{
		try
		{
			log.appendChild(document.createTextNode(JSON.stringify(object, null, "\t")));
		}
		catch(e)
		{
			log.appendChild(document.createTextNode(object));
		}
	}
	else
	{
		log.appendChild(document.createTextNode(object));
	}

	return log;
};

/**
 * Create a separator bar division.
 *
 * @static
 * @method createBar
 * @return {Element} Element created.
 */
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
