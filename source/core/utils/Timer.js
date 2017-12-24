"use strict";

/**
 * Time is user to call functions in loop at a defined rate.
 * 
 * Loop time can be changed dinamically.
 *
 * @class Timer
 * @constructor
 */
function Timer(callback, time)
{
	this.callback = callback;
	this.time = time;

	this.running = false;
}

/**
 * Start timer, is the timer is already running dosen't do anything.
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
			setTimeout(loop, self.time);
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
};
