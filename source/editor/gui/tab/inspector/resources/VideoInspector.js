import {VideoPlayer} from "../../../../components/media/VideoPlayer.js";
import {ResourceInspector} from "./ResourceInspector.js";

class VideoInspector extends ResourceInspector {
	constructor(parent, object) {
	super(parent, object);

	this.form.addText("Video");
	this.video = new VideoPlayer(this.form);
	this.video.size.set(120, 120);
	this.form.add(this.video);
	this.form.nextRow();
	}

	updateInspector() {
	super.updateInspector();

	this.video.setValue(this.object);
	}

}
export {VideoInspector};
