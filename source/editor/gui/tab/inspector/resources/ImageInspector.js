import {Locale} from "../../../../locale/LocaleManager.js";
import {ImageChooser} from "../../../../components/input/ImageChooser.js";
import {ResourceInspector} from "./ResourceInspector.js";

class ImageInspector extends ResourceInspector {
	constructor(parent, object) {
	super(parent, object);

	this.form.addText(Locale.image);
	this.image = new ImageChooser(this.form);
	this.image.size.set(120, 120);
	this.form.add(this.image);
	this.form.nextRow();
	}

	updateInspector() {
	super.updateInspector();

	this.image.setValue(this.object);
	}

}
export {ImageInspector};
