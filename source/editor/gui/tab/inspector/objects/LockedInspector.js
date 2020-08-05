import {Locale} from "../../../../locale/LocaleManager.js";
import {Inspector} from "../Inspector.js";
import {Editor} from "../../../../Editor.js";

function LockedInspector(parent, object)
{
	Inspector.call(this, parent, object);

	// Name
	this.form.addText(Locale.name);
	this.name = this.form.addText("");
	this.form.nextRow();

	// Type
	if(Editor.settings.general.showType)
	{
		this.form.addText(Locale.type);
		this.type = this.form.addText("");
		this.form.nextRow();
	}

	// UUID
	if(Editor.settings.general.showUUID)
	{
		this.form.addText(Locale.uuid);
		this.uuid = this.form.addText("");
		this.form.nextRow();
	}
}

LockedInspector.prototype = Object.create(Inspector.prototype);

// Update panel information
LockedInspector.prototype.updateInspector = function()
{
	this.name.setText(this.object.name);
	
	if(this.type !== undefined)
	{
		this.type.setText(this.object.type);
	}

	if(this.uuid !== undefined)
	{
		this.uuid.setText(this.object.uuid);
	}
};
export {LockedInspector};