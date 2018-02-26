"use strict";

//Alternative to node clipboard to enable simple copy paste inside the editor web version
function VirtualClipboard()
{
	this.values = [];
}

//Set data to clipboard
VirtualClipboard.prototype.set = function(data, id)
{
	this.values[id] = data;
};

//Get data from clipboard
VirtualClipboard.prototype.get = function(id)
{
	return this.values[id];
};