var
	Tweens = require('./util_tween');

module.exports = {
	STORAGE_PREFIX: 'timeliner-',
	Z_INDEX: 999,
	firstDefined: firstDefined,
	style: style,
	saveToFile: saveToFile,
	openAs: openAs,
	format_friendly_seconds: format_friendly_seconds,
	findTimeinLayer: findTimeinLayer,
	timeAtLayer: timeAtLayer,
	proxy_ctx: proxy_ctx
};

/**************************/
// Utils
/**************************/

function firstDefined() {
	for(var i = 0; i < arguments.length; i++) {
		if(typeof arguments[i] !== 'undefined') {
			return arguments[i];
		}
	}
	return undefined;
}

function style(element, var_args) {
	for (var i = 1; i < arguments.length; ++i) {
		var styles = arguments[i];
		for (var s in styles) {
			element.style[s] = styles[s];
		}
	}
}

function saveToFile(string, filename) {
	var a = document.createElement("a");
	document.body.appendChild(a);
	a.style = "display: none";

	var blob = new Blob([string], { type: 'octet/stream' }), // application/json
		url = window.URL.createObjectURL(blob);
	
	a.href = url;
	a.download = filename;

	fakeClick(a);

	setTimeout(function() {
		// cleanup and revoke
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	}, 500);
}



var input, openCallback;

function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object

	console.log('handle file select', files.length);

	var f = files[0];
	if (!f) return;
	// Can try to do MINE match
	// if (!f.type.match('application/json')) {
	//   return;
	// }
	console.log('match', f.type);

	var reader = new FileReader();

	// Closure to capture the file information.
	reader.onload = function(e) {
		var data = e.target.result;
		openCallback(data);
	};
	
	reader.readAsText(f);

	input.value = '';
}


function openAs(callback, target) {
	console.log('openfile...');
	openCallback = callback;

	if (!input) {
		input = document.createElement('input');
		input.style.display = 'none';
		input.type = 'file';
		input.addEventListener('change', handleFileSelect);
		target = target || document.body;
		target.appendChild(input);
	}
	
	fakeClick(input);
}

function fakeClick(target) {
	var e = document.createEvent("MouseEvents");
	e.initMouseEvent(
		'click', true, false, window, 0, 0, 0, 0, 0,
		false, false, false, false, 0, null
	);
	target.dispatchEvent(e);
}

function format_friendly_seconds(s, type) {
	// TODO Refactor to 60fps???
	// 20 mins * 60 sec = 1080 
	// 1080s * 60fps = 1080 * 60 < Number.MAX_SAFE_INTEGER

	var raw_secs = s | 0;
	var secs_micro = s % 60;
	var secs = raw_secs % 60;
	var raw_mins = raw_secs / 60 | 0;
	var mins = raw_mins % 60;
	var hours = raw_mins / 60 | 0;

	var secs_str = (secs / 100).toFixed(2).substring(2);

	var str = mins + ':' + secs_str;

	if (s % 1 > 0) {
		var t2 = (s % 1) * 60;
		if (type === 'frames') str = secs + '+' + t2.toFixed(0) + 'f';
		else str += ((s % 1).toFixed(2)).substring(1);
		// else str = mins + ':' + secs_micro;
		// else str = secs_micro + 's'; /// .toFixed(2)
	}
	return str;	
}

// get object at time
function findTimeinLayer(layer, time) {
	var values = layer.values;
	var i, il;

	// TODO optimize by checking time / binary search

	for (i=0, il=values.length; i<il; i++) {
		var value = values[i];
		if (value.time === time) {
			return {
				index: i,
				object: value
			};
		} else if (value.time > time) {
			return i;
		}
	}

	return i;
}


function timeAtLayer(layer, t) {
	// Find the value of layer at t seconds.
	// this expect layer to be sorted
	// not the most optimized for now, but would do.

	var values = layer.values;
	var i, il, entry, prev_entry;

	il = values.length;

	// can't do anything
	if (il === 0) return;

	if (layer._mute) return

	// find boundary cases
	entry = values[0];
	if (t < entry.time) {
		return {
			value: entry.value,
			can_tween: false, // cannot tween
			keyframe: false // not on keyframe
		};
	}

	for (i=0; i<il; i++) {
		prev_entry = entry;
		entry = values[i];

		if (t === entry.time) {
			// only exception is on the last KF, where we display tween from prev entry
			if (i === il - 1) {
				return {
					// index: i,
					entry: prev_entry,
					tween: prev_entry.tween,
					can_tween: il > 1,
					value: entry.value,
					keyframe: true
				};
			}
			return {
				// index: i,
				entry: entry,
				tween: entry.tween,
				can_tween: il > 1,
				value: entry.value,
				keyframe: true // il > 1
			};
		}
		if (t < entry.time) {
			// possibly a tween
			if (!prev_entry.tween) { // or if value is none
				return {
					value: prev_entry.value,
					tween: false,
					entry: prev_entry,
					can_tween: true,
					keyframe: false
				};
			}

			// calculate tween
			var time_diff = entry.time - prev_entry.time;
			var value_diff = entry.value - prev_entry.value;
			var tween = prev_entry.tween;

			var dt = t - prev_entry.time;
			var k = dt / time_diff;
			var new_value = prev_entry.value + Tweens[tween](k) * value_diff;

			return {
				entry: prev_entry,
				value: new_value,
				tween: prev_entry.tween,
				can_tween: true,
				keyframe: false
			};
		}
	}
	// time is after all entries
	return {
		value: entry.value,
		can_tween: false,
		keyframe: false
	}; 

}


function proxy_ctx(ctx) {
	// Creates a proxy 2d context wrapper which 
	// allows the fluent / chaining API.
	var wrapper = {};

	function proxy_function(c) {
		return function() {
			// Warning: this doesn't return value of function call
			ctx[c].apply(ctx, arguments);
			return wrapper;
		};
	}

	function proxy_property(c) {
		return function(v) {
			ctx[c] = v;
			return wrapper;
		};
	}

	wrapper.run = function(args) {
		args(wrapper);
		return wrapper;
	};

	for (var c in ctx) {
		// if (!ctx.hasOwnProperty(c)) continue;
		// console.log(c, typeof(ctx[c]), ctx.hasOwnProperty(c));
		// string, number, boolean, function, object

		var type = typeof(ctx[c]);
		switch(type) {
			case 'object':
				break;
			case 'function':
				wrapper[c] = proxy_function(c);
				break;
			default:
				wrapper[c] = proxy_property(c);
				break;
		}
	}

	return wrapper;
}
