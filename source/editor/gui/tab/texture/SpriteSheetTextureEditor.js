import {Texture} from "../../../../../core/texture/Texture.js";
import {SpriteSheetTexture} from "../../../../../core/texture/SpriteSheetTexture.js";
import {Image} from "../../../../../core/resources/Image.js";
import {Sprite} from "../../../../../core/objects/sprite/Sprite.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {CallbackAction} from "../../../../history/action/CallbackAction.js";
import {Action} from "../../../../history/action/Action.js";
import {TextureEditor} from "../TextureEditor.js";
import {Editor} from "../../../../Editor.js";
import {Text} from "../../../../components/Text.js";
import {VectorBox} from "../../../../components/input/VectorBox.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {ImageChooser} from "../../../../components/input/ImageChooser.js";


function SpriteSheetTextureEditor(parent, closeable, container, index)
{
	TextureEditor.call(this, parent, closeable, container, index);

	var self = this;

	// Image
	this.form.addText(Locale.image);
	this.source = new ImageChooser(this.form);
	this.source.size.set(0, 100);
	this.source.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.texture, "source", self.source.getValue()), function()
		{
			self.texture.updateSource();
		}));
	});
	this.form.add(this.source);
	this.form.nextRow();

	// Sheet format
	this.form.addText("Sheet format");
	this.frames = new VectorBox(this.form);
	this.frames.setType(VectorBox.VECTOR2);
	this.frames.size.set(120, 18);
	this.frames.setValue(1, 1, 0);
	this.frames.setStep(1.0);
	this.frames.setOnChange(function()
	{
		var value = self.frames.getValue();
		self.texture.framesHorizontal = value.x;
		self.texture.framesVertical = value.y;

		self.totalFrames.setValue(self.texture.totalFrames);
		self.beginFrame.setValue(self.texture.beginFrame);
		self.endFrame.setValue(self.texture.endFrame);
	});
	this.form.add(this.frames);
	this.form.nextRow();

	// Total frames
	this.form.addText("Total Frames");
	this.totalFrames = new NumberBox(this.form);
	this.totalFrames.size.set(60, 18);
	this.totalFrames.setStep(1.0);
	this.totalFrames.setRange(0, Number.MAX_SAFE_INTEGER);
	this.totalFrames.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.texture, "totalFrames", self.totalFrames.getValue()));
		self.beginFrame.setValue(self.texture.beginFrame);
		self.endFrame.setValue(self.texture.endFrame);
	});
	this.form.add(this.totalFrames);
	this.form.nextRow();

	// Begin frame
	this.form.addText("Begin Frame");
	this.beginFrame = new NumberBox(this.form);
	this.beginFrame.size.set(60, 18);
	this.beginFrame.setStep(1.0);
	this.beginFrame.setRange(0, Number.MAX_SAFE_INTEGER);
	this.beginFrame.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.texture, "beginFrame", self.beginFrame.getValue()));
	});
	this.form.add(this.beginFrame);
	this.form.nextRow();

	// End frame
	this.form.addText("End Frame");
	this.endFrame = new NumberBox(this.form);
	this.endFrame.size.set(60, 18);
	this.endFrame.setStep(1.0);
	this.endFrame.setRange(0, Number.MAX_SAFE_INTEGER);
	this.endFrame.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.texture, "endFrame", self.endFrame.getValue()));
	});
	this.form.add(this.endFrame);
	this.form.nextRow();

	// Speed
	this.form.addText(Locale.speed);
	this.animationSpeed = new NumberBox(this.form);
	this.animationSpeed.size.set(60, 18);
	this.animationSpeed.setStep(0.01);
	this.animationSpeed.setRange(0, Number.MAX_SAFE_INTEGER);
	this.animationSpeed.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.texture, "animationSpeed", self.animationSpeed.getValue()));
	});
	this.form.add(this.animationSpeed);
	this.form.nextRow();
}

SpriteSheetTextureEditor.prototype = Object.create(TextureEditor.prototype);

SpriteSheetTextureEditor.prototype.attach = function(texture)
{
	TextureEditor.prototype.attach.call(this, texture);

	this.source.setValue(this.texture.source);
	this.frames.setValue(this.texture.framesHorizontal, this.texture.framesVertical);
	this.totalFrames.setValue(this.texture.totalFrames);
	this.beginFrame.setValue(this.texture.beginFrame);
	this.endFrame.setValue(this.texture.endFrame);
	this.animationSpeed.setValue(this.texture.animationSpeed);
};
export {SpriteSheetTextureEditor};