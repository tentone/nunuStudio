function UIUtils(){}

//Create a new division
UIUtils.createDiv = function(id)
{
	document.write('<div id="'+ id + '"></div>');
}

//Create a canvas
UIUtils.createCanvas = function(id)
{
	document.write('<canvas id="'+ id + '"></canvas>');
}