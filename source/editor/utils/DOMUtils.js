"use strict";

function DOMUtils(){}

//Check if a DOM element in completely visible in the viewport
DOMUtils.isVisible = function(element)
{
	var top = element.offsetTop;
	var left = element.offsetLeft;
	var width = element.offsetWidth;
	var height = element.offsetHeight;

	while(element.offsetParent)
	{
		element = element.offsetParent;
		top += element.offsetTop;
		left += element.offsetLeft;
	}

	return top >= window.pageYOffset && left >= window.pageXOffset && (top + height) <= (window.pageYOffset + window.innerHeight) && (left + width) <= (window.pageXOffset + window.innerWidth);
};

//Check if a DOM element is visible on X axis
DOMUtils.isVisibleX = function(element)
{
	var top = element.offsetTop;
	var height = element.offsetHeight;

	while(element.offsetParent)
	{
		element = element.offsetParent;
		top += element.offsetTop;
	}

	return top >= window.pageYOffset && (top + height) <= (window.pageYOffset + window.innerHeight)
};

//Check if a DOM element is visible on Y axis
DOMUtils.isVisibleY = function(element)
{
	var left = element.offsetLeft;
	var width = element.offsetWidth;

	while(element.offsetParent)
	{
		element = element.offsetParent;
		left += element.offsetLeft;
	}

	return left >= window.pageXOffset && (left + width) <= (window.pageXOffset + window.innerWidth);
};
