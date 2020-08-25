import {AnimationTimer} from "../../../core/utils/timer/AnimationTimer.js";
import {EventManager} from "../../../core/utils/EventManager.js";
import {Text} from "../Text.js";
import {ImageContainer} from "../ImageContainer.js";
import {Component} from "../Component.js";

/**
 * Loading box, used to force the user to wait for data from a request.
 *
 * Blocks every input event (cancels propagation).
 * 
 * @class LoadingModal
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
function LoadingModal(parent)
{
	Component.call(this, parent, "div");
	
	var self = this;

	this.element.style.backgroundColor = "var(--color-black-alpha-20)";
	this.element.style.zIndex = "200";

	/**
	 * Counter keeps the amount of requests to show the loadingBox.
	 *
	 * Is is incremented each time the box is show and decremented each time it is hidden.
	 *
	 * The box is only hidden if counter goes bellow 1.
	 *
	 * @attribute counter
	 * @type {number}
	 */
	this.counter = 0;

	/**
	 * Loading text.
	 *
	 * @attribute text
	 * @type {Text}
	 */
	this.text = new Text(this);
	this.text.setText("Loading data");
	this.text.setStyle("color", "var(--color-light)");

	/**
	 * Message presented in the loading box.
	 *
	 * @attribute message
	 * @type {Text}
	 */
	this.message = new Text(this);
	this.message.setText("Please wait");
	this.message.setStyle("color", "var(--color-light)");
	this.message.allowWordBreak(true);

	// Icon
	this.icon = new ImageContainer(this);
	this.icon.setImage("files/loading.png");
	
	var rotation = 0.0;
	
	// Animation
	this.timer = new AnimationTimer(function()
	{
		rotation += 0.05;
		self.icon.setStyle("transform", "rotate(" + rotation + "rad)");
	});
	
	// Event manager
	this.manager = new EventManager();
	this.manager.add(window, "resize", function()
	{
		self.updateInterface();
	});
}

LoadingModal.prototype = Object.create(Component.prototype);

/**
 * Show the loading box.
 * 
 * @method show
 * @param {boolean} showCancel If true shows the cancel button.
 * @param {Function} callback Callback function.
 */
LoadingModal.prototype.show = function()
{	
	this.counter++;

	if (this.counter === 1)
	{
		this.timer.start();
		this.manager.create();
		this.visible = true;
		this.updateInterface();
	}
};

/**
 * Hide modal box.
 *
 * @method hide
 * @param {boolean} force Hide box and reset counter;
 */
LoadingModal.prototype.hide = function(force)
{
	this.counter--;

	if (this.counter < 1 || force === true)
	{
		this.counter = 0;
		this.timer.stop();
		this.manager.destroy();
		this.setVisibility(false);
	}
};

LoadingModal.prototype.destroy = function()
{
	Component.prototype.destroy.call(this);

	this.counter = 0;
	this.timer.stop();
	this.manager.destroy();
};

LoadingModal.prototype.updateSize = function()
{
	this.size.copy(this.parent.size);

	Component.prototype.updateSize.call(this);

	// Text
	this.text.setStyle("fontSize", "38px");
	this.text.size.set(this.size.x, 100);
	this.text.center();
	this.text.position.y -= this.text.size.y;
	this.text.updateInterface();
	
	// Message
	this.message.setStyle("fontSize", "20px");
	this.message.size.set(this.size.x, 100);
	this.message.center();
	this.message.position.y -= this.message.size.y / 2;
	this.message.updateInterface();

	// Icon
	this.icon.size.set(80, 80);
	this.icon.center();
	this.icon.position.y += 30;
	this.icon.updateInterface();
};

export {LoadingModal};
