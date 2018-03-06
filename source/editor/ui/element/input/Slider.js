"use strict";

function Slider(parent)
{
	Element.call(this, parent);

	this.element.style.overflow = "visible";

	var self = this;

	//Text
	this.text = document.createElement("div");
	this.text.style.position = "absolute";
	this.text.style.display = "none";
	this.text.style.justifyContent = "center";
	this.text.style.alignItems = "center";
	this.text.style.zIndex = "10000";
	this.text.style.border = "3px solid";
	this.text.style.borderRadius = "5px";
	this.text.style.color = Editor.theme.textColor;
	this.text.style.backgroundColor = Editor.theme.barColor;
	this.text.style.borderColor = Editor.theme.barColor;
	document.body.appendChild(this.text);

	//Mouse mouse move event
	this.element.onmousemove = function(event)
	{
		self.text.style.display = "flex";
		self.text.style.width = "fit-content";
		self.text.style.height = "fit-content";
		self.text.style.left = event.clientX + "px";
		self.text.style.top = (event.clientY - 30) + "px";
	};

	//Mouse out event
	this.element.onmouseout = function()
	{
		self.text.style.display = "none";
	};

	//Track
	this.track = document.createElement("div");
	this.track.style.position = "absolute";
	this.track.style.backgroundColor = Editor.theme.audioTrack;
	this.track.style.cursor = "pointer";
	this.track.style.left = "0px";
	this.track.style.width = "100%";
	this.track.style.top = "25%";
	this.track.style.height = "50%";
	this.element.appendChild(this.track);

	//Progress
	this.progress = document.createElement("div");
	this.progress.style.pointerEvents = "none";
	this.progress.style.position = "absolute";
	this.progress.style.backgroundColor = Editor.theme.audioProgress;
	this.progress.style.height = "100%";
	this.track.appendChild(this.progress);

	//Scrubber
	this.scrubber = document.createElement("div");
	this.scrubber.style.position = "absolute";
	this.scrubber.style.backgroundColor = Editor.theme.audioScrubber;
	this.scrubber.style.cursor = "pointer";
	this.scrubber.style.height = "160%";
	this.scrubber.style.top = "-25%";
	this.scrubber.style.width = "6px";
	this.track.appendChild(this.scrubber);

	//Value
	this.value = 0.0;
	this.onChange = null;

	//Range
	this.min = 1.0;
	this.max = 2.0;
	this.step = null;

	//Drag control
	this.mouseStart = 0;
	this.valueStart = 0;

	//Event manager
	this.manager = new EventManager();
	this.manager.add(window, "mousemove", function(event)
	{
		var delta = (event.pageX - self.mouseStart) / (self.size.x);
		var value = self.valueStart + delta * (self.max - self.min);
		self.setValue(value);
	});

	this.manager.add(window, "mouseup", function(event)
	{	
		self.manager.destroy();
	});

	this.scrubber.onmousedown = function(event)
	{
		self.mouseStart = event.pageX;
		self.valueStart = self.value;
		self.manager.create();
		event.stopPropagation();
	};

	this.track.onmousedown = function(event)
	{
		var percentage = (event.layerX / self.size.x);

		self.setValue(percentage * (self.max - self.min) + self.min);
		self.progress.style.width = (percentage * 100) + "%";
		self.scrubber.style.left = self.progress.style.width;
		self.scrubber.onmousedown(event);
	};
}

Slider.prototype = Object.create(Element.prototype);

//Remove element
Slider.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}

	if(document.body.contains(this.text))
	{
		document.body.removeChild(this.text);
	}
};

//Update division Size
Slider.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
};

//Set if element if disabled
Slider.prototype.setDisabled = function(value)
{
	//TODO
};

//Set slider min step
Slider.prototype.setStep = function(step)
{
	this.step = step;
};

//Set slider range
Slider.prototype.setRange = function(min, max)
{
	this.min = min;
	this.max = max;
};

//Set onchange onChange
Slider.prototype.setOnChange = function(onChange)
{
	this.onChange = onChange;
};

//Get Slider value
Slider.prototype.setValue = function(value)
{
	if(value < this.min)
	{
		value = this.min;
	}
	else if(value > this.max)
	{
		value = this.max;
	}

	if(this.step !== null)
	{
		var remainder = value % this.step;
		value -= remainder;
		if(remainder > this.step / 2)
		{
			value += this.step;
		}

		//Check for precision problems
		var stepVal = String(this.step).split(".");
		if(stepVal.length > 1)
		{
			var precision = stepVal[1].length;
			var values = String(value).split(".");
			if(values.length > 1)
			{
				value = Number.parseFloat(values[0] + "." + values[1].substr(0, precision));
			}
		}
	}

	this.value = value;

	//Update elements
	var progress = ((this.value - this.min) / (this.max - this.min)) * 100;
	this.progress.style.width = progress + "%";
	this.scrubber.style.left = progress + "%";
	this.text.innerHTML = value;

	if(this.onChange !== null)
	{
		this.onChange(this.value);
	}
};

//Get Slider value
Slider.prototype.getValue = function()
{
	return this.value;
};
