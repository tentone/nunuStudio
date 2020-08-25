import {VideoPlayer} from "../../../../components/media/VideoPlayer.js";
import {ResourceInspector} from "./ResourceInspector.js";

function VideoInspector(parent, object)
{
	ResourceInspector.call(this, parent, object);


	this.form.addText("Video");
	this.video = new VideoPlayer(this.form);
	this.video.size.set(120, 120);
	this.form.add(this.video);
	this.form.nextRow();
}

VideoInspector.prototype = Object.create(ResourceInspector.prototype);

VideoInspector.prototype.updateInspector = function()
{
	ResourceInspector.prototype.updateInspector.call(this);

	this.video.setValue(this.object);
};
export {VideoInspector};
