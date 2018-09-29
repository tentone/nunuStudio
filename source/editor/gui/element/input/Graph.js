"use strict";

/**
 * Graph element is used to draw interactive line graphs.
 *
 * It is meant to be used as input in forms to controls values in arrays.
 *
 * @class Graph
 * @extends {Element}
 * @param {Element} parent Parent element.
 * @param {String} name Name of the default graph.
 * @param {String} color CSS hex color code of the default graph.
 */
function Graph(parent, name, color)
{
	Element.call(this, parent, "div");

	var self = this;

	this.element.style.overflow = "visible";

	//Graphs
	this.graph = [];

	//Label margin
	this.scaleMargin = 22;
	this.buttonRadius = 10;

	//Range
	this.min = 0.0;
	this.max = 1.0;

	/**
	 * Grid canvas element.
	 *
	 * @property grid
	 * @type {DOM}
	 */
	this.grid = document.createElement("canvas");
	this.grid.style.position = "absolute";
	this.grid.style.marginLeft = this.scaleMargin + "px";
	this.element.appendChild(this.grid);

	//Graph
	var canvas = document.createElement("canvas");
	canvas.style.position = "absolute";
	canvas.style.marginLeft = this.scaleMargin + "px";
	this.element.appendChild(canvas);

	//Default graph
	this.graph.push(
	{
		canvas: canvas,
		name: (name !== undefined) ? name : "default",
		color: (color !== undefined) ? color : "#FFFFFF",
		values: [],
		buttons: [],
		onchange: null
	});
	
	/**
	 * Scale DOM elements.
	 *
	 * @property scale
	 * @type {Array}
	 */
	this.scale = [];
	this.createScale(3);
}

Graph.prototype = Object.create(Element.prototype);

/**
 * Create numeric scale for this graph.
 *
 * @method createScale
 * @param {Number} size Number of values in the scale.
 */
Graph.prototype.createScale = function(size)
{
	for(var i = 0; i < this.scale; i++)
	{
		this.element.removeChild(this.scale[i]);
	}

	for(var i = 0; i < size; i++)
	{
		var scale = document.createElement("div");
		scale.style.position = "absolute";
		scale.style.pointerEvents = "none";
		scale.style.color = Editor.theme.textColor;

		var text = document.createTextNode(1.0 - (0.5 * i));
		scale.text = text;
		scale.appendChild(text);

		this.scale.push(scale);
		this.element.appendChild(scale);
	}
};

//Add graph
Graph.prototype.addGraph = function(name, color)
{
	var canvas = document.createElement("canvas");
	canvas.style.position = "absolute";
	canvas.style.marginLeft = this.scaleMargin + "px";
	this.element.appendChild(canvas);

	this.graph.push({canvas: canvas, name: name, color: color, values: [], buttons: [], onchange: null});
};

//Attach onchange onChange to a graph
Graph.prototype.setOnChange = function(onChange, name)
{
	var graph = this.getGraph(name);
	graph.onchange = onChange;
};

//Set value range
Graph.prototype.setRange = function(min, max)
{
	this.min = min;
	this.max = max;

	//Limit graphs values
	for(var i in this.graph)
	{
		var graph = this.graph[i];

		for(var j = 0; j < graph.values.length; j++)
		{
			if(graph.values[j] < min)
			{
				graph.values[j] = min;

				if(graph.onchange !== null)
				{
					graph.onchange(graph.values);
				}
			}
			else if(graph.values[j] > max)
			{
				graph.values[j] = max;

				if(graph.onchange !== null)
				{
					graph.onchange(graph.values);
				}
			}
		}
	}

	//Update scale elements
	var step = (this.max - this.min) / (this.scale.length - 1);
	for(var i = 0; i < this.scale.length; i++)
	{
		this.scale[(this.scale.length - 1) - i].text.data = this.min + (step * i);
	}

	//Update grid to fit new scale
	for(var i = 0; i < this.graph.length; i++)
	{
		this.updateGraph(this.graph[i]);
	}
};

