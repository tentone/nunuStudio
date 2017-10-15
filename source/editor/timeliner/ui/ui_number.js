var Theme = require('./theme'),
	Do = require('do.js'),
	handleDrag = require('./util_handle_drag'),
	style = require('./utils').style,
	firstDefined = require('./utils').firstDefined
	;

/**************************/
// NumberUI
/**************************/

function NumberUI(config) {
	config = config || {};
	var min = config.min === undefined ? -Infinity : config.min;

	// config.xstep and config.ystep allow configuring adjustment
	// speed across each axis.
	// config.wheelStep and config.wheelStepFine allow configuring
	// adjustment speed for mousewheel, and mousewheel while holding <alt>

	// If only config.step is specified, all other adjustment speeds
	// are set to the same value.
	var xstep = firstDefined(config.xstep, config.step, 0.001);
	var ystep = firstDefined(config.ystep, config.step, 0.1);
	var wheelStep = firstDefined(config.wheelStep, ystep);
	var wheelStepFine = firstDefined(config.wheelStepFine, xstep);

	var precision = config.precision || 3;
	// Range
	// Max

	var span = document.createElement('input');
	// span.type = 'number'; // spinner
	
	style(span, {
		textAlign: 'center',
		fontSize: '10px',
		padding: '1px',
		cursor: 'ns-resize',
		width: '40px',
		margin: 0,
		marginRight: '10px',
		appearance: 'none',
		outline: 'none',
		border: 0,
		background: 'none',
		borderBottom: '1px dotted '+ Theme.c,
		color: Theme.c
	});

	var me = this;
	var state, value = 0, unchanged_value;

	this.onChange = new Do();

	span.addEventListener('change', function(e) {
		console.log('input changed', span.value);
		value = parseFloat(span.value, 10);

		fireChange();
	});

	// Allow keydown presses in inputs, don't allow parent to block them
	span.addEventListener('keydown', function(e) {
		e.stopPropagation();
	})

	span.addEventListener('focus', function(e) {
		span.setSelectionRange(0, span.value.length);
	})

	span.addEventListener('wheel', function(e) {
		// Disregard pixel/line/page scrolling and just
		// use event direction.
		var inc = e.deltaY > 0? 1 : -1;
		if(e.altKey) {
			inc *= wheelStepFine;
		} else {
			inc *= wheelStep;
		}
		value = clamp(value + inc);
		fireChange();
	})

	handleDrag(span, onDown, onMove, onUp);

	function clamp(value) {
		return Math.max(min, value);
	}

	function onUp(e) {
		if (e.moved) fireChange();
		else {
			// single click
			span.focus();
		}
	}

	function onMove(e) {
		var dx = e.dx;
		var dy = e.dy;
	
		value = unchanged_value + (dx * xstep) + (dy * -ystep);

		value = clamp(value);

		// value = +value.toFixed(precision); // or toFixed toPrecision
		me.onChange.fire(value, true);
	}

	function onDown(e) {
		unchanged_value = value;
	}

	function fireChange() {
		me.onChange.fire(value);
	}

	this.dom = span;

	// public
	this.setValue = function(v) {
		value = v;
		span.value = value.toFixed(precision);
	};

	this.paint = function() {
		if (value && document.activeElement !== span) {
			span.value = value.toFixed(precision);
		}
	};
}

module.exports = NumberUI;
