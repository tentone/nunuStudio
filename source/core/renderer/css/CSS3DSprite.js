"use strict";

/**
 * CSS 3D element drawn as a billboard.
 *
 * Always faces the screen orientation (does not rotate).
 *
 * @class CSS3DSprite
 * @extends {CSS3DObject}
 * @param {DOM} element DOM element encapsulated in the object container.
 */
function CSS3DSprite(element)
{
	CSS3DObject.call(this, element);
}

CSS3DSprite.prototype = Object.create(CSS3DObject.prototype);
CSS3DSprite.prototype.constructor = CSS3DSprite;