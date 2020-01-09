"use strict";

/**
 * Animation tab menu bar with options to set the properties of the animation clip.
 *
 * @class AnimationClipMenuBar
 * @extends {Element}
 */
function AnimationClipMenuBar(parent, editor, animation)
{
	Element.call(this, parent, "div");

	this.element.style.backgroundColor = Editor.theme.barColor;
	this.element.style.position = "relative";
	this.element.style.width = "100%";
	this.element.style.height = "30px";

	this.editor = editor;
	this.animation = animation;

	var self = this;

	var text = new Text(this);
	text.position.set(5, 5);
	text.size.set(50, 20);
	text.setText("Enabled");
	text.updateInterface();

	this.enabled = new CheckBox(this);
	this.enabled.position.set(55, 5);
	this.enabled.size.set(18, 18);
	this.enabled.updateInterface();
	this.enabled.setOnChange(function()
	{
		self.animation.enabled = self.enabled.getValue();
		self.editor.createAnimationMixer(true);
	});

	var text = new Text(this);
	text.position.set(70, 5);
	text.size.set(100, 20);
	text.setText("Duration");
	text.updateInterface();

	this.duration = new NumberBox(this);
	this.duration.position.set(150, 5);
	this.duration.size.set(60, 18);
	this.duration.updateInterface();
	this.duration.setOnChange(function()
	{
		self.animation.duration = self.duration.getValue();
		self.editor.createTimeline();
		self.editor.createAnimationMixer();
	});

	var text = new Text(this);
	text.position.set(190, 5);
	text.size.set(100, 20);
	text.setText(Locale.loop);
	text.updateInterface();

	this.loop = new DropdownList(this);
	this.loop.position.set(260, 5);
	this.loop.size.set(90, 18);
	this.loop.addValue("Once", THREE.LoopOnce);
	this.loop.addValue(Locale.repeat, THREE.LoopRepeat);
	this.loop.addValue("PingPong", THREE.LoopPingPong);
	this.loop.updateInterface();
	this.loop.setOnChange(function()
	{
		self.animation.loop = self.loop.getValue();
		self.editor.createAnimationMixer(true);
	});

	var text = new Text(this);
	text.position.set(335, 5);
	text.size.set(100, 20);
	text.setText("Speed");
	text.updateInterface();

	this.timeScale = new NumberBox(this);
	this.timeScale.position.set(410, 5);
	this.timeScale.size.set(60, 18);
	this.timeScale.updateInterface();
	this.timeScale.setOnChange(function()
	{
		self.animation.timeScale = self.timeScale.getValue();
		self.editor.createAnimationMixer(true);
	});

	this.updateAnimation();
}

AnimationClipMenuBar.prototype = Object.create(Element.prototype);

AnimationClipMenuBar.prototype.updateAnimation = function()
{
	this.loop.setValue(this.animation.loop);
	this.timeScale.setValue(this.animation.timeScale);
	this.duration.setValue(this.animation.duration);
	this.enabled.setValue(this.animation.enabled);
};

AnimationClipMenuBar.prototype.updateInterface = function(){};