import {Video} from "../../../../../../core/resources/Video.js";
import {Resource} from "../../../../../../core/resources/Resource.js";
import {ResourceInspector} from "../ResourceInspector.js";
import {Inspector} from "../../Inspector.js";
import {Text} from "../../../../../components/Text.js";
import {VideoPlayer} from "../../../../../components/media/VideoPlayer.js";

function VideoInspector(parent, object)
{
	ResourceInspector.call(this, parent, object);

	var self = this;

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