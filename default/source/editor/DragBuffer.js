"use strict";

function DragBuffer(){}

//Object drag buffer (stores objects being dragged)
DragBuffer.buffer = [];

//Push elemento to drag buffer
DragBuffer.pushDragElement = function(obj)
{
	//Check if element dont exist on drag buffer
	if(DragBuffer.buffer.indexOf(obj) === -1)
	{
		DragBuffer.buffer.push(obj);
	}
}

//Get element from drag buffer using uuid
DragBuffer.popDragElement = function(uuid)
{
	for(var i = 0; i < DragBuffer.buffer.length; i++)
	{
		if(DragBuffer.buffer[i].uuid === uuid)
		{
			var obj = DragBuffer.buffer[i]; 
			DragBuffer.buffer.splice(i, 1);
			return obj;
		}
	}
	return null;
}