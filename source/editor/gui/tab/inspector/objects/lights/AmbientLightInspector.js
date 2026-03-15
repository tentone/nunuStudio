import {Color} from "three";
import {Locale} from "../../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {ObjectInspector} from "../ObjectInspector.js";
import {Editor} from "../../../../../Editor.js";
import {ColorChooser} from "../../../../../components/input/ColorChooser.js";

class AmbientLightInspector extends ObjectInspector {
	constructor(parent, object) {
	super(parent, object);

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
	}

	updateInspector() {
	super.updateInspector();
	
	this.color.setValue(this.object.color.r, this.object.color.g, this.object.color.b);
	}

}

export {AmbientLightInspector};
