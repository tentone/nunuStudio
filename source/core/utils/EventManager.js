"use strict";

/**
 * EventManager is used to manager DOM events creationg and destruction in a single function call.
 *
 * It is used by objects to make it easier to add and remove events from global DOM objects.
 *
 * @class EventManager
 * @module Utils
 */

/**
 * Stores all events in the manager, their target and callback.
 * 
 * Format [target, event, callback, active]
 * 
 * @attribute events
 * @type {Array}
 */
function EventManager()
{
	this.events = [];
}

/**
 * Add new event to the manager.
 *
 * @method add
 * @param {DOM} target Event target element.
 * @param {String} event Event name.
 * @param {Function} callback Callback function.
 */
EventManager.prototype.add = function(target, event, callback)
{
	this.events.push([target, event, callback, false]);
};

/**
 * Destroys this manager and remove all events.
 *
 * @method clear
 */
EventManager.prototype.clear = function()
{
	this.destroy();
	this.events = [];
};

/**
 * Creates all events in this manager.
 * 
 * @method create
 */
EventManager.prototype.create = function()
{
	for(var i = 0; i < this.events.length; i++)
	{
		var event = this.events[i];
		event[0].addEventListener(event[1], event[2]);
		event[3] = true;
	}
};

/**
 * Removes all events in this manager.
 * 
 * @method destroy
 */
EventManager.prototype.destroy = function()
{
	for(var i = 0; i < this.events.length; i++)
	{
		var event = this.events[i];
		event[0].removeEventListener(event[1], event[2]);
		event[3] = false;
	}
};