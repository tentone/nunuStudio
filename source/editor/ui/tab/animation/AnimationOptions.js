"use strict";

function AnimationOptions(parent, editor, animation)
{
	Element.call(this, parent);

	this.element.style.backgroundColor = Editor.theme.barColor;

	this.editor = editor;
	self.animation = animation;

	var self.editor = this;

	var text = new Text(this.element);
	text.position.set(5, 5);
	text.size.set(50, 20);
	text.setText("Enabled");
	text.updateInterface();

	this.enabled = new CheckBox(this.element);
	this.enabled.position.set(55, 5);
	this.enabled.size.set(15, 15);
	this.enabled.updateInterface();
	this.enabled.setOnChange(function()
	{
		self.animation.enabled = self.enabled.getValue();
		self.editor.createAnimationMixer(true);
	});

	var text = new Text(this.element);
	text.position.set(70, 5);
	text.size.set(100, 20);
	text.setText("Duration");
	text.updateInterface();

	this.duration = new NumberBox(this.element);
	this.duration.position.set(150, 5);
	this.duration.size.set(60, 18);
	this.duration.updateInterface();
	this.duration.setOnChange(function()
	{
		self.animation.duration = self.duration.getValue();
		self.editor.createTimeline();
		self.editor.createAnimationMixer();
	});

	var text = new Text(this.element);
	text.position.set(190, 5);
	text.size.set(100, 20);
	text.setText("Loop");
	text.updateInterface();

	this.loop = new DropdownList(this.element);
	this.loop.position.set(260, 5);
	this.loop.size.set(90, 18);
	this.loop.addValue("Once", THREE.LoopOnce);
	this.loop.addValue("Repeat", THREE.LoopRepeat);
	this.loop.addValue("PingPong", THREE.LoopPingPong);
	this.loop.updateInterface();
	this.loop.setOnChange(function()
	{
		self.animation.loop = self.loop.getValue();
		self.editor.createAnimationMixer(true);
	});

	var text = new Text(this.element);
	text.position.set(335, 5);
	text.size.set(100, 20);
	text.setText("Speed");
	text.updateInterface();

	this.timeScale = new NumberBox(this.element);
	this.timeScale.position.set(410, 5);
	this.timeScale.size.set(60, 18);
	this.timeScale.updateInterface();
	this.timeScale.setOnChange(function()
	{
		self.animation.timeScale = self.timeScale.getValue();
		self.editor.createAnimationMixer(true);
	});
}

AnimationOptions.prototype = Object.create(Element.prototype);

AnimationOptions.prototype.updateAnimation = function()
{
	this.loop.setValue(this.animation.loop);
	this.timeScale.setValue(this.animation.timeScale);
	this.duration.setValue(this.animation.duration);
	this.enabled.setValue(this.animation.enabled);
};

AnimationOptions.prototype.updateInterface = function()
{
	this.element.style.left = this.position.x + "px";
	this.element.style.top = this.position.y + "px";
	this.element.style.height = this.size.y + "px";
	this.element.style.width = "100%";
};