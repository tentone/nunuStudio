"use strict";

/**
 * Body to represent the document.body
 * 
 * It does not extend the Element class, but has the same base attributes.
 */
var DocumentBody = 
{
	parent: null,
	element: document.body,
	mode: Element.TOP_LEFT,
	isElement: true,
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
