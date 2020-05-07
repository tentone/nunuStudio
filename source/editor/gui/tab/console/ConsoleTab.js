"use strict";

function ConsoleTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Console", Global.FILE_PATH + "icons/misc/console.png");

	var self = this;

	/**
	 * History of the last commands written into the console.
	 *
	 * Can be navigate to view previously used commands.
	 * 
	 * @attribute history
	 * @type {Array}
	 */
	this.history = [];

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
	this.enabled = true;


	/**
	 * Console content division, where the messages are displayed.
	 *
	 * @attribute console
	 * @type {Element}
	 */
	this.console = document.createElement("div");
	this.console.style.position = "absolute";
	this.console.style.overflow = "auto";
	this.console.style.top = "0px";
	this.console.style.left = "0px";
	this.element.appendChild(this.console);

	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu(DocumentBody);
		context.size.set(150, 20);
		context.position.set(event.clientX, event.clientY);
		
		context.addOption(Locale.clear, function()
		{
			console.clear();
		});

		context.addOption(self.enabled ? Locale.disable : Locale.enable, function()
		{
			self.useConsole(!self.enabled);
		});

		context.updateInterface();
	};

	/**
	 * Command input division, shown as a codemirror code editor division for docs and hint access.
	 *
	 * @attribute code
	 * @type {Element}
	 */
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
	this.code.style.height = "30px";
	this.element.appendChild(this.code);

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
 * Get stack trace up until the point that this method was called.
 *
 * Includes the place were this method was called.
 *
 * Result is returned as a array of strings and may be different from browser to browser.
 *
 * @static
 * @method getStackTrace
 */
ConsoleTab.getStackTrace = function()
{
	var stack;

	try
	{
		throw new Error("");
	}
	catch (error)
	{
		stack = error.stack || "";
	}

	stack = stack.split("\n").map(function (line){return line.trim();});
	return stack.splice(stack[0] == "Error" ? 2 : 1);
};

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

	if(this.enabled)
	{
		window.console.log = function()
		{
			self.log(arguments);
			self.handlers.log.apply(null, arguments);

			// TODO <REMOVE THIS>
			self.handlers.log(ConsoleTab.getStackTrace());
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

			// Print stack trace to console for easier debug
			// console.trace();
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

// Normal log messsage
ConsoleTab.prototype.log = function(args)
{
	for(var i = 0; i < args.length; i++)
	{
		this.console.appendChild(ConsoleTab.createMessage(args[i]));
	}

	this.console.appendChild(ConsoleTab.createBar());
	this.console.scrollTop = Number.MAX_SAFE_INTEGER;
};

// Warning message
ConsoleTab.prototype.warn = function(args)
{
	for(var i = 0; i < args.length; i++)
	{
		var log = ConsoleTab.createMessage(args[i]);
		log.style.color = "#FFFF00";
		log.style.backgroundColor = "#FFFF0022";
		this.console.appendChild(log);
	}

	this.console.appendChild(ConsoleTab.createBar());
	this.console.scrollTop = Number.MAX_SAFE_INTEGER;
};

// Error message
ConsoleTab.prototype.error = function(args)
{
	for(var i = 0; i < args.length; i++)
	{
		var log = ConsoleTab.createMessage(args[i]);
		log.style.color = "#FF0000";
		log.style.backgroundColor = "#FF000022";
		this.console.appendChild(log);
	}

	this.console.appendChild(ConsoleTab.createBar());
	this.console.scrollTop = Number.MAX_SAFE_INTEGER;
};

// Clear commands
ConsoleTab.prototype.clear = function(args)
{
	this.history = [];

	while(this.console.hasChildNodes())
	{
    	this.console.removeChild(this.console.lastChild);
	}

	this.console.scrollTop = Number.MAX_SAFE_INTEGER;
};

ConsoleTab.prototype.updateSize = function()
{
	TabElement.prototype.updateSize.call(this);

	this.console.style.height = (this.size.y - 30) + "px";
	this.console.style.width = this.size.x + "px";
	this.code.style.width = this.size.x + "px";
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
		var container = document.createElement("div");
		container.style.paddingLeft = "5px";
		container.style.paddingTop = "5px";
		container.style.paddingBottom = "5px";
		container.appendChild(document.createTextNode("undefined"));
		log.appendChild(container);
	}
	else if(object === null)
	{
		var container = document.createElement("div");
		container.style.paddingLeft = "5px";
		container.style.paddingTop = "5px";
		container.style.paddingBottom = "5px";
		container.appendChild(document.createTextNode("null"));
		log.appendChild(container);
	}
	else if(object instanceof Image)
	{
		var preview = document.createElement("img");
		preview.src = object.data;
		preview.height = 70;
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
	else if(object instanceof THREE.Texture)
	{
		var preview = TextureRenderer.generateElement(object);
		preview.height = 70;
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
		var container = document.createElement("div");
		container.style.paddingLeft = "5px";
		container.style.paddingTop = "5px";
		container.style.paddingBottom = "5px";
		try
		{
			container.appendChild(document.createTextNode(JSON.stringify(object, null, "\t")));
		}
		catch(e)
		{
			container.appendChild(document.createTextNode(object));
		}

		log.appendChild(container);
	}
	else
	{
		var container = document.createElement("div");
		container.style.paddingLeft = "5px";
		container.style.paddingTop = "5px";
		container.style.paddingBottom = "5px";
		container.appendChild(document.createTextNode(object));
		log.appendChild(container);
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
	bar.style.backgroundColor = Editor.theme.barColor;
	return bar;
};
