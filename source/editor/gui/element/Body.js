"use strict";

/**
 * Body to represent the document.body
 * 
 * It does not extend the Component class, but has the same base attributes. 
 *
 * @static
 * @class Body
 */
var Body = 
{
	parent: null,
	element: document.body,
	mode: Component.TOP_LEFT,
	isElement: true,
	visible: true,
	position: new THREE.Vector2(0, 0),
	_size: new THREE.Vector2(0, 0)
}

Object.defineProperties(Body,
{
	size:
	{
		get: function()
		{
			Body._size.set(window.innerWidth, window.innerHeight);
			return Body._size;
		}
	}
});
