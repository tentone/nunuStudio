"use strict";

/**
 * Body to represent the document.body 
 * 
 * It does not extend the Component class, but has the same base attributes and can be used as a parent for components.
 *
 * @static
 * @class DocumentBody
 */
var DocumentBody = 
{
	parent: null,
	element: document.body,
	mode: Component.TOP_LEFT,
	isComponent: true,
	visible: true,
	position: new THREE.Vector2(0, 0),
	_size: new THREE.Vector2(0, 0)
}

Object.defineProperties(DocumentBody,
{
	size:
	{
		get: function()
		{
			this._size.set(window.innerWidth, window.innerHeight);
			return this._size;
		},
		set: function(){}
	}
});
