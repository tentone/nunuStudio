
/**
 * Time is user to call functions in loop at a defined rate.
 *
 * Loop time can be changed dynamically, it is readjusted on the next timer call.
 *
 * @class Timer
 * @param {Function} callback Callback task method called at the rate of the time.
 * @param {number} Time in ms to run the timer task.
 */
function Timer(callback, time)
{
	/**
	 * Task of the timer, executed at the timer defined rate.
	 * 
	 * @attribute callback
	 * @type {Function}
	 */
	this.callback = callback;

	/**
	 * Period of the timer in milliseconds.
	 * 
	 * @attribute time
	 * @type {number}
	 */
	this.time = time;

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

export {Timer};