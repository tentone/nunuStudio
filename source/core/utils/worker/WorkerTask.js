import {Math} from "three";

/**
 * A worker task is processed by a worker pool.
 *
 * @class WorkerTask
 * @param {Object} data Data to be sent to the worker.
 * @param {Function} callback Function called when the task finishes.
 */
function WorkerTask(data, callback)
{
	/**
	 * Worker task identifier.
	 *
	 * @attribute uuid
	 * @type {String}
	 */
	this.uuid = Math.generateUUID();

	/**
	 * Data to be sent to the worker.
	 *
	 * @attribute data
	 * @type {Object}
	 */
	this.data = data;

	/**
	 * Function called when the task finishes.
	 *
	 * @attribute callback
	 * @type {Function}
	 */
	this.callback = callback;
}

export {WorkerTask};