//Set values to a graph
Graph.prototype.setValue = function(values, name)
{	
	var self = this;
	var graph = this.getGraph(name);

	//Set values
	graph.values = values;

	//Add buttons if necessary
	while(graph.buttons.length < graph.values.length)
	{
		var button = document.createElement("div");
		button.style.borderRadius = "5px";
		button.style.backgroundColor = graph.color;
		button.style.cursor = "pointer";
		button.style.position = "absolute";
		button.style.marginTop = "-" + (this.buttonRadius / 2) + "px";
		button.style.marginLeft = (this.scaleMargin - (this.buttonRadius / 2)) + "px";
		button.style.width = this.buttonRadius + "px";
		button.style.height = this.buttonRadius + "px";
		button.index = graph.buttons.length;
		button.graph = graph;

		button.onmousedown = function(event)
		{
			var index = this.index;
			var graph = this.graph;
			var manager = new EventManager();

			manager.add(window, "mousemove", function(event)
			{
				var delta = event.movementY;

				graph.values[index] -= (delta * ((self.max - self.min) / self.size.y));

				if(graph.values[index] > self.max)
				{
					graph.values[index] = self.max;
				}
				else if(graph.values[index] < self.min)
				{
					graph.values[index] = self.min;
				}

				if(graph.onchange !== null)
				{
					graph.onchange(graph.values);
				}
				self.updateGraph(graph);
			});

			manager.add(window, "mouseup", function(event)
			{	
				manager.destroy();
			});
			manager.create();

			event.stopPropagation();
		};

		this.element.appendChild(button);
		graph.buttons.push(button);
	}

	//Remove buttons if necessary
	while(graph.buttons.length > graph.values.length)
	{
		this.element.removeChild(graph.buttons.pop());
	}

	//Check if new values are in range
	var update = false;
	for(var i = 0; i < values.length; i++)
	{
		if(values[i] < this.min)
		{
			this.min = Math.ceil(values[i]);
			update = true;
			break;
		}
		else if(values[i] > this.max)
		{
			this.max = Math.ceil(values[i] + 1.0);
			update = true;
			break;
		}
	}

	//If some value not in range update range
	if(update)
	{
		this.setRange(this.min, this.max);
	}

	//Update graph
	this.updateGraph(graph);
};

//Return value array
Graph.prototype.getValue = function(name)
{
	var graph = this.getGraph(name);

	if(graph !== null)
	{
		return graph.values;
	}

	return null;
};

//Get graph object by name
Graph.prototype.getGraph = function(name)
{
	if(name !== undefined)
	{
		for(var i = 0; i < this.graph.length; i++)
		{
			if(this.graph[i].name === name)
			{
				return this.graph[i];
			}
		}
	}

	if(this.graph.length > 0)
	{
		return this.graph[0];
	}

	return null;
};

//Update graph canvas and buttons
Graph.prototype.updateGraph = function(graph)
{
	var width = this.size.x - this.scaleMargin;

	//Get canvas context
	var context = graph.canvas.getContext("2d");
	context.clearRect(0, 0, width, this.size.y);
	context.strokeStyle = graph.color;
	context.lineWidth = "2";

	//Draw graph and set button positions
	var step = width / (graph.values.length - 1);
	var delta = this.max - this.min;

	context.moveTo(0, graph.values[0] * this.size.y);
	context.beginPath();

	for(var i = 0; i < graph.values.length; i++)
	{
		var x = i * step;
		var y = (1 - ((graph.values[i] - this.min) / delta)) * this.size.y;

		context.lineTo(x, y);

		var button = graph.buttons[i];
		button.style.left = x + "px";
		button.style.top = y + "px";
	}

	context.stroke();
};

//Draw background grid canvas
Graph.prototype.updateGrid = function()
{
	var width = this.size.x - this.scaleMargin;

	var context = this.grid.getContext("2d");
	context.clearRect(0, 0, width, this.size.y);
	context.strokeStyle = "#222222";
	context.lineWidth = "1";

	//Border
	context.beginPath();
	context.rect(0, 0, width, this.size.y);
	context.stroke();
	context.moveTo(0, 0);

	var step = width / 10;
	if(step <= 0)
	{
		return;
	}

	//Vertical lines	
	for(var i = 0; i < width; i += step)
	{
		context.beginPath();
		context.moveTo(i, 0);
		context.lineTo(i, this.size.y);
		context.stroke();
	}

	//Horizontal lines
	for(var i = 0; i < this.size.y; i += step)
	{
		context.beginPath();
		context.moveTo(0, i);
		context.lineTo(width, i);
		context.stroke();
	}
};

//Update Graph Size
Graph.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

	var width = this.size.x - this.scaleMargin;

	//Grid
	this.grid.width = width;
	this.grid.height = this.size.y;
	this.grid.style.width = width + "px";
	this.grid.style.height = this.size.y + "px";
	this.updateGrid();

	//Graph
	for(var i = 0; i < this.graph.length; i++)
	{
		var graph = this.graph[i];
		graph.canvas.width = width;
		graph.canvas.height = this.size.y;
		graph.canvas.style.width = width + "px";
		graph.canvas.style.height = this.size.y + "px";
		this.updateGraph(graph);
	}

	//Scale
	var step = (this.size.y - 14) / (this.scale.length - 1);
	for(var i = 0; i < this.scale.length; i++)
	{
		this.scale[i].style.top = (i * step) + "px";
	}
};
