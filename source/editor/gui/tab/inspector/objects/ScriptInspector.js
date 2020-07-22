import {Locale} from "../../../../locale/LocaleManager.js";
import {Script} from "../../../../../core/objects/script/Script.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Action} from "../../../../history/action/Action.js";
import {ObjectInspector} from "./ObjectInspector.js";
import {Inspector} from "../Inspector.js";
import {Editor} from "../../../../Editor.js";
import {Text} from "../../../../components/Text.js";
import {DropdownList} from "../../../../components/input/DropdownList.js";

function ScriptInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;

	this.form.addText(Locale.libraryMode);
	this.mode = new DropdownList(this.form);
	this.mode.size.set(100, 18);
	this.mode.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "mode", self.mode.getValue()));
	});
	this.mode.addValue(Locale.evaluate, Script.EVALUATE);
	this.mode.addValue(Locale.append, Script.APPEND);
	this.mode.addValue(Locale.include, Script.INCLUDE);
	this.form.add(this.mode);
	this.form.nextRow();
}

ScriptInspector.prototype = Object.create(ObjectInspector.prototype);

ScriptInspector.prototype.updateInspector = function()
{
	ObjectInspector.prototype.updateInspector.call(this);
	
	this.mode.setValue(this.object.mode);
};

export {ScriptInspector};