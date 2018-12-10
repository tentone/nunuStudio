"use strict";

/**
 * The intepolator is used to interpolate values between ranges for a period of time.
 *
 * The animation is self contained using async callbacks.
 *
 * @class TweenAnimation
 * @param {Object} object Object that contains the attribute.
 * @param {String} attribute Name of the attribute.
 * @param {Object} target Final target value.
 * @param {Number} time Time of the animation in milliseconds.
 * @param {Function} onUpdate Callback function that runs after updating the value.
 */
function TweenAnimation(object, attribute, target, time, onUpdate)
{
	var isVectorial = ValidationUtils.isVetorial(object[attribute]);

	var self = this;

	/**
	 * Object that contains the attribute to be interpolated.
	 *
	 * @attribute object
	 * @type {Object}
	 */
	this.object = object;

	/**
	 * Name of the attribute.
	 *
	 * @attribute attribute
	 * @type {String}
	 */
	this.attribute = attribute;

	/**
	 * Initial value.
	 *
	 * @attribute initial
	 * @type {Object}
	 */
	this.initial = isVectorial ? object[attribute].clone() : {x: object[attribute]};

	/**
	 * Target value.
	 *
	 * @attribute target
	 * @type {Object}
	 */
	this.target = isVectorial ? target : {x: target};

	/**
	 * Animation duration in milliseconds.
	 *
	 * @attribute time
	 * @type {Number}
	 */
	this.time = time;

	/**
	 * On update callback method.
	 *
	 * @attribute onUpdate
	 * @type {Function}
	 */
	this.onUpdate = onUpdate !== undefined ? onUpdate : null;

	/**
	 * TWEEN object used to execute the animation.
	 *
	 * @attribute tween
	 * @type {TWEEN.Tween}
	 */
	this.tween = new TWEEN.Tween(this.initial);
	this.tween.to(this.target, this.time);
	this.tween.easing(TWEEN.Easing.Cubic.InOut);
	this.tween.onUpdate(function()
	{
		if(isVectorial)
		{
			object[attribute].copy(self.initial);
		}
		else
		{
			object[attribute] = self.initial.x;
		}

		if(onUpdate !== undefined)
		{
			onUpdate();
		}
	});
}

/**
 * Set an on complete callback function, that is executed when the animation finishes.
 *
 * @method onComplete
 * @param {Function} callback
 */
TweenAnimation.prototype.onComplete = function(callback)
{
	this.tween.onComplete(callback);
};

/**
 * Start the animation.
 *
 * @method start
 */
TweenAnimation.prototype.start = function()
{
	this.tween.start();
};