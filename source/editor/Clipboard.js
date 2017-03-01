"use strict";

//Alternative to node clipboard to enable simple copy paste inside the editor web version
function Clipboard()
{
	this.values = [];
}

//Set data to clipboard
Clipboard.prototype.set = function(data, id)
{
	this.values[id] = data;
};

//Get data from clipboard
Clipboard.prototype.get = function(id)
{
	return this.values[id];
};