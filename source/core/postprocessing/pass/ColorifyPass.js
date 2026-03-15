import {ColorifyShader} from "three/examples/jsm/shaders/ColorifyShader";
import {ShaderPass} from "../ShaderPass.js";
import {Pass} from "../Pass.js";

/**
 * Colorify pass can be used to colorify the scene.
 *
 * @class ColorifyPass
 * @module Postprocessing
 */
class ColorifyPass extends ShaderPass
{
constructor()
{
super(ColorifyShader);

this.type = "Colorify";

Object.defineProperties(this,
{
color:
{
get: function() {return this.uniforms["color"].value;},
set: function(value) {this.uniforms["color"].value = value;}
}
});
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

data.color = this.color.getHex();

return data;
}
}

export {ColorifyPass};
