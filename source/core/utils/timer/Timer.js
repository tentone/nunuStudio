"use strict";

/**
 * Time is user to call functions in loop at a defined rate.
 * 
 * Loop time can be changed dinamically.
 *
 * @class Timer
 * @param {Function} callback Timer callback function.
 * @param {number} time Timer period.
 */
function Timer(callback, time)
{
	this.callback = callback;
	this.time = time;

	this.running = false;
	this.id = -1;
}

/**
 * Start timer, is the timer is already running dosen't do anything.
 *
 * The callback is called right after starting the timer.
 * 
 * @method start
 */
Timer.prototype.start = function()
{
	if(this.running)
	{
		return;
	}

	this.running = true;

	var self = this;
	function loop()
	{
		self.callback();

		if(self.running)
		{
			self.id = setTimeout(loop, self.time);
		}
	}

	loop();
};

/**
 * Stop timer.
 * 
 * @method stop
 */
Timer.prototype.stop = function()
{
	this.running = false;
	clearTimeout(self.id);
};
