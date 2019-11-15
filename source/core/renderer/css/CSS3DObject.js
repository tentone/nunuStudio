"use strict";

/**
 * CSS 3D element projected in the 3D scene.
 *
 * Encapsulated a DOM element that is projected into 3D space using the 3D object transform values.
 *
 * CSS3D object always stay above everything elese in the 3D scene.
 *
 * @class CSS3DObject
 * @extends {THREE.Object3D}
 * @param {Element} element DOM element encapsulated in the object container.
 */
function CSS3DObject(element)
{
	THREE.Object3D.call(this);

	/**
	 * The DOM element to be projected in 3D space.
	 *
	 * It is automatically added to the appropiate DOM container used by the renderer.
	 *
	 * @attribute element
	 * @type {Element}
	 */
	this.element = element;
	this.element.style.position = "absolute";
	
	this.addEventListener("removed", function()
	{
		if(this.element.parentNode !== null)
		{
			this.element.parentNode.removeChild(this.element);
		}
	});

	var self = this;
	var visible = true;
	Object.defineProperties(this,
	{
		visible:
		{
			get: function()
			{
				return visible;
			},
			set: function(value)
			{
				visible = value;
				
				self.element.style.display = value ? "block" :"none";
			}
		}
	});
};

CSS3DObject.prototype = Object.create(THREE.Object3D.prototype);
CSS3DObject.prototype.constructor = CSS3DObject;
CSS3DObject.prototype.isCSS3DObject = true;
