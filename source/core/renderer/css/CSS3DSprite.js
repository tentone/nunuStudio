import {CSS3DObject} from "../CSS3DObject.js";
import {Sprite} from "../../../objects/sprite/Sprite.js";
import {Component} from "../../../../editor/components/Component.js";

/**
 * CSS 3D element drawn as a billboard.
 *
 * Always faces the screen orientation (does not rotate).
 *
 * @class CSS3DSprite
 * @extends {CSS3DObject}
 * @param {Component} element DOM element encapsulated in the object container.
 */
function CSS3DSprite(element)
{
	CSS3DObject.call(this, element);
}

CSS3DSprite.prototype = Object.create(CSS3DObject.prototype);
CSS3DSprite.prototype.constructor = CSS3DSprite;
CSS3DSprite.prototype.isCSS3DSprite = true;

export {CSS3DSprite};