import {HueSaturationShader} from "three/examples/jsm/shaders/HueSaturationShader";
import {ShaderPass} from "../ShaderPass.js";
import {Pass} from "../Pass.js";

/**
 * Hue and saturation pass.
 * 
 * @class HueSaturationPass
 * @module Postprocessing
 * @param {number} hue Hue rotation from -1 to 1
 * @param {number} saturation Color saturation from -1  to 1
 */
class HueSaturationPass extends ShaderPass
{
constructor(hue, saturation)
{
super(HueSaturationShader);

this.type = "HueSaturation";

Object.defineProperties(this,
{
hue:
{
get: function() {return this.uniforms["hue"].value;},
set: function(value) {this.uniforms["hue"].value = value;}
},

saturation:
{
get: function() {return this.uniforms["saturation"].value;},
set: function(value) {this.uniforms["saturation"].value = value;}
}
});

this.hue = hue !== undefined ? hue : 0;
this.saturation = saturation !== undefined ? saturation : 0;
}

/**
 * Serialize pass to json.
 *
 * @method toJSON
 * @param {Object} meta Metadata object.
 */
toJSON(meta)
{
var data = Pass.prototype.toJSON.call(this, meta);

data.hue = this.hue;
data.saturation = this.saturation;

return data;
}
}

export {HueSaturationPass};
