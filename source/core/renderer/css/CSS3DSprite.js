import {CSS3DObject} from "./CSS3DObject.js";

/**
 * CSS 3D element drawn as a billboard.
 *
 * Always faces the screen orientation (does not rotate).
 *
 * @class CSS3DSprite
 * @extends {CSS3DObject}
 * @param {Component} element DOM element encapsulated in the object container.
 */
class CSS3DSprite extends CSS3DObject
{
	constructor(element)
	{
		super(element);
	}
}

CSS3DSprite.prototype.isCSS3DSprite = true;

export {CSS3DSprite};
