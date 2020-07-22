import {Locale} from "../../../../../locale/LocaleManager.js";
import {DirectionalLight} from "../../../../../../core/objects/lights/DirectionalLight.js";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {Action} from "../../../../../history/action/Action.js";
import {ObjectInspector} from "../ObjectInspector.js";
import {Inspector} from "../../Inspector.js";
import {Interface} from "../../../../Interface.js";
import {LightShadowFormSnippet} from "../../../../form-snippet/LightShadowFormSnippet.js";
import {FormSnippet} from "../../../../form-snippet/FormSnippet.js";
import {Editor} from "../../../../../Editor.js";
import {Text} from "../../../../../components/Text.js";
import {ColorChooser} from "../../../../../components/input/ColorChooser.js";
import {CheckBox} from "../../../../../components/input/CheckBox.js";
import {Form} from "../../../../../components/Form.js";
import {Color} from "three";

function DirectionalLightInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;

	// Color
	this.form.addText(Locale.color);
	this.color = new ColorChooser(this.form);
	this.color.size.set(80, 18);
	this.color.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "color", new Color(self.color.getValueHex())));
	});
	this.form.add(this.color);
	this.form.nextRow();

	// Shadow map
	this.form.addText(Locale.shadows);
	this.form.nextRow();

	// Cast shadow
	this.form.addText(Locale.castShadows);
	this.castShadow = new CheckBox(this.form);
	this.castShadow.size.set(18, 18);
	this.castShadow.position.set(5, 85);
	this.castShadow.updateInterface();
	this.castShadow.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "castShadow", self.castShadow.getValue()));
	});
	this.form.add(this.castShadow);
	this.form.nextRow();

	// Shadow
	this.shadow = new LightShadowFormSnippet(this.form, object);
}

DirectionalLightInspector.prototype = Object.create(ObjectInspector.prototype);

DirectionalLightInspector.prototype.updateInspector = function()
{
	ObjectInspector.prototype.updateInspector.call(this);
	
	this.color.setValue(this.object.color.r, this.object.color.g, this.object.color.b);
	this.castShadow.setValue(this.object.castShadow);
	
	this.shadow.attach(this.object);
};

export {DirectionalLightInspector};