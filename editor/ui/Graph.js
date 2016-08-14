"use strict";

function Graph(parent)
{
	//Parent
	if(parent === undefined)
	{
		this.parent = document.body;
	}
	else
	{
		this.parent = parent;
	}
	
	//ID
	var id = "graph" + Graph.id;
	Graph.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.style.cursor = "default";
	this.element.style.zIndex = "1000";

	//Grid
	this.grid = document.createElement("canvas");
	this.grid.style.position = "absolute";
	this.element.appendChild(this.grid);

	//Graph
	this.graph = document.createElement("canvas");
	this.graph.style.position = "absolute";
	this.element.appendChild(this.graph);

	//Buttons and values array
	this.buttons = [];
	this.value = [];

	//Onchange callback
	this.onchange = null;

	//Attributes
	this.size = new THREE.Vector2(150, 120);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Add element to document
	this.parent.appendChild(this.element);
}

//Graph counter
Graph.id = 0;

//Functions Prototype
Graph.prototype.setOnChange = setOnChange;
Graph.prototype.setValue = setValue;
Graph.prototype.getValue = getValue;
Graph.prototype.drawGraph = drawGraph;
Graph.prototype.drawGrid = drawGrid;
Graph.prototype.update = update;
Graph.prototype.updateInterface = updateInterface;
Graph.prototype.destroy = destroy;

//Set onchange callback
function setOnChange(callback)
{
	this.onchange = callback;
}

//Set value array and redraw graph
function setValue(value)
{
	this.value = value;

	//Add buttons if necessary
	while(this.buttons.length < this.value.length)
	{
		var button = document.createElement("div");
		button.style.borderRadius = "50%";
		button.style.backgroundColor = "#FFFFFF";
		button.style.cursor = "pointer";
		button.style.position = "absolute";
		button.style.width = "10px";
		button.style.height = "10px";
		button.style.left = "-5px";
		button.style.top = "-5px";
		button.pressed = false;
		button.onmousedown = function()
		{
			this.pressed = true;
		}
		this.element.appendChild(button);
		this.buttons.push(button);
	}

	//Remove buttons if necessary
	while(this.buttons.length > this.value.length)
	{
		var button = this.buttons.pop();
		this.element.removeChild(button);
	}

	//Update graph
	this.drawGraph();
}

//Return value array
function getValue()
{
	return this.value;
}

//Draw graph from values
function drawGraph()
{
	var context = this.graph.getContext("2d");
	context.clearRect(0, 0, this.size.x, this.size.y);
	context.strokeStyle = "#FFFFFF";
	context.lineWidth = "2";

	//Draw graph
	var step = this.size.x / (this.value.length - 1);
	context.moveTo(0, this.value[0] * this.size.y);
	context.beginPath();
	for(var i = 0; i < this.value.length; i ++)
	{
		context.lineTo(i * step, (1 - this.value[i]) * this.size.y);
	}
	context.stroke();

	//Set button positions
	var step = this.size.x / (this.value.length - 1);
	for(var i = 0; i < this.value.length; i++)
	{
		var button = this.buttons[i];
		button.style.left = (i*step - 5) + "px";
		button.style.top = ((1 - this.value[i]) * this.size.y - 5) + "px";
	}
}

//Draw bakckground grid
function drawGrid()
{
	var context = this.grid.getContext("2d");
	context.clearRect(0, 0, this.size.x, this.size.y);
	context.strokeStyle = "#222222";
	context.lineWidth = "1";

	//Border
	context.beginPath();
	context.rect(0, 0, this.size.x, this.size.y);
	context.stroke();
	context.moveTo(0, 0);

	//Vertical lines
	var step = this.size.x / 10;
	for(var i = 0; i < this.size.x; i += step)
	{
		context.beginPath();
		context.moveTo(i, 0);
		context.lineTo(i, this.size.y);
		context.stroke();
	}

	//Horizontal lines
	for(i = 0; i < this.size.y; i += step)
	{
		context.beginPath();
		context.moveTo(0, i);
		context.lineTo(this.size.x, i);
		context.stroke();
	}
}

//Remove element
function destroy()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update Graph
function update()
{
	//Check if some button is pressed
	for(var i = 0; i < this.buttons.length; i++)
	{
		if(this.buttons[i].pressed)
		{
			//Check if button still pressed
			if(Mouse.buttonPressed(Mouse.LEFT))
			{
				this.value[i] -= (Mouse.delta.y * (1.0 / this.size.y));

				if(this.value[i] > 1.0)
				{
					this.value[i] = 1.0;
				}
				else if(this.value[i] < 0.0)
				{
					this.value[i] = 0.0;
				}

				this.drawGraph();
				if(this.onchange !== null)
				{
					this.onchange(this.value);
				}
			}
			//Reset button pressed flag
			else
			{
				this.buttons[i].pressed = false;
			}
		}
	}
}

//Update Graph Size
function updateInterface()
{	
	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Grid size
	this.grid.width = this.size.x;
	this.grid.height = this.size.y;
	this.grid.style.width = this.size.x + "px";
	this.grid.style.height = this.size.y + "px";
	this.drawGrid();

	//Graph size
	this.graph.width = this.size.x;
	this.graph.height = this.size.y;
	this.graph.style.width = this.size.x + "px";
	this.graph.style.height = this.size.y + "px";
	this.drawGraph();

	//Update element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
