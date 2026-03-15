import {Locale} from "../../../../locale/LocaleManager.js";
import {AudioPlayer} from "../../../../components/media/AudioPlayer.js";
import {ResourceInspector} from "./ResourceInspector.js";

class AudioInspector extends ResourceInspector {
	constructor(parent, object) {
	super(parent, object);

	// Audio player
	this.form.addText(Locale.audio);
	this.player = new AudioPlayer(this.form);
	this.player.size.set(190, 18);
	this.form.add(this.player);
	this.form.nextRow();
	}

	destroy() {
	super.destroy();

	this.player.destroy();
	}

	updateInspector() {
	super.updateInspector();

	this.player.setAudioBuffer(this.object.data);
	}

}
export {AudioInspector};
