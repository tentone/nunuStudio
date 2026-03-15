import {Locale} from "../../../../locale/LocaleManager.js";
import {Inspector} from "../Inspector.js";
import {Editor} from "../../../../Editor.js";

class LockedInspector extends Inspector {
	constructor(parent, object) {
	super(parent, object);

	// Name
	this.form.addText(Locale.name);
	this.name = this.form.addText("");
	this.form.nextRow();

	// Type
	if (Editor.settings.general.showType)
	{
		this.form.addText(Locale.type);
		this.type = this.form.addText("");
		this.form.nextRow();
	}

	// UUID
	if (Editor.settings.general.showUUID)
	{
		this.form.addText(Locale.uuid);
		this.uuid = this.form.addText("");
		this.form.nextRow();
	}
	}

// Update panel information
	updateInspector() {
	this.name.setText(this.object.name);
	
	if (this.type !== undefined)
	{
		this.type.setText(this.object.type);
	}

	if (this.uuid !== undefined)
	{
		this.uuid.setText(this.object.uuid);
	}
	}

}
export {LockedInspector};
