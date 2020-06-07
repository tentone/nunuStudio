"use strict";

/**
 * Slider element is used to select a numeric value using a visual slider bar.
 * 
 * @class Slider
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
function Slider(parent)
{
	Component.call(this, parent, "div");

	this.element.style.overflow = "visible";

	var self = this;

	// Text
	this.text = document.createElement("div");
	this.text.style.position = "absolute";
	this.text.style.display = "none";
	this.text.style.justifyContent = "center";
	this.text.style.alignItems = "center";
	this.text.style.zIndex = "10000";
	this.text.style.border = "3px solid";
	this.text.style.borderRadius = "5px";
	this.text.style.color = "var(--color-light)";
	this.text.style.backgroundColor = "var(--bar-color)";
	this.text.style.borderColor = "var(--bar-color)";	
	document.body.appendChild(this.text);

	// Text value
	this.textValue = document.createTextNode("");
	this.text.appendChild(this.textValue);

	// Mouse mouse move event
	this.element.onmousemove = function(event)
	{
		self.text.style.display = "flex";
		self.text.style.width = "fit-content";
		self.text.style.height = "fit-content";
		self.text.style.left = event.clientX + "px";
		self.text.style.top = (event.clientY - 30) + "px";
	};

	// Mouse out event
	this.element.onmouseout = function()
	{
		self.text.style.display = "none";
	};

	// Track
	this.track = document.createElement("div");
	this.track.style.position = "absolute";
	this.track.style.backgroundColor = "var(--bar-color)";
	this.track.style.cursor = "pointer";
	this.track.style.left = "0px";
	this.track.style.width = "100%";
	this.track.style.top = "25%";
	this.track.style.height = "50%";
	this.element.appendChild(this.track);

	// Progress
	this.progress = document.createElement("div");
	this.progress.style.pointerEvents = "none";
	this.progress.style.position = "absolute";
	this.progress.style.backgroundColor = "var(--button-over-color)";
	this.progress.style.height = "100%";
	this.track.appendChild(this.progress);

	// Scrubber
	this.scrubber = document.createElement("div");
	this.scrubber.style.position = "absolute";
	this.scrubber.style.backgroundColor = "var(--color-light)";
	this.scrubber.style.cursor = "pointer";
	this.scrubber.style.height = "160%";
	this.scrubber.style.top = "-25%";
	this.scrubber.style.width = "6px";
	this.track.appendChild(this.scrubber);

	/**
	 * Value stored in the slider.
	 *
	 * @property value
	 * @type {number}
	 */
	this.value = 0.0;

	/**
	 * On change callback function.
	 *
	 * @property onChange
	 * @type {Function}
	 */
	this.onChange = null;

	// Range
	this.min = 1.0;
	this.max = 2.0;
	this.step = null;

	// Drag control
	this.mouseStart = 0;
	this.valueStart = 0;

	/**
	 * Event manager to handle window events.
	 *
	 * @property manager
	 * @type {EventManager}
	 */
	this.manager = new EventManager();
	this.manager.add(window, "mousemove", function(event)
	{
		var delta = (event.pageX - self.mouseStart) / (self.size.x);
		var value = self.valueStart + delta * (self.max - self.min);
		self.setValue(value);

		if(self.onChange !== null)
		{
			self.onChange(self.value);
		}
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

		if(self.onChange !== null)
		{
			self.onChange(self.value);
		}
	};
}

Slider.prototype = Object.create(Component.prototype);

/**
 * Set if element is disabled.
 *
 * @method setDisabled
 * @param {boolean} value.
 */
Slider.prototype.setDisabled = function(value)
{
	// TODO
};

// Set slider min step
Slider.prototype.setStep = function(step)
{
	this.step = step;
};

/**
 * Set value range of the slider.
 *
 * @method setRange.
 * @param {number} min
 * @param {number} max
 */
Slider.prototype.setRange = function(min, max)
{
	this.min = min;
	this.max = max;
};

/** 
 * Set onchange callback.
 *
 * @method setOnChange
 * @param {Function} onChange
 * @param {string} name Graph name.
 */
Slider.prototype.setOnChange = function(onChange)
{
	this.onChange = onChange;
};

/**
 * Set Slider value.
 *
 * @method setValue
 * @param {number} value
 */
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

		// Check for precision problems
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
	this.updateValue();
};

/**
 * Get Slider value.
 *
 * @method getValue
 * @return {number} Value of the slider.
 */
Slider.prototype.getValue = function()
{
	return this.value;
};

/**
 * Update the DOM elements to represent the value.
 *
 * @method updateValue
 */
Slider.prototype.updateValue = function()
{
	var progress = ((this.value - this.min) / (this.max - this.min)) * 100;

	this.progress.style.width = progress + "%";
	this.scrubber.style.left = progress + "%";
	this.textValue.data = this.value;
};

Slider.prototype.destroy = function()
{
	Component.prototype.destroy.call(this);
	
	if(document.body.contains(this.text))
	{
		document.body.removeChild(this.text);
	}
};