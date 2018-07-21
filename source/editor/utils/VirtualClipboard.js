"use strict";

/**
 * Alternative to node clipboard to enable simple copy paste inside the editor web version
 *
 * @class virtualClipboard
 */
function VirtualClipboard()
{
	this.values = [];
}

/**
 * Set data to clipboard
 * 
 * @param {Object} data Data to insert into the clipboard
 * @param {String} id Entry id.
 */
VirtualClipboard.prototype.set = function(data, id)
{
	this.values[id] = data;
};

/**
 * Get data from clipboard
 * 
 * @param {String} id Entry id.
 * @return {Object} Data stored in the clipboard
 */
VirtualClipboard.prototype.get = function(id)
{
	return this.values[id];
};