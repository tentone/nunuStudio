"use strict";

/**
 * Search box input element.
 * 
 * @class SearchBox
 * @extends {Element}
 * @param {Element} parent Parent element.
 */
function SearchBox(parent)
{
	Element.call(this, parent, "div");

	/**
	 * Input text box of the search box.
	 *
	 * @property search
	 * @type {TextBox}
	 */
	this.search = new TextBox(this);
	this.search.setMode(Element.TOP_RIGHT);
	this.search.element.placeholder = "Search";
	this.search.setOnChange(function()
	{
		console.log(this.value);
	});

	/**
	 * Search icon.
	 *
	 * @property searchIcon
	 * @type {DOM}
	 */
	this.searchIcon = new ImageContainer(this);
	this.searchIcon.setImage(Editor.filePath + "icons/misc/search.png");
}

SearchBox.prototype = Object.create(Element.prototype);

SearchBox.prototype.setOnChange = function(callback)
{
	this.search.setOnChange(callback);
};

SearchBox.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

	this.searchIcon.size.set(this.size.y * 0.6, this.size.y * 0.6);
	this.searchIcon.position.set(this.size.y * 0.2, this.size.y * 0.2);
	this.searchIcon.updateInterface();

	this.search.size.set(this.size.x - this.size.y * 1.4, this.size.y * 0.8);
	this.search.position.set(this.size.y * 0.2, this.size.y * 0.1);
	this.search.updateInterface();
};