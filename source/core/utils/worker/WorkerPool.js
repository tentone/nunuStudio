import {WorkerTask} from "./WorkerTask.js";

/**
 * Worker pool is used to manage and execute mutiple task of the same type using a predefined number of workers.
 *
 * Workers are pre initialized to avoid the overhead of creation during execution.
 *
 * These workers receive messages with a uuid of the task and the data to be processed.
 *
 * {
 *   uuid: <Task UUID>,
 *   data: <Data object>
 * }
 *
 * The worker should respond with a message using the same structure.
 *
 * @class WorkerPool
 * @param {String} file Worker JS file path.
 * @param {Number} size Number of workers to be created for this pool.
 */
function WorkerPool(file, size)
{
	/**
	 * Size of this worker pool.
	 *
	 * @attribute size
	 * @type {Number}
	 */
	this.size = size;

	/**
	 * Javascript file for the workers.
	 * 
	 * @attribute file
	 * @type {String}
	 */
	this.file = file;

	/**
	 * List of worker of this pool.
	 *
	 * @attribute workers
	 * @type {Array}
	 */
	this.workers = [];

	/**
	 * Worker index to be used for the next task.
	 *
	 * @attribute next
	 * @type {Number}
	 */
	this.next = 0;
	this.createWorkers();

	/**
	 * Tasks waiting to be processed.
	 *
	 * @attribute tasks
	 * @type {Array}
	 */
	this.tasks = {};
}

/**
 * Create workers for this pool.
 * 
 * @method createWorkers
 */
WorkerPool.prototype.createWorkers = function()
{
	for(var i = 0; i < this.workers.length; i++)
	{
		this.workers[i].terminate();
	}

	var self = this;

	function onmessage(event)
	{
		var uuid = event.data.uuid;

		if(self.tasks[uuid] !== undefined)
		{
			var task = self.tasks[uuid];
			task.callback(event.data.data);
			delete self.tasks[uuid];
		}
		else
		{
			throw new Error("Unknown worker task " + uuid);
		}
	}

	this.workers = [];
	this.next = 0;

	for(var i = 0; i < this.size; i++)
	{
		var worker = new Worker(this.file);
		worker.onmessage = onmessage;
		this.workers.push(worker);
	}
};

/**
 * Create task to be executed in this pool.
 *
 * @method runTask
 * @param {Object} data Data to be sent to the worker.
 * @param {Function} callback Function to be called by the worker after processing the data sent. 
 */
WorkerPool.prototype.runTask = function(data, callback)
{
	var task = new WorkerTask(data, callback);
	this.tasks[task.uuid] = task;

	//Post task to worker
	this.workers[this.next].postMessage(
	{
		data: task.data,
		uuid: task.uuid
	});

	//Update worker pointer
	this.next++;
	if(this.next >= this.workers.length)
	{
		this.next = 0;
	}
};

export {WorkerPool};