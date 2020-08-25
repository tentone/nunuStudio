import {Mouse} from "../input/Mouse.js";

/**
 * EventManager is used to manager DOM events creationg and destruction in a single function call.
 *
 * It is used by objects to make it easier to add, manager and remove events from DOM elements.
 *
 * @constructor
 * @class EventManager
 * @module Utils
 */
function EventManager()
{
	/**
	 * Stores all events in the manager, their target and callback.
	 * 
	 * Format [target, event, callback, active]
	 * 
	 * @attribute events
	 * @type {Array}
	 */
	this.events = [];
}

/**
 * Add and create and event to the event manager.
 *
 * Creates the event and attaches it to the DOM element immediatly.
 *
 * @method addCreate
 * @param {Element} target Event target element.
 * @param {string} event Event name.
 * @param {Function} callback Callback function.
 */
EventManager.prototype.addAndCreate = function(target, event, callback)
{
	var data = [target, event, callback, true];
	data[0].addEventListener(data[1], data[2]);
	data[3] = true;
	this.events.push(data);
};


/**
 * Remove and destroy event(s) from a DOM element and from the manager.
 *
 * @method remove
 * @param {Element} target Event target element to remove elements from.
 * @param {string} event Event name to be removed.
 */
EventManager.prototype.remove = function(target, event)
{
	for (var i = this.events.length - 1; i >= 0; i--)
	{
		// Check if the target and event matches
		if (this.events[i][0] === target && this.events[i][1] === event)
		{
			// Destroy event if it is active
			if (this.events[i][3])
			{
				this.events[i][0].removeEventListener(this.events[i][1], this.events[i][2]);
				this.events[i][3] = false;
			}

			this.events.splice(i, 1);
		}
	}
};


/**
 * Add new event to the manager, the event is not created immediatly the create() method had to be called to create the event.
 *
 * @method add
 * @param {Element} target Event target element.
 * @param {string} event Event name.
 * @param {Function} callback Callback function.
 */
EventManager.prototype.add = function(target, event, callback)
{
	this.events.push([target, event, callback, false]);
};

/**
 * Destroys this manager by stopping all event handlers and remove them from the manager.
 *
 * @method clear
 */
EventManager.prototype.clear = function()
{
	this.destroy();
	this.events = [];
};

/**
 * Creates the events in this manager by attaching them to the DOM elements.
 *
 * Uses the element.addEventListener() method to attach the event handlers.
 * 
 * @method create
 */
EventManager.prototype.create = function()
{
	for (var i = 0; i < this.events.length; i++)
	{
		var event = this.events[i];
		event[0].addEventListener(event[1], event[2]);
		event[3] = true;
	}
};

/**
 * Destroy all events in this manager, stop the events.
 *
 * Uses the element.removeEventListener() method to destroy the event handlers.
 *
 * Does not remove the events from the manager.
 * 
 * @method destroy
 */
EventManager.prototype.destroy = function()
{
	for (var i = 0; i < this.events.length; i++)
	{
		var event = this.events[i];
		event[0].removeEventListener(event[1], event[2]);
		event[3] = false;
	}
};

/**
 * Add a scroll event to a target element.
 *
 * @method addScrollEvent
 * @param {Element} target Event target element.
 * @param {Function} callback Callback function.
 */
EventManager.prototype.addScrollEvent = function(target, callback)
{
	if (window.onmousewheel !== undefined)
	{
		this.add(target, "mousewheel", callback);
	}
	else if (window.addEventListener !== undefined)
	{
		this.add(target, "DOMMouseScroll", function(event)
		{
			event.deltaY = event.detail * 30;
			callback(event);
		});
	}
	else
	{
		this.add(target, "wheel", callback);
	}
};
export {EventManager};
