import {Timer} from "./Timer.js";

/**
 * Animation timer is a special type of timer that uses the requestAnimationFrame() method.
 *
 * This timer calls the method with the same rate as the screen refresh rate.
 *
 * @class AnimationTimer
 * @param {Function} callback Timer callback function.
 */
function AnimationTimer(callback)
{
	/**
	 * Task of the timer, executed at the timer defined rate.
	 * 
	 * @attribute callback
	 * @type {Function}
	 */
	this.callback = callback;
	/**
	 * Indicates if the timer is currently running, it is set to true on start and reset to false on stop.
	 * 
	 * @attribute running
	 * @type {boolean}
	 */
	this.running = false;

	/**
	 * ID of the currently waiting timeout clock. Used to cancel the already request execution of the next clock tick.
	 * 
	 * @attribute running
	 * @type {number}
	 */
	this.id = -1;
}

/**
 * Start timer, is the timer is already running dosen't do anything.
 * 
 * @method start
 */
AnimationTimer.prototype.start = function()
{
	if (this.running)
	{
		return;
	}

	this.running = true;

	var self = this;
	function loop()
	{
		self.callback();

		if (self.running)
		{
			self.id = requestAnimationFrame(loop);
		}
	}

	loop();
};

/**
 * Stop animation timer.
 * 
 * @method stop
 */
AnimationTimer.prototype.stop = function()
{
	this.running = false;
	cancelAnimationFrame(this.id);
};

export {AnimationTimer};
