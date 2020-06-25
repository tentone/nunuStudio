
/**
 * The drag buffer is a global object used to store and get object being dragged.
 *
 * Objects are stored in an array and are indetified with a UUID.
 *
 * @static
 * @class DragBuffer
 */
var DragBuffer = {};

/**
 * Object drag buffer, stores objects being dragged.
 *
 * @attribute buffer
 */
DragBuffer.buffer = [];

/** 
 * Push elemento to drag buffer.
 *
 * Checks if element dont exist on drag buffer before inserting.
 *
 * @method push
 */
DragBuffer.push = function(obj)
{
	if(DragBuffer.buffer.indexOf(obj) === -1)
	{
		DragBuffer.buffer.push(obj);
	}
};

/** 
 * Get element from drag buffer using its identifier.
 *
 * @method pop
 * @return {Object} Object indentfied by uuid, if not found return null.
 */
DragBuffer.pop = function(uuid)
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
};

/** 
 * Get element from drag buffer without removing it.
 *
 * @method get
 * @return {Object} Object indentfied by uuid, if not found return null.
 */
DragBuffer.get = function(uuid)
{
	for(var i = 0; i < DragBuffer.buffer.length; i++)
	{
		if(DragBuffer.buffer[i].uuid === uuid)
		{
			return DragBuffer.buffer[i];
		}
	}
	
	return null;
};
