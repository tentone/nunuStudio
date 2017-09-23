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

//Check if a DOM element is out of the window and how far it is
DOMUtils.checkBorder = function(element)
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

	var result = {x: 0, y: 0};

	//Bellow the window
	if(top > (window.pageYOffset + window.innerHeight) || (top + height) > (window.pageYOffset + window.innerHeight))
	{
		console.log("Out bottom");
		//TODO <ADD CODE HERE>
	}
	//Over the window
	else if(top < window.pageYOffset || (top + height) < window.pageYOffset)
	{
		console.log("Out top");
		//TODO <ADD CODE HERE>
	}

	//Left to the window
	if(left < window.pageXOffset || (left + width) < window.pageXOffset)
	{
		console.log("Out left");
		//TODO <ADD CODE HERE>
	}
	//Right to the window
	else if(left > (window.pageXOffset + window.innerWidth) || (left + width) > (window.pageXOffset + window.innerWidth))
	{
		console.log("Out right");
		//TODO <ADD CODE HERE>
	}

	return result;
};
