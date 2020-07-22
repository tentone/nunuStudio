import {Locale} from "../../../../../locale/LocaleManager.js";
import {Audio} from "../../../../../../core/resources/Audio.js";
import {AudioEmitter} from "../../../../../../core/objects/audio/AudioEmitter.js";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {Action} from "../../../../../history/action/Action.js";
import {ObjectInspector} from "../ObjectInspector.js";
import {Inspector} from "../../Inspector.js";
import {Editor} from "../../../../../Editor.js";
import {Text} from "../../../../../components/Text.js";
import {AudioPlayer} from "../../../../../components/media/AudioPlayer.js";
import {Slider} from "../../../../../components/input/Slider.js";
import {NumberBox} from "../../../../../components/input/NumberBox.js";
import {CheckBox} from "../../../../../components/input/CheckBox.js";

function AudioEmitterInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;

	// Audio player
	this.form.addText(Locale.audio);
	this.player = new AudioPlayer(this.form);
	this.player.size.set(190, 18);
	this.form.add(this.player);
	this.form.nextRow();

	// Volume
	this.form.addText(Locale.volume);
	this.volume = new Slider(this.form);
	this.volume.size.set(80, 18);
	this.volume.setRange(0, 1);
	this.volume.setStep(0.01);
	this.volume.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "volume", self.volume.getValue()));
	});
	this.form.add(this.volume);
	this.form.nextRow();

	// Playback Rate
	this.form.addText("Playback Rate");
	this.playbackRate = new NumberBox(this.form);
	this.playbackRate.size.set(60, 18);
	this.playbackRate.setStep(0.1);
	this.playbackRate.setRange(0, Number.MAX_SAFE_INTEGER);
	this.playbackRate.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "playbackRate", self.playbackRate.getValue()));
	});
	this.form.add(this.playbackRate);
	this.form.nextRow();

	// Autoplay
	this.autoplay = new CheckBox(this.form);
	this.form.addText("Autoplay");
	this.autoplay.size.set(18, 18);
	this.autoplay.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "autoplay", self.autoplay.getValue()));
	});
	this.form.add(this.autoplay);
	this.form.nextRow();

	// Loop
	this.loop = new CheckBox(this.form);
	this.form.addText(Locale.loop);
	this.loop.size.set(18, 18);
	this.loop.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "loop", self.loop.getValue()));
	});
	this.form.add(this.loop);
	this.form.nextRow();
}

AudioEmitterInspector.prototype = Object.create(ObjectInspector.prototype);

AudioEmitterInspector.prototype.destroy = function()
{
	ObjectInspector.prototype.destroy.call(this);

	this.player.destroy();
};

AudioEmitterInspector.prototype.updateInspector = function()
{
	ObjectInspector.prototype.updateInspector.call(this);

	this.player.setAudioBuffer(this.object.audio.data);
	this.volume.setValue(this.object.volume);
	this.static.setValue(!this.object.matrixAutoUpdate);
	this.autoplay.setValue(this.object.autoplay);
	this.loop.setValue(this.object.loop);
	this.playbackRate.setValue(this.object.playbackRate);
};

export {AudioEmitterInspector};