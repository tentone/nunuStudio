"use strict";

/**
 * Loading box, used to force the user to wait for data from a request.
 *
 * Blocks every input event (cancels propagation).
 * 
 * @class LoadingModal
 * @extends {Element}
 * @param {Element} parent Parent element.
 */
function LoadingModal(parent)
{
	Element.call(this, parent, "div");
	
	var self = this;

	this.element.style.backgroundColor = Palette.getColorAlpha("white", 0.7);
	this.element.style.zIndex = "200";

	/**
	 * Counter keeps the amount of requests to show the loadingBox.
	 *
	 * Is is incremented each time the box is show and decremented each time it is hidden.
	 *
	 * The box is only hidden if counter goes bellow 1.
	 *
	 * @attribute counter
	 * @type {Number}
	 */
	this.counter = 0;

	/**
	 * Loading text.
	 *
	 * @attribute text
	 * @type {Text}
	 */
	this.text = new Text(this);
	this.text.setText(Locale.text.misc.loading.loading);
	this.text.setStyle("fontSize", "38px");
	this.text.setStyle("color", Palette.getColor("sapphire"));

	/**
	 * Message presented in the loading box.
	 *
	 * @attribute message
	 * @type {Text}
	 */
	this.message = new Text(this);
	this.message.setText(Locale.text.misc.loading.message);
	this.message.setStyle("fontSize", "20px");
	this.message.setStyle("color", Palette.getColor("dark-blue-grey"));
	this.message.allowWordBreak(true);

	//Icon
	this.icon = new Image(this);
	this.icon.setImage("data/resources/loading/hourglass.svg");
	
	var rotation = 0.0;
	
	//Animation
	this.timer = new AnimationTimer(function()
	{
		rotation += 0.05;
		self.icon.setStyle("transform", "rotate(" + rotation + "rad)");
	});
	
	//Event manager
	this.manager = new EventManager();
	this.manager.add(window, "resize", function(event)
	{
		self.updateInterface();
	});
}

LoadingModal.prototype = Object.create(Element.prototype);

/**
 * Show the loading box.
 * 
 * @method show
 * @param {Boolean} showCancel If true shows the cancel button.
 * @param {Function} callback Callback function.
 */
LoadingModal.prototype.show = function()
{	
	this.counter++;

	if(this.counter === 1)
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
 * @param {Boolean} force Hide box and reset counter;
 */
LoadingModal.prototype.hide = function(force)
{
	this.counter--;

	if(this.counter < 1 || force === true)
	{
		this.counter = 0;
		this.timer.stop();
		this.manager.destroy();
		this.setVisibility(false);
	}
};

LoadingModal.prototype.destroy = function()
{
	Element.prototype.destroy.call(this);

	this.manager.destroy();
};

LoadingModal.prototype.updateSize = function()
{
	this.size.copy(this.parent.size);

	Element.prototype.updateSize.call(this);

	//Text
	this.text.size.set(this.size.x, 100);
	this.text.center();
	this.text.position.y -= this.text.size.y;
	this.text.updateInterface();
	
	//Message
	this.message.size.set(350, 100);
	this.message.center();
	this.message.position.y -= this.message.size.y / 4;
	this.message.updateInterface();

	//Icon
	this.icon.size.set(38, 71);
	this.icon.center();
	this.icon.position.y += 80;
	this.icon.updateInterface();
};
