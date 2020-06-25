import {Sky} from "../../../../../../../core/objects/misc/Sky.js";
import {HemisphereLight} from "../../../../../../../core/objects/lights/HemisphereLight.js";
import {ChangeAction} from "../../../../../../history/action/ChangeAction.js";
import {Action} from "../../../../../../history/action/Action.js";
import {ObjectInspector} from "../../ObjectInspector.js";
import {Inspector} from "../../../Inspector.js";
import {Editor} from "../../../../../../Editor.js";
import {Text} from "../../../../../../components/Text.js";
import {ColorChooser} from "../../../../../../components/input/ColorChooser.js";
import {Color} from "three";

function HemisphereLightInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;

	// Sky color
	this.form.addText(Locale.skyColor);
	this.color = new ColorChooser(this.form);
	this.color.size.set(80, 18);
	this.color.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "color", new Color(self.color.getValueHex())));
	});
	this.form.add(this.color);
	this.form.nextRow();

	// Ground color
	this.form.addText(Locale.groundColor);
	this.groundColor = new ColorChooser(this.form);
	this.groundColor.size.set(80, 18);
	this.groundColor.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "groundColor", new Color(self.groundColor.getValueHex())));
	});
	this.form.add(this.groundColor);
	this.form.nextRow();
}

HemisphereLightInspector.prototype = Object.create(ObjectInspector.prototype);

HemisphereLightInspector.prototype.updateInspector = function()
{
	ObjectInspector.prototype.updateInspector.call(this);

	this.color.setValue(this.object.color.r, this.object.color.g, this.object.color.b);
	this.groundColor.setValue(this.object.groundColor.r, this.object.groundColor.g, this.object.groundColor.b);
};

export {HemisphereLightInspector};