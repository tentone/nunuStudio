import {Locale} from "../../../../locale/LocaleManager.js";
import {ResourceInspector} from "./ResourceInspector.js";
import {AudioPlayer} from "../../../../components/media/AudioPlayer.js";

function AudioInspector(parent, object)
{
	ResourceInspector.call(this, parent, object);


	// Audio player
	this.form.addText(Locale.audio);
	this.player = new AudioPlayer(this.form);
	this.player.size.set(190, 18);
	this.form.add(this.player);
	this.form.nextRow();
}

AudioInspector.prototype = Object.create(ResourceInspector.prototype);

AudioInspector.prototype.destroy = function()
{
	ResourceInspector.prototype.destroy.call(this);

	this.player.destroy();
};

AudioInspector.prototype.updateInspector = function()
{
	ResourceInspector.prototype.updateInspector.call(this);

	this.player.setAudioBuffer(this.object.data);
};
export {AudioInspector};