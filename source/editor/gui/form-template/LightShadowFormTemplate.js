"use strict";

/** 
 * Shadow map configuration form for light objects that emitt shadows.
 *
 * @class LightShadowFormTemplate
 * @extends {FormTemplate}
 */
function LightShadowFormTemplate(form, object)
{
	FormTemplate.call(this, form, object);

	var self = this;
	
	
}

LightShadowFormTemplate.prototype = Object.create(FormTemplate.prototype);

LightShadowFormTemplate.prototype.updateValues = function()
{

};
