"use strict";

var _console = console;
var console = {};
console.history = [];

console.log = function()
{
	_console.log.apply(null, arguments);
};

console.warn = function()
{
	_console.warn.apply(null, arguments);
};

console.error = function()
{
	_console.error.apply(null, arguments);
};

console.assert = function()
{
	_console.assert.apply(null, arguments);
};

console.clear = function()
{
	_console.clear.apply(null, arguments);
};

console.count = function()
{
	_console.count.apply(null, arguments);
};

console.debug = function()
{
	_console.debug.apply(null, arguments);
};

console.dir = function()
{
	_console.dir.apply(null, arguments);
};

console.dirxml = function()
{
	_console.dirxml.apply(null, arguments);
};

console.exception = function()
{
	_console.exception.apply(null, arguments);
};

console.group = function()
{
	_console.group.apply(null, arguments);
};

console.groupCollapsed = function()
{
	_console.groupCollapsed.apply(null, arguments);
};

console.groupEnd = function()
{
	_console.groupEnd.apply(null, arguments);
};

console.info = function()
{
	_console.info.apply(null, arguments);
};

console.profile = function()
{
	_console.profile.apply(null, arguments);
};

console.profileEnd = function()
{
	_console.profileEnd.apply(null, arguments);
};

console.table = function()
{
	_console.table.apply(null, arguments);
};

console.time = function()
{
	_console.time.apply(null, arguments);
};

console.timeEnd = function()
{
	_console.timeEnd.apply(null, arguments);
};

console.timeStamp = function()
{
	_console.timeStamp.apply(null, arguments);
};

console.trace = function()
{
	_console.trace.apply(null, arguments);
};
