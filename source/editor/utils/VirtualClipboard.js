"use strict";

/**
 * Alternative to node clipboard to enable simple copy paste inside the editor web version.
 *
 * When copying data also copies data to the system clipboard.
 *
 * @class VirtualClipboard
 */
function VirtualClipboard()
{
	/**
	 * Values stored in the virtual clipboard.
	 *
	 * @attribute values
	 * @type {Array}
	 */
	this.values = [];
}

/**
 * Set data to clipboard
 * 
 * @param {Object} data Data to insert into the clipboard
 * @param {string} id Entry id.
 */
VirtualClipboard.prototype.set = function(data, id)
{
	this.values[id] = data;
	VirtualClipboard.copy(data);
};

/**
 * Get data from clipboard
 * 
 * @param {string} id Entry id.
 * @return {Object} Data stored in the clipboard
 */
VirtualClipboard.prototype.get = function(id)
{
	return this.values[id];
};

VirtualClipboard.copy = function(text)
{
	var textArea = document.createElement("textarea");
	textArea.style.position = "fixed";
	textArea.style.top = 0;
	textArea.style.left = 0;
	textArea.style.width = "2em";
	textArea.style.height = "2em";
	textArea.style.padding = 0;
	textArea.style.border = "none";
	textArea.style.outline = "none";
	textArea.style.boxShadow = "none";
	textArea.style.background = "transparent";
	textArea.value = text;

	document.body.appendChild(textArea);
	textArea.select();

	try
	{
		var success = document.execCommand("copy");
	}
	catch(e){}

	document.body.removeChild(textArea);
};